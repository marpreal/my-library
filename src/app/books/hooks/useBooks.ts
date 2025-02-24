import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Book } from "../types";

export function useBooks() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTitle, setSearchTitle] = useState("");
  const [selectedDates, setSelectedDates] = useState<[Date | null, Date | null]>([null, null]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isViewingYear, setIsViewingYear] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchBooks = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/books?userId=${userId}`);
        if (!response.ok) throw new Error(`API responded with ${response.status}`);

        const data: Book[] = await response.json();
        setBooks(data);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, [userId]);

  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
    if (currentMonth === 0) setCurrentYear((prev) => prev - 1);
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
    if (currentMonth === 11) setCurrentYear((prev) => prev + 1);
  };

  const handleToggleView = () => setIsViewingYear((prev) => !prev);

  const filteredBooks = books.filter((book) => {
    const bookDate = new Date(book.date);
    const matchesTitle = book.title.toLowerCase().includes(searchTitle.toLowerCase());

    const matchesDateRange =
      selectedDates[0] && selectedDates[1]
        ? bookDate >= selectedDates[0] && bookDate <= selectedDates[1]
        : isViewingYear
        ? bookDate.getFullYear() === currentYear
        : bookDate.getMonth() === currentMonth && bookDate.getFullYear() === currentYear;

    return matchesTitle && matchesDateRange;
  });

  const monthBooksCount = books.filter(
    (book) => new Date(book.date).getMonth() === currentMonth && new Date(book.date).getFullYear() === currentYear
  ).length;

  const yearBooksCount = books.filter((book) => new Date(book.date).getFullYear() === currentYear).length;

  return {
    books,
    filteredBooks,
    isLoading,
    searchTitle,
    setSearchTitle,
    selectedDates,
    setSelectedDates,
    currentMonth,
    setCurrentMonth,
    currentYear,
    setCurrentYear,
    isViewingYear,
    setIsViewingYear,
    setBooks,
    monthBooksCount,
    yearBooksCount,
    handlePreviousMonth,
    handleNextMonth,
    handleToggleView,
  };
}
