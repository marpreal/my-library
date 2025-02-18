"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Movie, Review } from "../types";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function MovieDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [movie, setMovie] = useState<Movie | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const movieId = params?.id;
        if (!movieId) return;

        const [movieRes, reviewsRes] = await Promise.all([
          fetch(`/api/movies/${movieId}`),
          fetch(`/api/movies/${movieId}/reviews`),
        ]);

        if (movieRes.ok) {
          setMovie(await movieRes.json());
        } else {
          console.error("Failed to fetch movie details");
        }

        if (reviewsRes.ok) {
          setReviews(await reviewsRes.json());
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
    if (!userId) {
      alert("You must be logged in to submit a review.");
      return;
    }

    try {
      const movieId = params?.id;
      if (!movieId) return;

      const url = `/api/movies/${movieId}/reviews`;
      const method = editingReviewId ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewId: editingReviewId,
          review,
          rating,
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error(
          editingReviewId ? "Failed to edit review" : "Failed to submit review"
        );
      }

      alert(editingReviewId ? "Review updated!" : "Review submitted!");
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
    if (!userId) {
      alert("You must be logged in to delete a review.");
      return;
    }

    try {
      const movieId = params?.id;
      if (!movieId) return;

      const response = await fetch(`/api/movies/${movieId}/reviews`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, userId }), 
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
      <div className="min-h-screen flex items-center justify-center">
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
    <div className="min-h-screen flex flex-col items-center py-10 relative">
      <button onClick={() => router.push("/movies")} className="back-button">
        Back to Movies
      </button>

      <div className="bg-white/90 p-10 rounded-xl shadow-lg max-w-3xl w-full border z-10 mt-8 sm:mt-6">
        <h1 className="text-4xl font-bold mb-6">{movie.title}</h1>
        <h2 className="text-xl mb-2">Director: {movie.director}</h2>
        <p className="text-gray-700 mb-6">
          Release Date:{" "}
          {movie.releaseDate
            ? new Date(movie.releaseDate).toLocaleDateString()
            : "N/A"}
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
          className="w-full px-4 py-3 border rounded-lg bg-white shadow-md mb-4"
        />
        <div className="flex items-center gap-2 mb-6">
          <label className="font-medium">Rating:</label>
          {renderStars()}
        </div>
        <button
          onClick={handleSubmitReview}
          className="w-full bg-yellow-500 text-white px-6 py-3 rounded-lg"
        >
          {editingReviewId ? "Edit Review" : "Submit Review"}
        </button>
      </div>
      <div className="bg-white/90 p-8 rounded-xl shadow-lg max-w-3xl w-full mt-6 border z-10">
        <h2 className="text-3xl font-bold mb-4">Reviews</h2>
        {Array.isArray(reviews) &&
          reviews.map((r) => (
            <div key={r.id} className="border-b pb-4 mb-4 last:border-none">
              <p className="text-gray-800">{r.review}</p>
              <p className="text-yellow-500">
                {Array(r.rating).fill("★").join("")}
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => startEditingReview(r)}
                  className="text-blue-500"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDeleteReview(r.id)}
                  className="text-red-500"
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
