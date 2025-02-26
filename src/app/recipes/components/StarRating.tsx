"use client";

import { useState } from "react";

export default function StarRating({
  rating,
  onRate,
}: {
  rating: number;
  onRate?: (value: number) => void;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`cursor-pointer text-2xl ${
            star <= (hover || rating) ? "text-yellow-500" : "text-gray-300"
          }`}
          onClick={() => onRate && onRate(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
}
