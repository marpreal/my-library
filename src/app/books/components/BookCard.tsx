import Image from "next/image";
import { Book } from "../types";

const BookCard = ({
  book,
  onEdit,
  onDelete,
  onView,
}: {
  book: Book;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
}) => (
  <div
    key={book.id}
    className="bg-white/90 p-6 rounded-lg shadow-lg border border-gray-300 hover:shadow-xl transition cursor-pointer backdrop-blur-md flex flex-col justify-between"
    onClick={() => onView(book.id)}
  >
    {book.imageUrl && (
      <div className="relative mb-4">
        <Image
          src={book.imageUrl}
          alt={`${book.title} cover`}
          width={160}
          height={200}
          className="w-full max-h-40 object-contain rounded-lg"
        />
      </div>
    )}
    <h2 className="text-2xl font-bold text-highlight mb-2">{book.title}</h2>
    <p className="text-gray-700 mb-4">Author: {book.author}</p>
    <p className="text-gray-500 text-sm mb-4">
      Date: {new Date(book.date).toLocaleDateString()}
    </p>
    <div className="flex justify-end gap-4 mt-auto">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit(book.id);
        }}
        className="text-blue-600 hover:text-blue-800 transition"
        title="Edit"
      >
        ✏️
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(book.id);
        }}
        className="text-red-600 hover:text-red-800 transition"
        title="Delete"
      >
        🗑️
      </button>
    </div>
  </div>
);

export default BookCard;
