"use client";

import { useState, useEffect } from "react";
import BookSearch from "./BookSearch";

export default function BooksPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<any[]>([]);
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
          const data = await response.json();
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

  useEffect(() => {
    filterBooksByMonth(currentMonth, currentYear);
  }, [books, currentMonth, currentYear]);

  const filterBooksByMonth = (month: number, year: number) => {
    const filtered = books.filter((book) => {
      const bookDate = new Date(book.date);
      return (
        bookDate.getMonth() === month && bookDate.getFullYear() === year
      );
    });
    setFilteredBooks(filtered);
  };

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const booksThisYear = books.filter(
    (book) => new Date(book.date).getFullYear() === currentYear
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex flex-col items-center py-10">
      <h1 className="text-4xl font-bold text-blue-800 mb-6">Books</h1>
      <div className="w-full max-w-6xl mb-4 px-6">
        <div className="flex justify-between items-center">
          <button
            onClick={handlePreviousMonth}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
          >
            &larr; Previous Month
          </button>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-800">
              Books read this month ({currentYear}-{currentMonth + 1}):{" "}
              <span className="text-blue-600">{filteredBooks.length}</span>
            </p>
            <p className="text-lg font-semibold text-gray-800">
              Total books read this year:{" "}
              <span className="text-blue-600">{booksThisYear.length}</span>
            </p>
          </div>
          <button
            onClick={handleNextMonth}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
          >
            Next Month &rarr;
          </button>
        </div>
      </div>
      <div className="flex justify-between w-full max-w-6xl mb-4 px-6">
        <button
          onClick={handleOpenModal}
          className="px-6 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition"
        >
          Add Book
        </button>
      </div>
      <BookSearch books={filteredBooks} />
      {isModalOpen && (
        <BookModal
          onClose={handleCloseModal}
          onBookAdded={(newBook) => setBooks([newBook, ...books])}
        />
      )}
    </div>
  );
}

function BookModal({
  onClose,
  onBookAdded,
}: {
  onClose: () => void;
  onBookAdded: (book: any) => void;
}) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author, date }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Unknown error");
      }

      const newBook = await response.json();
      onBookAdded(newBook);
      onClose();
    } catch (error) {
      console.error("Error:", error);
      alert("Error creating book");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4">Add a New Book</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          />
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Add Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
