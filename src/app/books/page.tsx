"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  BookCard,
  BookModal,
  DateNavigator,
  TbrModal,
  SkeletonLoader,
} from "./components";
import { useBooks } from "./hooks/useBooks";
import { useBookHandlers } from "./handlers/bookHandlers";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Navbar from "../components/Navbar";
import { useUserAndTheme } from "../hooks/useUserAndTheme";

export default function BooksPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const router = useRouter();
  const { userName, theme, toggleTheme, handleSignIn, handleSignOut } =
    useUserAndTheme();
  const {
    filteredBooks,
    isLoading,
    searchTitle,
    setSearchTitle,
    selectedDates,
    setSelectedDates,
    currentMonth,
    currentYear,
    isViewingYear,
    setBooks,
    monthBooksCount,
    yearBooksCount,
    handlePreviousMonth,
    handleNextMonth,
    handleToggleView,
  } = useBooks();

  const {
    isProcessing,
    isDeleting,
    bookToEdit,
    isModalOpen,
    handleOpenModal,
    handleCloseModal,
    handleEditBook,
    handleDeleteBook,
    handleBookProcessed,
    isTbrModalOpen,
    handleOpenTbrModal,
    handleCloseTbrModal,
  } = useBookHandlers(userId, setBooks);

  return (
    <>
      <Navbar
        userName={userName}
        handleSignIn={handleSignIn}
        handleSignOut={handleSignOut}
        theme={theme ?? "light"}
        toggleTheme={toggleTheme}
      />
      <div className="min-h-screen flex flex-col items-center py-10 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-center bg-cover z-0"
          style={{
            backgroundImage: "url('/library_background.jpg')",
            filter: "blur(8px)",
            transform: "scale(1.02)",
          }}
        ></div>

        <div className="relative text-center z-10 mt-8 sm:mt-10">
          <h1
            className="text-4xl sm:text-7xl font-bold text-gold relative"
            style={{ textShadow: "2px 2px 5px rgba(0, 0, 0, 0.7)" }}
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
              onChange={(dates) =>
                setSelectedDates(dates as [Date | null, Date | null])
              }
              startDate={selectedDates[0] || undefined}
              endDate={selectedDates[1] || undefined}
              selectsRange
              isClearable
              placeholderText="Select a date range"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-golden"
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
            style={{ backgroundColor: "var(--gold)", color: "white" }}
          >
            + Add Book
          </button>
          <button
            onClick={handleOpenTbrModal}
            className="bg-gold text-highlight p-4 rounded-full shadow-lg border border-highlight hover:bg-highlight hover:text-golden transition transform hover:scale-110"
            style={{ backgroundColor: "var(--gold)", color: "white" }}
          >
            📚 TBR Notes
          </button>
        </div>

        <TbrModal isOpen={isTbrModalOpen} onClose={handleCloseTbrModal} />
      </div>
    </>
  );
}
