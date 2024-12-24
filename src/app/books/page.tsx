"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BookModal from "./BooksModal";
import { Book } from "./types";

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [bookToEdit, setBookToEdit] = useState<Book | null>(null);
  const [searchTitle, setSearchTitle] = useState("");
  const router = useRouter();

  const handleOpenModal = () => {
    setBookToEdit(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handlePreviousMonth = () => {
    const newDate = new Date(currentYear, currentMonth - 1);
    setCurrentMonth(newDate.getMonth());
    setCurrentYear(newDate.getFullYear());
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentYear, currentMonth + 1);
    setCurrentMonth(newDate.getMonth());
    setCurrentYear(newDate.getFullYear());
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("/api/books");
        if (response.ok) {
          const data: Book[] = await response.json();
          setBooks(data);
        } else {
          console.error("Error fetching books");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const booksThisMonth = books.filter((book) => {
    const bookDate = new Date(book.date);
    return (
      bookDate.getMonth() === currentMonth &&
      bookDate.getFullYear() === currentYear
    );
  });

  const booksThisYear = books.filter(
    (book) => new Date(book.date).getFullYear() === currentYear
  );

  const handleEditBook = async (id: number) => {
    try {
      const response = await fetch(`/api/books/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch book details");
      }
      const book = await response.json();
      setBookToEdit(book);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching book details:", error);
    }
  };
  
  const handleDeleteBook = async (id: number) => {
    try {
      const response = await fetch(`/api/books/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
      } else {
        console.error("Error deleting book");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

  const filteredBooks = booksThisMonth.filter((book) =>
    book.title.toLowerCase().includes(searchTitle.toLowerCase())
  );

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 w-full max-w-6xl">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="bg-gray-200 p-6 rounded-lg shadow-lg border border-gray-300 animate-pulse"
        >
          <div className="h-6 bg-gray-300 rounded mb-4"></div>
          <div className="h-4 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 bg-gray-300 rounded"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-100 to-pink-200 flex flex-col items-center py-10 relative">
      <h1 className="text-4xl font-bold text-orange-700 mb-6 drop-shadow-lg">
        Books
      </h1>
      <Link
        href="/"
        className="absolute top-4 left-4 px-4 py-2 bg-orange-600 text-white rounded-lg shadow-md hover:bg-orange-700 transition transform hover:scale-105"
      >
        Back to Menu
      </Link>

      <div className="flex gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300 text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Books This Month
          </h2>
          <p className="text-orange-600 text-3xl font-semibold">
            {isLoading ? "-" : booksThisMonth.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300 text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Books This Year
          </h2>
          <p className="text-orange-600 text-3xl font-semibold">
            {isLoading ? "-" : booksThisYear.length}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center w-full max-w-6xl mb-4 px-6">
        <button
          onClick={handlePreviousMonth}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg shadow-md hover:bg-orange-700 transition"
        >
          Previous Month
        </button>
        <span className="text-lg font-semibold text-gray-800">
          {new Date(currentYear, currentMonth).toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </span>
        <button
          onClick={handleNextMonth}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg shadow-md hover:bg-orange-700 transition"
        >
          Next Month
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by title"
        value={searchTitle}
        onChange={(e) => setSearchTitle(e.target.value)}
        className="w-full max-w-6xl px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 text-gray-800 bg-white mb-6"
        disabled={isLoading}
      />

      {isLoading ? (
        renderSkeleton()
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 w-full max-w-6xl">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition cursor-pointer"
              onClick={() => router.push(`/books/${book.id}`)}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {book.title}
              </h2>
              <p className="text-gray-600 mb-4">Author: {book.author}</p>
              <p className="text-gray-500 text-sm mb-4">
                Date: {new Date(book.date).toLocaleDateString()}
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditBook(book.id);
                  }}
                  className="text-blue-600 hover:text-blue-800 transition"
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteBook(book.id);
                  }}
                  className="text-red-600 hover:text-red-800 transition"
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <BookModal
          onClose={handleCloseModal}
          onBookAdded={(newBook) =>
            bookToEdit
              ? setBooks((prevBooks) =>
                  prevBooks.map((book) =>
                    book.id === newBook.id ? newBook : book
                  )
                )
              : setBooks([newBook, ...books])
          }
          bookToEdit={bookToEdit}
        />
      )}

      <button
        onClick={handleOpenModal}
        className="fixed bottom-8 right-8 bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:bg-green-700 transition transform hover:scale-110 animate-bounce"
      >
        + Add Book
      </button>
    </div>
  );
}
