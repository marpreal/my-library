"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FaTrashAlt } from "react-icons/fa";

type TbrBook = {
  id: number;
  title: string;
  userId: string;
};

export default function TbrModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [tbrBooks, setTbrBooks] = useState<TbrBook[]>([]);
  const [newTbrBook, setNewTbrBook] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    if (!userId) {
      console.error("❌ User ID is missing in session");
      return;
    }
  
  
    const fetchTbrBooks = async () => {
      try {
        const response = await fetch(`/api/books/tbr?userId=${userId}`);
  
        if (!response.ok) {
          console.error("❌ API responded with status", response.status);
          return;
        }
  
        const data = await response.json();
        setTbrBooks(data);
      } catch (error) {
        console.error("❌ Error fetching TBR books:", error);
      }
    };
  
    fetchTbrBooks();
  }, [userId]);
  

  const addTbrBook = async () => {
    if (!newTbrBook.trim()) {
      alert("Please provide a book title!");
      return;
    }

    if (!userId) {
      alert("You must be logged in to add a TBR book.");
      return;
    }

    try {
      const response = await fetch("/api/books/tbr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTbrBook.trim(), userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to add book:", errorData);
        alert(errorData.error || "Failed to add book");
        return;
      }

      const addedBook: TbrBook = await response.json();
      setTbrBooks((prev) => [...prev, addedBook]);
      setNewTbrBook("");
    } catch (error) {
      console.error("Error adding TBR book:", error);
    }
  };

  const removeTbrBook = async (id: number) => {
    if (!userId) {
      alert("You must be logged in to remove a TBR book.");
      return;
    }

    try {
      const response = await fetch("/api/books/tbr", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, userId }),
      });

      if (!response.ok) throw new Error("Failed to remove book");
      setTbrBooks((prev) => prev.filter((book) => book.id !== id));
    } catch (error) {
      console.error("Error removing TBR book:", error);
    }
  };

  const totalPages = Math.ceil(tbrBooks.length / itemsPerPage);
  const currentBooks = tbrBooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="modal-background w-full max-w-md mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        >
          ✖
        </button>
        <h2 className="mt-6 mb-4 text-2xl font-bold font-serif text-[#5a3d2b] px-2 py-1 shadow-md text-center">
          TBR Notes
        </h2>

        <ul className="list-decimal list-outside overflow-y-auto max-h-48 mb-3">
          {currentBooks.length > 0 ? (
            currentBooks.map((book, index) => (
              <li
                key={book.id}
                className="flex justify-between items-center text-sm mb-4 pl-2"
              >
                <span className="handwritten-font">
                  {`${(currentPage - 1) * itemsPerPage + index + 1}. ${
                    book.title
                  }`}
                </span>
                <button
                  className="text-red-500 text-xs ml-2 hover:text-red-700"
                  onClick={() => removeTbrBook(book.id)}
                >
                  <FaTrashAlt />
                </button>
              </li>
            ))
          ) : (
            <p className="text-sm text-black">Your TBR list is empty!</p>
          )}
        </ul>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mb-4">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === index + 1
                    ? "bg-[#DAA520] text-white"
                    : "bg-gray-200 text-black"
                } shadow-md hover:bg-[#B8860B] transition`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newTbrBook}
            onChange={(e) => setNewTbrBook(e.target.value)}
            placeholder="Add a book..."
            className="flex-1 px-3 py-2 border border-gray-400 bg-[#f7e7c3] rounded-md shadow-sm focus:outline-none focus:ring-golden focus:border-golden text-[#5a3d2b] placeholder-[#83511e] font-sans"
          />
          <button
            onClick={addTbrBook}
            className="px-4 py-2 bg-[#DAA520] text-white rounded-lg shadow-md hover:bg-[#B8860B] transition font-sans"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
