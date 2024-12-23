"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Book } from "../types";

export default function BookDetailPage() {
  const params = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const bookId = params?.id;
        if (!bookId) {
          console.error("No book ID found");
          return;
        }
        const response = await fetch(`/api/books/${bookId}`);
        if (response.ok) {
          const data = await response.json();
          setBook(data);
        } else {
          console.error("Failed to fetch book details");
        }
      } catch (error) {
        console.error("Error fetching book:", error);
      }
    };

    fetchBook();
  }, [params?.id]);

  const handleSubmitReview = async () => {
    try {
      const bookId = params?.id;
      if (!bookId) {
        console.error("No book ID found for submitting review");
        return;
      }
      const response = await fetch(`/api/books/${bookId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review, rating }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      alert("Review submitted!");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Error submitting review");
    }
  };

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-100 to-pink-200 flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-300 rounded w-40"></div>
          <div className="h-4 bg-gray-300 rounded w-80"></div>
          <div className="h-4 bg-gray-300 rounded w-60"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-100 to-pink-200 flex flex-col items-center py-10">
      <button
        onClick={() => router.push("/books")}
        className="absolute top-4 left-4 px-4 py-2 bg-orange-600 text-white rounded-lg shadow-md hover:bg-orange-700 transition"
      >
        Back to Books
      </button>
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-orange-700 mb-4">{book.title}</h1>
        <h2 className="text-xl text-gray-700 mb-2">Author: {book.author}</h2>
        <p className="text-gray-600 mb-6">
          Published: {new Date(book.date).toLocaleDateString()}
        </p>
        <textarea
          placeholder="Write your review here..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="w-full p-4 border rounded-lg mb-4"
        ></textarea>
        <div className="flex items-center gap-2 mb-6">
          <label className="text-gray-700 font-medium">Rating:</label>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="border rounded-lg px-4 py-2"
          >
            <option value={0}>Select</option>
            {[1, 2, 3, 4, 5].map((star) => (
              <option key={star} value={star}>
                {star} Star{star > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleSubmitReview}
          className="w-full bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition"
        >
          Submit Review
        </button>
      </div>
    </div>
  );
}
