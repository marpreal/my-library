"use client";

import { useState } from "react";
import { Book } from "./types";

export default function BookModal({
  onClose,
  onBookAdded,
}: {
  onClose: () => void;
  onBookAdded: (book: Book) => void;
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
    <div className="fixed inset-0 bg-orange-100 bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg w-full border border-orange-300">
        <h2 className="text-3xl font-bold text-orange-700 mb-6 text-center">
          Add a New Book
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input
            type="text"
            placeholder="Book Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-4 py-3 rounded-lg border border-orange-300 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 bg-orange-50 text-orange-900"
          />
          <input
            type="text"
            placeholder="Author Name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="px-4 py-3 rounded-lg border border-orange-300 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 bg-orange-50 text-orange-900"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-4 py-3 rounded-lg border border-orange-300 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 bg-orange-50 text-orange-900"
          />
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-orange-200 text-orange-700 hover:bg-orange-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition"
            >
              Add Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
