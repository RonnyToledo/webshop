"use client";
import { ReviewCard } from "./review-card";

export function ReviewsSection({ reviews }) {
  return (
    <div className="border-t border-gray-800 mt-6">
      {reviews.map((review, index) => (
        <ReviewCard key={index} {...review} />
      ))}
    </div>
  );
}
