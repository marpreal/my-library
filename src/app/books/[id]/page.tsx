"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Book, Review } from "../types";
import Image from "next/image";

export default function BookDetailPage() {
  const params = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
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

        const reviewResponse = await fetch(`/api/books/${bookId}/reviews`);
        if (reviewResponse.ok) {
          const reviewData = await reviewResponse.json();
          setReviews(reviewData);
        } else {
          console.error("Failed to fetch reviews");
        }
      } catch (error) {
        console.error("Error fetching book or reviews:", error);
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
      const response = await fetch(`/api/books/${bookId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review, rating }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      alert("Review submitted!");
      setReview("");
      setRating(0);

      const updatedReviews = await fetch(`/api/books/${bookId}/reviews`);
      if (updatedReviews.ok) {
        setReviews(await updatedReviews.json());
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Error submitting review");
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        onClick={() => setRating(index + 1)}
        className={`cursor-pointer text-2xl ${
          index < rating ? "text-[rgba(224,178,26,1)]" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));
  };

  if (!book) {
    return (
      <div className="min-h-screen bg-[rgba(0,0,0,0.6)] flex items-center justify-center">
        <div className="animate-pulse space-y-4 bg-white/80 p-8 rounded-lg shadow-lg">
          <div className="w-[150px] h-[200px] bg-gray-300 rounded mx-auto"></div>
          <div className="h-6 bg-gray-300 rounded w-40 mx-auto mt-4"></div>
          <div className="h-4 bg-gray-300 rounded w-60 mx-auto mt-2"></div>
          <div className="h-4 bg-gray-300 rounded w-48 mx-auto mt-2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-10 relative overflow-hidden">
      <div
        className="absolute inset-0 bg-center bg-cover z-0"
        style={{
          backgroundImage: "url('/library_background.jpg')",
          filter: "blur(8px)",
          transform: "scale(1.02)",
        }}
      ></div>
      <button
        onClick={() => router.push("/books")}
        className="absolute top-4 left-4 px-4 py-2 bg-[rgba(224,178,26,0.7)] text-white rounded-lg shadow-md hover:bg-[rgba(224,178,26,0.9)] transition z-10"
      >
        Back to Books
      </button>
      <div
        className="bg-white/90 p-10 rounded-xl shadow-lg max-w-3xl w-full border border-[rgba(224,178,26,0.7)] z-10"
        style={{
          backdropFilter: "blur(10px)",
        }}
      >
        <h1
          className="text-4xl font-bold mb-6"
          style={{
            color: "var(--gold)",
          }}
        >
          {book.title}
        </h1>
        <h2 className="text-xl mb-2" style={{ color: "var(--gold)" }}>
          Author: {book.author}
        </h2>
        <p className="text-gray-700 mb-6">
          Published: {new Date(book.date).toLocaleDateString()}
        </p>
        {book.imageUrl && (
          <div className="flex justify-center items-center mb-6">
            <Image
              src={book.imageUrl}
              alt={`${book.title} cover`}
              width={150}
              height={200}
              className="rounded-lg shadow-lg object-cover"
              priority
            />
          </div>
        )}
        <textarea
          placeholder="Write your review here..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg bg-white shadow-md focus:ring-2 focus:ring-[rgba(224,178,26,0.7)] focus:outline-none mb-4"
        />
        <div className="flex items-center gap-2 mb-6">
          <label className="font-medium" style={{ color: "var(--gold)" }}>
            Rating:
          </label>
          {renderStars()}
        </div>
        <button
          onClick={handleSubmitReview}
          className="w-full bg-[rgba(224,178,26,0.7)] text-white px-6 py-3 rounded-lg hover:bg-[rgba(224,178,26,0.9)] transition"
        >
          Submit Review
        </button>
      </div>
      <div
        className="bg-white/90 p-8 rounded-xl shadow-lg max-w-3xl w-full mt-6 border border-[rgba(224,178,26,0.7)] z-10"
        style={{
          backdropFilter: "blur(10px)",
        }}
      >
        <h2
          className="text-3xl font-bold mb-4"
          style={{
            color: "var(--gold)",
          }}
        >
          Reviews
        </h2>
        {reviews.map((r, index) => (
          <div key={index} className="border-b pb-4 mb-4 last:border-none">
            <p className="text-gray-800">{r.review}</p>
            <p
              className="text-[rgba(224,178,26,1)]"
              style={{
                fontFamily: "serif",
              }}
            >
              {Array(r.rating).fill("★").join("")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
