import React from "react";
import { Star, StarHalf } from "lucide-react";

export default function StarIcons({ rating }) {
  console.log(rating);
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  return (
    <div className="flex items-center justify-center gap-0.5 mt-2">
      {[...Array(fullStars)].map((_, index) => (
        <div key={`full-${index}`} className="relative">
          <Star
            id={`full-${index}-rel`}
            className="w-4 h-4 md:w-5 md:h-5 stroke-gray-500 fill-gray-900 "
          />
          <Star
            id={`full-${index}-abs`}
            className="w-4 h-4 md:w-5 md:h-5 absolute top-0 left-0"
          />
        </div>
      ))}

      {hasHalfStar && (
        <div className="relative">
          <StarHalf className="w-4 h-4 md:w-5 md:h-5 fill-gray-900" />
          <Star className="w-4 h-4 md:w-5 md:h-5  absolute top-0 left-0" />
        </div>
      )}
      {/* Renderizar estrellas vacías */}
      {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, index) => (
        <div key={`empty-${index}`} className="relative">
          <Star
            id={`full-${index}-rel`}
            className="w-4 h-4 md:w-5 md:h-5 stroke-gray-500"
          />
          <Star
            id={`full-${index}-abs`}
            className="w-4 h-4 md:w-5 md:h-5 absolute top-0 left-0"
          />
        </div>
      ))}
    </div>
  );
}
