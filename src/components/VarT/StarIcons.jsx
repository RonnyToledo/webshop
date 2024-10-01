import React from "react";
import { Star, StarHalf } from "lucide-react";

export default function StarIcons({ rating }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center justify-center gap-0.5 mt-2">
      {[...Array(fullStars)].map((_, index) => (
        <Star
          key={`full-${index}`}
          className="w-4 h-4 md:w-5 md:h-5 fill-gray-900 stroke-gray-500"
        />
      ))}

      {hasHalfStar && (
        <StarHalf className="w-4 h-4 md:w-5 md:h-5 fill-gray-900 stroke-gray-500" />
      )}

      {[...Array(emptyStars)].map((_, index) => (
        <Star
          key={`empty-${index}`}
          className="w-4 h-4 md:w-5 md:h-5 stroke-gray-500"
        />
      ))}
    </div>
  );
}
