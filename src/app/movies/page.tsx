"use client";

import { useEffect } from "react";
import MoviesModal from "./components/MoviesModal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useMovieHandlers } from "./handlers/page.handlers";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { useUserAndTheme } from "../hooks/useUserAndTheme";

export default function MoviesPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const router = useRouter();
  const { userName, theme, toggleTheme, handleSignIn, handleSignOut } =
    useUserAndTheme();
  const {
    movies,
    isLoading,
    isModalOpen,
    currentMonth,
    currentYear,
    movieToEdit,
    searchTitle,
    selectedDates,
    isProcessing,
    isDeleting,
    isViewingYear,
    filteredMovies,
    handleDateChange,
    handlePreviousMonth,
    handleNextMonth,
    handleToggleView,
    handleOpenModal,
    handleCloseModal,
    handleEditMovie,
    handleDeleteMovie,
    handleMovieProcessed,
    setSearchTitle,
    fetchMovies,
  } = useMovieHandlers(userId);

  useEffect(() => {
    if (userId) {
      fetchMovies();
    }
  }, [userId, fetchMovies]);

  if (!theme) return null;

  return (
    <div className="min-h-screen flex flex-col items-center py-10 relative overflow-hidden">
      <div
        className="absolute inset-0 bg-center bg-cover z-0"
        style={{
          backgroundImage: "url('/cinema-background.jpg')",
          filter: "blur(8px)",
          transform: "scale(1.02)",
        }}
      ></div>

      <Navbar
        userName={userName}
        handleSignIn={handleSignIn}
        handleSignOut={handleSignOut}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <div className="relative text-center z-10 mt-8 sm:mt-10">
        <h1
          className="text-4xl sm:text-7xl font-bold text-gold relative"
          style={{ textShadow: "2px 2px 5px rgba(0, 0, 0, 0.7)" }}
        >
          Movies
        </h1>
        <p className="text-lg sm:text-2xl mt-4 text-white">
          Watched this year:{" "}
          {
            movies.filter(
              (m) => new Date(m.viewedDate).getFullYear() === currentYear
            ).length
          }
        </p>
        <p className="text-lg sm:text-2xl mt-2 text-white">
          Watched this month:{" "}
          {
            movies.filter(
              (m) =>
                new Date(m.viewedDate).getMonth() === currentMonth &&
                new Date(m.viewedDate).getFullYear() === currentYear
            ).length
          }
        </p>
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

      <div className="flex flex-wrap justify-center items-center gap-4 mb-6 z-20 max-w-6xl px-6 mt-6 sm:mt-8">
        <div className="w-full flex flex-col sm:flex-row gap-2">
          {!isViewingYear && (
            <button
              onClick={handlePreviousMonth}
              className="px-4 py-2 bg-gray-200 rounded-lg shadow hover:bg-gray-300 transition"
            >
              ← Previous Month
            </button>
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
            <button
              onClick={handleNextMonth}
              className="px-4 py-2 bg-gray-200 rounded-lg shadow hover:bg-gray-300 transition"
            >
              Next Month →
            </button>
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
        <div className="text-white text-xl">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 px-4 sm:px-6 w-full max-w-6xl z-10 mb-6">
          {filteredMovies.map((movie) => (
            <div
              key={movie.id}
              className="bg-white/90 p-6 rounded-lg shadow-lg border border-gray-300 hover:shadow-xl transition cursor-pointer backdrop-blur-md flex flex-col justify-between"
              onClick={() => router.push(`/movies/${movie.id}`)}
            >
              {movie.imageUrl && (
                <div className="relative mb-4">
                  <Image
                    src={movie.imageUrl ?? "/placeholder.jpg"}
                    alt={`${movie.title} poster`}
                    width={300}
                    height={300}
                    className="w-full max-h-40 object-contain rounded-lg"
                  />
                </div>
              )}
              <h2 className="text-2xl font-bold text-highlight mb-2">
                {movie.title}
              </h2>
              <p className="text-gray-700 mb-4">Director: {movie.director}</p>
              <div className="flex justify-end gap-4 mt-auto">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditMovie(movie.id);
                  }}
                  className="text-blue-600 hover:text-blue-800 transition"
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteMovie(movie.id);
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
        <MoviesModal
          onClose={handleCloseModal}
          onMovieAdded={handleMovieProcessed}
          movieToEdit={movieToEdit}
        />
      )}

      <button
        onClick={handleOpenModal}
        className="fixed bottom-6 right-6 bg-gold text-highlight p-4 rounded-full shadow-lg border border-highlight hover:bg-highlight hover:text-golden transition transform hover:scale-110 z-10"
      >
        + Add Movie
      </button>
    </div>
  );
}
