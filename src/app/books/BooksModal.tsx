"use client";

import { useState, useEffect } from "react";
import { Book } from "./types";

export default function BookModal({
  onClose,
  onBookAdded,
  bookToEdit,
}: {
  onClose: () => void;
  onBookAdded: (book: Book) => void;
  bookToEdit?: Book | null;
}) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [date, setDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");

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

    const method = bookToEdit ? "PATCH" : "POST";
    const url = bookToEdit ? `/api/books/${bookToEdit.id}` : "/api/books";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author, date, imageUrl }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Unknown error");
      }

      const savedBook = await response.json();
      onBookAdded(savedBook);
      onClose();
    } catch (error) {
      console.error("Error:", error);
      alert("Error saving book");
    }
  };

  return (
    <div className="fixed inset-0 bg-green-50 bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg w-full border border-green-300">
        <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">
          {bookToEdit ? "Edit Book" : "Add a New Book"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input
            type="text"
            placeholder="Book Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-4 py-3 rounded-lg border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-600 bg-green-50 text-green-900 shadow-md"
          />
          <input
            type="text"
            placeholder="Author Name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="px-4 py-3 rounded-lg border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-600 bg-green-50 text-green-900 shadow-md"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-4 py-3 rounded-lg border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-600 bg-green-50 text-green-900 shadow-md"
          />
          <input
            type="text"
            placeholder="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="px-4 py-3 rounded-lg border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-600 bg-green-50 text-green-900 shadow-md"
          />
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-green-200 text-green-700 hover:bg-green-300 transition shadow-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition shadow-md"
            >
              {bookToEdit ? "Save Changes" : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
