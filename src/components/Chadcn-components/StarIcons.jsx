"use client";
import { Star, StarHalf } from "lucide-react";

export default function StarIcons({ rating }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  console.log(hasHalfStar);
  return (
    <div className="flex items-center justify-center gap-0.5 mt-2">
      {/* Renderizar estrellas completas */}
      {[...Array(fullStars)].map((_, index) => (
        <div className="relative">
          <Star
            key={index}
            className="w-4 h-4 md:w-5 md:h-5 stroke-gray-500 fill-gray-900 "
          />
          <Star className="w-4 h-4 md:w-5 md:h-5  absolute top-0 left-0" />
        </div>
      ))}
      {/* Renderizar media estrella si corresponde */}
      {hasHalfStar && (
        <div className="relative">
          <StarHalf className="w-4 h-4 md:w-5 md:h-5 fill-gray-900" />
          <Star className="w-4 h-4 md:w-5 md:h-5  absolute top-0 left-0" />
        </div>
      )}
      {/* Renderizar estrellas vacías */}
      {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, index) => (
        <div className="relative">
          <Star key={index} className="w-4 h-4 md:w-5 md:h-5 stroke-gray-500" />
          <Star className="w-4 h-4 md:w-5 md:h-5  absolute top-0 left-0" />
        </div>
      ))}
    </div>
  );
}

function StarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
