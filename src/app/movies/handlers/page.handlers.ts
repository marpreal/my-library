import { useCallback, useEffect, useState } from "react";
import { Movie } from "../types";

export const useMovieHandlers = (userId: string | undefined) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [movieToEdit, setMovieToEdit] = useState<Movie | null>(null);
  const [searchTitle, setSearchTitle] = useState("");
  const [selectedDates, setSelectedDates] = useState<
    [Date | null, Date | null]
  >([null, null]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isViewingYear, setIsViewingYear] = useState(false);

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    setSelectedDates(dates);
  };

  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
    if (currentMonth === 0) setCurrentYear((prev) => prev - 1);
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
    if (currentMonth === 11) setCurrentYear((prev) => prev + 1);
  };

  const handleToggleView = () => {
    setIsViewingYear((prev) => !prev);
  };

  const handleOpenModal = () => {
    setMovieToEdit(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const fetchMovies = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/movies?userId=${userId}`);
      if (response.ok) {
        const data: Movie[] = await response.json();
        setMovies(data);
      } else {
        console.error("Error fetching movies");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchMovies();
    }
  }, [userId, fetchMovies]);
  
  const handleEditMovie = async (id: number) => {
    try {
      const response = await fetch(`/api/movies/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch movie details");
      }
      const movie = await response.json();
      setMovieToEdit(movie);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  const handleDeleteMovie = async (id: number) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/movies/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (response.ok) {
        setMovies((prevMovies) =>
          prevMovies.filter((movie) => movie.id !== id)
        );
      } else {
        console.error("Error deleting movie");
      }
    } catch (error) {
      console.error("Error deleting movie:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMovieProcessed = async () => {
    setIsProcessing(true);
    try {
      await fetchMovies();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error processing movie:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredMovies = movies.filter((movie) => {
    const movieViewedDate = movie.viewedDate
      ? new Date(movie.viewedDate)
      : null;

    if (!movieViewedDate) return false;

    const selectedStartDate = selectedDates[0]
      ? new Date(selectedDates[0])
      : null;
    const selectedEndDate = selectedDates[1]
      ? new Date(selectedDates[1])
      : null;

    if (isViewingYear) {
      return movieViewedDate.getFullYear() === currentYear;
    }

    if (selectedStartDate && selectedEndDate) {
      return (
        movieViewedDate >= selectedStartDate &&
        movieViewedDate <= selectedEndDate
      );
    }

    return (
      movieViewedDate.getMonth() === currentMonth &&
      movieViewedDate.getFullYear() === currentYear
    );
  });

  return {
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
    fetchMovies,
    handleEditMovie,
    handleDeleteMovie,
    handleMovieProcessed,
    setSearchTitle,
  };
};
