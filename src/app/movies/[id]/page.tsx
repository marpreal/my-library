"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Movie, Review } from "../types";
import Image from "next/image";

export default function MovieDetailPage() {
  const params = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const movieId = params?.id;
        if (!movieId) {
          console.error("No movie ID found");
          return;
        }

        const response = await fetch(`/api/movies/${movieId}`);
        if (response.ok) {
          const data = await response.json();
          setMovie(data);
        } else {
          console.error("Failed to fetch movie details");
        }

        const reviewResponse = await fetch(`/api/movies/${movieId}/reviews`);
        if (reviewResponse.ok) {
          const reviewData = await reviewResponse.json();
          setReviews(reviewData);
        } else {
          console.error("Failed to fetch reviews");
        }
      } catch (error) {
        console.error("Error fetching movie or reviews:", error);
      }
    };

    fetchMovie();
  }, [params?.id]);

  const handleSubmitReview = async () => {
    try {
      const movieId = params?.id;
      if (!movieId) {
        console.error("No movie ID found for submitting review");
        return;
      }

      const url = editingReviewId
        ? `/api/movies/${movieId}/reviews`
        : `/api/movies/${movieId}/reviews`;

      const method = editingReviewId ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewId: editingReviewId,
          review,
          rating,
        }),
      });

      if (!response.ok) {
        throw new Error(
          editingReviewId ? "Failed to edit review" : "Failed to submit review"
        );
      }

      alert(editingReviewId ? "Review edited!" : "Review submitted!");
      setReview("");
      setRating(0);
      setEditingReviewId(null);

      const updatedReviews = await fetch(`/api/movies/${movieId}/reviews`);
      if (updatedReviews.ok) {
        setReviews(await updatedReviews.json());
      }
    } catch (error) {
      console.error("Error submitting/editing review:", error);
      alert("Error submitting/editing review");
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    try {
      const movieId = params?.id;
      if (!movieId) {
        console.error("No movie ID found for deleting review");
        return;
      }
      const response = await fetch(`/api/movies/${movieId}/reviews`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete review");
      }

      alert("Review deleted!");

      setReviews((prevReviews) => prevReviews.filter((r) => r.id !== reviewId));
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Error deleting review");
    }
  };

  const startEditingReview = (review: Review) => {
    setEditingReviewId(review.id);
    setReview(review.review);
    setRating(review.rating);
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

  if (!movie) {
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
          backgroundImage: "url('/cinema-background.jpg')",
          filter: "blur(8px)",
          transform: "scale(1.02)",
        }}
      ></div>
      <button onClick={() => router.push("/movies")} className="back-button">
        Back to Movies
      </button>

      <div
        className="bg-white/90 p-10 rounded-xl shadow-lg max-w-3xl w-full border border-[rgba(224,178,26,0.7)] z-10 mt-8 sm:mt-6"
        style={{ backdropFilter: "blur(10px)" }}
      >
        <h1
          className="text-4xl font-bold mb-6"
          style={{ color: "var(--gold)" }}
        >
          {movie.title}
        </h1>
        <h2 className="text-xl mb-2" style={{ color: "var(--gold)" }}>
          Director: {movie.director}
        </h2>
        <p className="text-gray-700 mb-6">
          Release Date:{" "}
          {movie.releaseDate
            ? new Date(movie.releaseDate).toLocaleDateString()
            : "N/A"}
          {movie.description && (
            <p className="text-gray-700 mb-4">
              Description: {movie.description}
            </p>
          )}
        </p>
        {movie.imageUrl && (
          <div className="flex justify-center items-center mb-6">
            <Image
              src={movie.imageUrl}
              alt={`${movie.title} poster`}
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
          {editingReviewId ? "Edit Review" : "Submit Review"}
        </button>
      </div>
      <div
        className="bg-white/90 p-8 rounded-xl shadow-lg max-w-3xl w-full mt-6 border border-[rgba(224,178,26,0.7)] z-10"
        style={{ backdropFilter: "blur(10px)" }}
      >
        <h2
          className="text-3xl font-bold mb-4"
          style={{ color: "var(--gold)" }}
        >
          Reviews
        </h2>
        {Array.isArray(reviews) &&
          reviews.map((r) => (
            <div key={r.id} className="border-b pb-4 mb-4 last:border-none">
              <p className="text-gray-800">{r.review}</p>
              <p
                className="text-[rgba(224,178,26,1)]"
                style={{ fontFamily: "serif" }}
              >
                {Array(r.rating).fill("★").join("")}
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => startEditingReview(r)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDeleteReview(r.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}