"use client";

import { useState, useEffect } from "react";

export default function BookSearch({ books }: { books: any[] }) {
  const [filteredBooks, setFilteredBooks] = useState(books);
  const [searchTitle, setSearchTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    // Actualizar los libros filtrados al cambiar los libros originales
    setFilteredBooks(books);
  }, [books]);

  const handleSearch = (title: string, start: string, end: string) => {
    const filtered = books.filter((book) => {
      const matchesTitle = book.title
        .toLowerCase()
        .includes(title.toLowerCase());

      const bookDate = new Date(book.date);
      const matchesDate =
        (!start || bookDate >= new Date(start)) &&
        (!end || bookDate <= new Date(end));

      return matchesTitle && matchesDate;
    });

    setFilteredBooks(filtered);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setSearchTitle(title);
    handleSearch(title, startDate, endDate);
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const start = e.target.value;
    setStartDate(start);
    handleSearch(searchTitle, start, endDate);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const end = e.target.value;
    setEndDate(end);
    handleSearch(searchTitle, startDate, end);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/books/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete book");
      }

      setFilteredBooks(filteredBooks.filter((book) => book.id !== id));
      alert("Book deleted!");
    } catch (error) {
      alert("Error deleting book");
    }
  };

  const handleEdit = async (book: any) => {
    const newTitle = prompt("New Title:", book.title) || book.title;
    const newAuthor = prompt("New Author:", book.author) || book.author;
    const newDate = prompt("New Date (YYYY-MM-DD):", book.date) || book.date;

    try {
      const response = await fetch(`/api/books/${book.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, author: newAuthor, date: newDate }),
      });

      if (!response.ok) {
        throw new Error("Failed to edit book");
      }

      const updatedBook = await response.json();
      setFilteredBooks(
        filteredBooks.map((b) => (b.id === book.id ? updatedBook : b))
      );
      alert("Book updated!");
    } catch (error) {
      alert("Error updating book");
    }
  };

  return (
    <div className="max-w-6xl w-full px-6">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <input
  type="text"
  placeholder="Search by title"
  value={searchTitle}
  onChange={handleTitleChange}
  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white"
/>
<input
  type="date"
  value={startDate}
  onChange={handleStartDateChange}
  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white"
/>
<input
  type="date"
  value={endDate}
  onChange={handleEndDateChange}
  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white"
/>

      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
          >
            <h2 className="text-2xl font-semibold mb-2 text-gray-800">{book.title}</h2>
            <p className="text-gray-700 mb-1">Author: {book.author}</p>
            <p className="text-gray-500 text-sm">
              Date: {new Date(book.date).toLocaleDateString()}
            </p>
            <button
              onClick={() => handleEdit(book)}
              className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded-lg"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(book.id)}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
