import { useState } from "react";
import { Book } from "../types";

export function useBookHandlers(
  userId: string | undefined,
  setBooks: (update: (prevBooks: Book[]) => Book[]) => void
) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [bookToEdit, setBookToEdit] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTbrModalOpen, setIsTbrModalOpen] = useState(false);

  const handleOpenModal = () => {
    setBookToEdit(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleEditBook = async (id: number) => {
    try {
      const response = await fetch(`/api/books/${id}`);
      if (!response.ok) throw new Error("Failed to fetch book details");

      const book = await response.json();
      if (book.userId !== userId) {
        alert("You can only edit your own books.");
        return;
      }
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
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

  const handleOpenTbrModal = () => setIsTbrModalOpen(true);
  const handleCloseTbrModal = () => setIsTbrModalOpen(false);

  return {
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
  };
}
