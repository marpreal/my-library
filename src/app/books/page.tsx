"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; 
import BookSearch from "./BookSearch";
import BookModal from "./BooksModal";
import { Book } from "./types";

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const router = useRouter();

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

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

  const filterBooksByMonth = () => {
    return books.filter((book) => {
      const bookDate = new Date(book.date);
      return (
        bookDate.getMonth() === currentMonth &&
        bookDate.getFullYear() === currentYear
      );
    });
  };

  const booksThisYear = books.filter(
    (book) => new Date(book.date).getFullYear() === currentYear
  );

  const booksThisMonth = filterBooksByMonth();

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

  const handleBookClick = (id: string) => {
    router.push(`/books/${id}`);
  };

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="bg-gray-200 animate-pulse p-6 rounded-lg shadow-lg"
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
      <div className="w-full max-w-6xl mb-4 px-6">
        <div className="flex justify-between items-center">
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-800">
              Books read this month:{" "}
              <span className="text-orange-600">{booksThisMonth.length}</span>
            </p>
            <p className="text-lg font-semibold text-gray-800">
              Total books read this year:{" "}
              <span className="text-orange-600">{booksThisYear.length}</span>
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
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
      </div>
      {isLoading ? (
        renderSkeleton()
      ) : (
        <BookSearch books={booksThisMonth} onBookClick={handleBookClick} />
      )}
      {isModalOpen && (
        <BookModal
          onClose={handleCloseModal}
          onBookAdded={(newBook) => setBooks([newBook, ...books])}
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
