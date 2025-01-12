"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookCard,
  BookModal,
  DateNavigator,
  TbrModal,
  SkeletonLoader,
} from "./components";
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
  const [isTbrModalOpen, setIsTbrModalOpen] = useState(false);

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

  const handleToggleView = () => {
    setIsViewingYear((prev) => !prev);
  };

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
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
      const response = await fetch(`/api/books/${id}`, { method: "DELETE" });
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

  const handleOpenTbrModal = () => setIsTbrModalOpen(true);
  const handleCloseTbrModal = () => setIsTbrModalOpen(false);

  const monthBooksCount = books.filter(
    (book) =>
      new Date(book.date).getMonth() === currentMonth &&
      new Date(book.date).getFullYear() === currentYear
  ).length;

  const yearBooksCount = books.filter(
    (book) => new Date(book.date).getFullYear() === currentYear
  ).length;

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
      <div className="relative z-10 mt-4 sm:mt-8 flex flex-col items-center sm:flex-row sm:justify-center sm:w-full lg:flex-col lg:items-center lg:w-full lg:px-10 lg:space-y-4 lg:mb-6">
        <div className="flex flex-row sm:space-x-4 lg:items-center">
          <h2 className="text-xs sm:text-lg font-bold text-[rgba(139,69,19,0.9)] mr-2">
            Month&apos;s Books:
          </h2>
          <p className="text-xs sm:text-xl font-semibold text-[rgba(139,69,19,0.9)]">
            {isLoading ? "-" : monthBooksCount}
          </p>
        </div>
        <div className="flex flex-row sm:space-x-4 lg:items-center mt-4 sm:mt-0">
          <h2 className="text-xs sm:text-lg font-bold text-[rgba(139,69,19,0.9)] mr-2">
            Year&apos;s Books:
          </h2>
          <p className="text-xs sm:text-xl font-semibold text-[rgba(139,69,19,0.9)]">
            {isLoading ? "-" : yearBooksCount}
          </p>
        </div>
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

      <DateNavigator
        currentMonth={currentMonth}
        currentYear={currentYear}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
        isViewingYear={isViewingYear}
        onToggleView={handleToggleView}
      />

      <div className="flex flex-wrap justify-center items-center gap-4 mb-6 z-20 max-w-6xl px-6 mt-6 sm:mt-8">
        <div className="w-full flex flex-col sm:flex-row gap-2">
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
        </div>
      </div>

      {isLoading ? (
        <SkeletonLoader />
      ) : filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 px-4 sm:px-6 w-full max-w-6xl z-10 mb-6">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onEdit={handleEditBook}
              onDelete={handleDeleteBook}
              onView={(id) => router.push(`/books/${id}`)}
            />
          ))}
        </div>
      ) : (
        <p className="text-lg text-gray-500 text-center">No books found.</p>
      )}

      {isModalOpen && (
        <BookModal
          onClose={handleCloseModal}
          onBookAdded={handleBookProcessed}
          bookToEdit={bookToEdit}
        />
      )}

      <div className="fixed bottom-6 right-6 flex flex-row-reverse gap-4 z-10">
        <button
          onClick={handleOpenModal}
          className="bg-gold text-highlight p-4 rounded-full shadow-lg border border-highlight hover:bg-highlight hover:text-golden transition transform hover:scale-110"
          style={{
            backgroundColor: "var(--gold)",
            color: "white",
          }}
        >
          + Add Book
        </button>
        <button
          onClick={handleOpenTbrModal}
          className="bg-gold text-highlight p-4 rounded-full shadow-lg border border-highlight hover:bg-highlight hover:text-golden transition transform hover:scale-110"
          style={{
            backgroundColor: "var(--gold)",
            color: "white",
          }}
        >
          📚 TBR Notes
        </button>
      </div>

      <TbrModal isOpen={isTbrModalOpen} onClose={handleCloseTbrModal} />
    </div>
  );
}
