"use client";

import { useState, useEffect } from "react";
import { Book } from "./types";
import DatePicker from "react-datepicker";

export default function BookSearch({
  books,
  onBookClick,
}: {
  books: Book[];
  onBookClick: (id: string) => void;
}) {
  const [filteredBooks, setFilteredBooks] = useState(books);
  const [searchTitle, setSearchTitle] = useState("");
  const [selectedDates, setSelectedDates] = useState<[Date | null, Date | null] | null>(
    null
  );

  useEffect(() => {
    setFilteredBooks(books);
  }, [books]);

  const handleSearch = (title: string, dates: [Date | null, Date | null] | null) => {
    const filtered = books.filter((book) => {
      const matchesTitle = book.title
        .toLowerCase()
        .includes(title.toLowerCase());
      const bookDate = new Date(book.date);

      const matchesDate =
        dates === null
          ? true
          : dates[0] && dates[1]
          ? bookDate >= dates[0] && bookDate <= dates[1]
          : true;

      return matchesTitle && matchesDate;
    });

    setFilteredBooks(filtered);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setSearchTitle(title);
    handleSearch(title, selectedDates);
  };

  const handleDateChange = (dates: [Date | null, Date | null] | null) => {
    setSelectedDates(dates);
    handleSearch(searchTitle, dates);
  };

  return (
    <div className="max-w-6xl w-full px-6">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by title"
          value={searchTitle}
          onChange={handleTitleChange}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 text-gray-800 bg-white"
        />
        <DatePicker
          selected={selectedDates ? selectedDates[0] || undefined : undefined}
          onChange={(date) => handleDateChange(date as [Date | null, Date | null] | null)}
          startDate={selectedDates ? selectedDates[0] || undefined : undefined}
          endDate={selectedDates ? selectedDates[1] || undefined : undefined}
          selectsRange
          isClearable
          placeholderText="Select date or range"
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 text-gray-800 bg-white"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <div
          key={book.id}
          className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl cursor-pointer"
          onClick={() => onBookClick(book.id.toString())} 
        >
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">
            {book.title}
          </h2>
          <p className="text-gray-700 mb-1">Author: {book.author}</p>
          <p className="text-gray-500 text-sm">
            Date: {new Date(book.date).toLocaleDateString()}
          </p>
        </div>
        
        ))}
      </div>
    </div>
  );
}
