"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Book, GoogleBook } from "../types";
import Image from "next/image";
import { saveBook, searchBooks } from "@/app/api/books/books";

export default function BookModal({
  onClose,
  onBookAdded,
  bookToEdit,
}: {
  onClose: () => void;
  onBookAdded: (book: Book) => void;
  bookToEdit?: Book | null;
}) {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [date, setDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [searchResults, setSearchResults] = useState<GoogleBook[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (bookToEdit) {
      setTitle(bookToEdit.title);
      setAuthor(bookToEdit.author);
      setDate(new Date(bookToEdit.date).toISOString().split("T")[0]);
      setImageUrl(bookToEdit.imageUrl || "");
    }
  }, [bookToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date) {
      alert("Please provide a valid date.");
      return;
    }

    if (!userId) {
      alert("❌ You must be logged in to add or edit a book.");
      console.error("❌ userId is undefined or null");
      return;
    }

    const payload = { title, author, date, imageUrl, userId };

    try {
      const savedBook = await saveBook(payload, bookToEdit?.id?.toString());
      onBookAdded({ ...savedBook, id: Number(savedBook.id) });
      onClose();
    } catch (error) {
      console.error("❌ Error in saveBook:", error);
      alert(
        `Error saving book: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const handleSearch = async (query: string) => {
    if (!query) {
      alert("Please enter a search query.");
      return;
    }

    const cleanQuery = query
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .toLowerCase()
      .trim();

    setSearchQuery(cleanQuery);
    setIsSearching(true);

    try {
      const results = await searchBooks(cleanQuery);
      setSearchResults(results);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectBook = (book: GoogleBook) => {
    const volumeInfo = book.volumeInfo;
    setTitle(volumeInfo.title || "Unknown Title");
    setAuthor((volumeInfo.authors || []).join(", ") || "Unknown Author");
    setImageUrl(volumeInfo.imageLinks?.thumbnail || "");
    setSearchResults([]);
  };
  const highlightText = (text: string, query: string) => {
    if (!query || !text) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="bg-yellow-200 font-bold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] flex items-center justify-center z-50">
      <div
        className="bg-white p-10 rounded-xl shadow-2xl max-w-lg w-full border border-[rgba(224,178,26,0.7)] backdrop-blur-md"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
      >
        <h2
          className="text-3xl font-bold mb-6 text-center"
          style={{ color: "var(--gold)" }}
        >
          {bookToEdit ? "Edit Book" : "Add a New Book"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input
            type="text"
            placeholder="Search for books..."
            className="w-full p-2 border rounded"
            onChange={(e) => handleSearch(e.target.value)}
          />
          {isSearching && <p>Searching...</p>}
          <ul className="mt-4 max-h-40 overflow-y-auto border rounded">
            {searchResults.map((book) => (
              <li
                key={book.id}
                className="p-2 border-b cursor-pointer hover:bg-gray-100 flex items-center"
                onClick={() => handleSelectBook(book)}
              >
                {book.volumeInfo.imageLinks?.thumbnail ? (
                  <Image
                    src={book.volumeInfo.imageLinks.thumbnail}
                    alt={book.volumeInfo.title || "No title available"}
                    width={50}
                    height={50}
                    layout="intrinsic"
                    className="w-12 h-12 mr-4"
                  />
                ) : (
                  <Image
                    src="https://via.placeholder.com/50"
                    alt="Placeholder"
                    width={50}
                    height={50}
                    layout="intrinsic"
                    className="w-12 h-12 mr-4"
                  />
                )}

                <div>
                  <p className="font-bold">
                    {highlightText(book.volumeInfo.title || "", searchQuery)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {book.volumeInfo.authors?.join(", ") || "Unknown Author"}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <input
            type="text"
            placeholder="Book Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300"
          />
          <input
            type="text"
            placeholder="Author Name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300"
          />
          <input
            type="text"
            placeholder="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300"
          />

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-gray-300 text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[rgba(224,178,26,0.9)] text-white hover:bg-[rgba(224,178,26,1)] transition shadow-md"
            >
              {bookToEdit ? "Save Changes" : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
