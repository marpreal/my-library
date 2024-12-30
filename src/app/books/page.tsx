"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BookModal from "./BooksModal";
import { Book } from "./types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [bookToEdit, setBookToEdit] = useState<Book | null>(null);
  const [searchTitle, setSearchTitle] = useState("");
  const [selectedDates, setSelectedDates] = useState<
    [Date | null, Date | null]
  >([null, null]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isViewingYear, setIsViewingYear] = useState(false);
  const router = useRouter();

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    setSelectedDates(dates);
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

  const filteredBooks = books.filter((book) => {
    const bookDate = new Date(book.date);
    const matchesTitle = book.title
      .toLowerCase()
      .includes(searchTitle.toLowerCase());

    const matchesDateRange =
      selectedDates[0] && selectedDates[1]
        ? bookDate >= selectedDates[0] && bookDate <= selectedDates[1]
        : isViewingYear
        ? bookDate.getFullYear() === currentYear
        : bookDate.getMonth() === currentMonth &&
          bookDate.getFullYear() === currentYear;

    return matchesTitle && matchesDateRange;
  });

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleToggleView = () => {
    setIsViewingYear((prev) => !prev);
  };

  const handleOpenModal = () => {
    setBookToEdit(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

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
    setIsDeleting(true);
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
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBookProcessed = async (newBook: Book) => {
    setIsProcessing(true);
    try {
      setBooks((prevBooks) =>
        bookToEdit
          ? prevBooks.map((book) => (book.id === newBook.id ? newBook : book))
          : [newBook, ...prevBooks]
      );
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error processing book:", error);
    } finally {
      setIsProcessing(false);
    }
  };

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
      <div className="relative text-center z-10 mt-8 sm:mt-10">
        <h1
          className="text-4xl sm:text-7xl font-bold text-gold relative"
          style={{
            textShadow: "2px 2px 5px rgba(0, 0, 0, 0.7)",
          }}
        >
          Books
        </h1>
      </div>
      {(isProcessing || isDeleting) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded shadow-lg text-center">
            <p className="text-lg font-bold text-gold">
              {isProcessing ? "Processing..." : "Deleting..."}
            </p>
          </div>
        </div>
      )}
      <div className="relative z-10 mt-4 sm:mt-8 flex flex-col items-center sm:flex-row sm:justify-center sm:w-full lg:flex-col lg:items-center lg:w-full lg:px-10 lg:space-y-4 lg:mb-6">
        <div className="flex flex-row sm:space-x-4 lg:items-center">
          <h2
            className="text-xs sm:text-lg font-bold text-[rgba(139,69,19,0.9)] mr-2"
            style={{
              textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)",
            }}
          >
            Month&apos;s Books
          </h2>
          <p
            className="text-xs sm:text-xl font-semibold text-[rgba(139,69,19,0.9)]"
            style={{
              textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)",
            }}
          >
            {isLoading
              ? "-"
              : books.filter(
                  (book) =>
                    new Date(book.date).getMonth() === currentMonth &&
                    new Date(book.date).getFullYear() === currentYear
                ).length}
          </p>
        </div>
        <div className="flex flex-row sm:space-x-4 lg:items-center mt-4 sm:mt-0">
          <h2
            className="text-xs sm:text-lg font-bold text-[rgba(139,69,19,0.9)] mr-2"
            style={{
              textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)",
            }}
          >
            Year&apos;s Books
          </h2>
          <p
            className="text-xs sm:text-xl font-semibold text-[rgba(139,69,19,0.9)]"
            style={{
              textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)",
            }}
          >
            {isLoading
              ? "-"
              : books.filter(
                  (book) => new Date(book.date).getFullYear() === currentYear
                ).length}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap justify-center items-center gap-4 mb-6 z-20 max-w-6xl px-6 mt-6 sm:mt-8">
        <h1
          className="text-1xl sm:text-2xl font-semibold text-center"
          style={{
            color: "#8B4513",
          }}
        >
          {new Intl.DateTimeFormat("default", {
            month: "long",
            year: "numeric",
          }).format(new Date(currentYear, currentMonth))}
        </h1>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-4 mb-6 z-20 max-w-6xl px-6 mt-6 sm:mt-8">
        <div className="w-full flex flex-col sm:flex-row gap-2">
          {!isViewingYear && ( 
            <>
              <button
                onClick={handlePreviousMonth}
                className="px-4 py-2 bg-gray-200 rounded-lg shadow hover:bg-gray-300 transition"
              >
                ← Previous Month
              </button>
            </>
          )}

          <input
            type="text"
            placeholder="Search by title"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            className="flex-1 px-2 py-1 text-xs sm:text-base rounded-lg border border-gray-300 shadow-sm focus:ring-golden focus:border-golden"
            disabled={isLoading}
          />
          <DatePicker
            selected={selectedDates[0] || undefined}
            onChange={handleDateChange}
            startDate={selectedDates[0] || undefined}
            endDate={selectedDates[1] || undefined}
            selectsRange
            isClearable
            placeholderText="Select a date range"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-golden focus:border-golden"
            calendarClassName="z-50"
          />

          {!isViewingYear && ( 
            <>
              <button
                onClick={handleNextMonth}
                className="px-4 py-2 bg-gray-200 rounded-lg shadow hover:bg-gray-300 transition"
              >
                Next Month →
              </button>
            </>
          )}

          <button
            onClick={handleToggleView}
            className="px-4 py-2 bg-gold text-white rounded-lg shadow-md hover:bg-highlight hover:text-golden transition"
          >
            {isViewingYear ? "Back to Current Month" : "View Year"}
          </button>
        </div>
      </div>

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
                Date: {formatDate(new Date(book.date))}
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
          onBookAdded={handleBookProcessed}
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
