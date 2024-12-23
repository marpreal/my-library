"use client";

import { useState, useEffect } from "react";
import BookSearch from "./BookSearch";
import BookModal from "./BooksModal";
import { Book } from "./types";

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex flex-col items-center py-10">
      <h1 className="text-4xl font-bold text-blue-800 mb-6">Books</h1>
      <div className="w-full max-w-6xl mb-4 px-6">
        <div className="flex justify-between items-center">
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-800">
              Books read this month:{" "}
              <span className="text-blue-600">{booksThisMonth.length}</span>
            </p>
            <p className="text-lg font-semibold text-gray-800">
              Total books read this year:{" "}
              <span className="text-blue-600">{booksThisYear.length}</span>
            </p>
          </div>
          <button
            onClick={handleOpenModal}
            className="px-6 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition"
          >
            Add Book
          </button>
        </div>
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handlePreviousMonth}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
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
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Next Month
          </button>
        </div>
      </div>
      <BookSearch books={booksThisMonth} />
      {isModalOpen && (
        <BookModal
          onClose={handleCloseModal}
          onBookAdded={(newBook) => setBooks([newBook, ...books])}
        />
      )}
    </div>
  );
}
