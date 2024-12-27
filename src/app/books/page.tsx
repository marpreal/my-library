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
    <div className="min-h-screen flex flex-col items-center py-10 relative overflow-hidden">
      <div
        className="absolute inset-0 bg-center bg-cover z-0"
        style={{
          backgroundImage: "url('/library_background.jpg')",
          filter: "blur(8px)",
          transform: "scale(1.02)",
        }}
      ></div>
      <Link
        href="/"
        className="absolute top-4 left-4 px-4 py-2 bg-gold text-highlight rounded-lg shadow-md border border-highlight hover:bg-highlight hover:text-golden transition transform hover:scale-105 z-10"
        style={{
          backgroundColor: "var(--gold)",
          color: "white",
        }}
      >
        Back to Menu
      </Link>
      <div className="relative text-center z-10 mt-16 sm:mt-0">
        <h1
          className="text-4xl sm:text-7xl font-bold text-gold relative"
          style={{
            textShadow: "2px 2px 5px rgba(0, 0, 0, 0.7)",
          }}
        >
          Books
        </h1>
      </div>
      <div className="relative z-10 mt-6 sm:mt-8 flex flex-col items-center sm:flex-row sm:justify-between sm:w-full lg:flex-col lg:items-end lg:w-full lg:px-10 lg:space-y-6 lg:mb-6">
        <div className="flex flex-row items-center justify-center space-x-2 sm:space-x-4 lg:items-end">
          <h2
            className="text-sm sm:text-lg font-bold text-gold"
            style={{
              textShadow: "2px 2px 5px rgba(0, 0, 0, 0.7)",
            }}
          >
            Books This Month
          </h2>
          <p
            className="text-sm sm:text-xl font-semibold text-gold"
            style={{
              textShadow: "2px 2px 5px rgba(0, 0, 0, 0.7)",
            }}
          >
            {isLoading ? "-" : booksThisMonth.length}
          </p>
        </div>
        <div className="flex flex-row items-center justify-center space-x-2 sm:space-x-4 lg:items-end">
          <h2
            className="text-sm sm:text-lg font-bold text-gold"
            style={{
              textShadow: "2px 2px 5px rgba(0, 0, 0, 0.7)",
            }}
          >
            Books This Year
          </h2>
          <p
            className="text-sm sm:text-xl font-semibold text-gold"
            style={{
              textShadow: "2px 2px 5px rgba(0, 0, 0, 0.7)",
            }}
          >
            {isLoading ? "-" : booksThisYear.length}
          </p>
        </div>
      </div>
      <div className="flex flex-row justify-between items-center w-full max-w-6xl px-6 z-10 mt-8 sm:mt-4 lg:justify-between lg:space-x-4 lg:mb-6">
        <button
          onClick={handlePreviousMonth}
          className="px-4 py-2 bg-[rgba(139,69,19,0.7)] text-white rounded-lg shadow-md border border-highlight hover:bg-highlight hover:text-golden transition"
        >
          <span className="hidden sm:block">Previous Month</span>
          <span className="block sm:hidden">←</span>
        </button>
        <span
          className="text-lg font-semibold rounded-lg px-4 py-2"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            color: "var(--gold)",
          }}
        >
          {new Date(currentYear, currentMonth).toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </span>
        <button
          onClick={handleNextMonth}
          className="px-4 py-2 bg-[rgba(139,69,19,0.7)] text-white rounded-lg shadow-md border border-highlight hover:bg-highlight hover:text-golden transition"
        >
          <span className="hidden sm:block">Next Month</span>
          <span className="block sm:hidden">→</span>
        </button>
      </div>
      <input
        type="text"
        placeholder="Search by title"
        value={searchTitle}
        onChange={(e) => setSearchTitle(e.target.value)}
        className="w-full max-w-6xl px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-golden focus:border-golden text-gray-800 bg-white/90 mb-6 mt-6 backdrop-blur-md z-10"
        disabled={isLoading}
      />
      {isLoading ? (
        renderSkeleton()
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 px-4 sm:px-6 w-full max-w-6xl z-10 mb-6">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white/90 p-6 rounded-lg shadow-lg border border-gray-300 hover:shadow-xl transition cursor-pointer backdrop-blur-md"
              onClick={() => router.push(`/books/${book.id}`)}
            >
              <h2 className="text-2xl font-bold text-highlight mb-2">
                {book.title}
              </h2>
              <p className="text-gray-700 mb-4">Author: {book.author}</p>
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
        className="fixed bottom-6 right-6 bg-gold text-highlight p-4 rounded-full shadow-lg border border-highlight hover:bg-highlight hover:text-golden transition transform hover:scale-110 z-10"
        style={{
          backgroundColor: "var(--gold)",
          color: "white",
        }}
      >
        + Add Book
      </button>
    </div>
  );
}
