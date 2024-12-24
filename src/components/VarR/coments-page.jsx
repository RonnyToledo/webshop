"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, Search, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ReviewCard } from "./Details-Coment/review-card";
import { MyContext } from "@/context/MyContext";
import { useContext } from "react";
import { shuffleArray } from "../globalFunctions/function";

export default function CommentsPage() {
  const { store } = useContext(MyContext);
  const [filteredReviews, setfilteredReviews] = useState([]);
  const [selectedRating, setSelectedRating] = useState(0);
  useEffect(() => {
    setfilteredReviews(
      selectedRating > 0
        ? store.comentTienda.filter((review) => review.star === selectedRating)
        : shuffleArray(store.comentTienda)
    );
  }, [selectedRating, store.comentTienda]);
  console.log(store.comentTienda, filteredReviews, selectedRating);

  const handleRatingFilter = (rating) => {
    setSelectedRating((prevRating) => (prevRating === rating ? 0 : rating));
  };

  return (
    <div className="max-w-xl mx-auto p-6 min-h-screen">
      <div className="flex justify-between mb-6">
        <p className="text-gray-400">Filtrar por calificación:</p>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <Button
              key={rating}
              onClick={() => handleRatingFilter(rating)}
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                selectedRating >= rating
                  ? "bg-blue-600 hover:bg-blue-600"
                  : "bg-gray-800 hover:bg-gray-800"
              } transition-colors duration-200`}
            >
              <Star
                className={`w-5 h-5 ${
                  selectedRating >= rating
                    ? "fill-white text-white"
                    : "text-gray-400"
                }`}
              />
            </Button>
          ))}
        </div>
      </div>
      <div className="space-y-6">
        {filteredReviews.map((review, index) => (
          <ReviewCard key={index} {...review} />
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <p className="text-center text-gray-600 mt-8">
          No se encontraron comentarios que coincidan con tu búsqueda.
        </p>
      )}
    </div>
  );
}
