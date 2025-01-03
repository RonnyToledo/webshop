"use client";

import { useEffect, useState, useContext } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReviewCard } from "./Details-Coment/review-card";
import { supabase } from "@/lib/supa";
import { MyContext } from "@/context/MyContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CommentsPage() {
  const { store } = useContext(MyContext);

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // Página actual
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRating, setSelectedRating] = useState(0);

  const pageSize = 10; // Cantidad de comentarios por página

  const fetchComments = async (currentPage = 1, ratingFilter = 0, UUID) => {
    setLoading(true);

    try {
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize - 1;

      const query = supabase
        .from("comentTienda")
        .select("*", { count: "exact" })
        .eq("UIStore", UUID)
        .order("created_at", { ascending: false }) // Ordenar por fecha más reciente
        .range(start, end);

      if (ratingFilter > 0) {
        query.eq("star", ratingFilter);
      }

      const { data, count, error } = await query;

      if (error) throw error;

      setReviews(data);
      setTotalPages(Math.ceil(count / pageSize));
    } catch (error) {
      console.error("Error al cargar comentarios:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments(page, selectedRating, store.UUID);
  }, [page, selectedRating, store.UUID]);

  const handleRatingFilter = (rating) => {
    setSelectedRating((prevRating) => (prevRating === rating ? 0 : rating));
    setPage(1); // Reinicia a la primera página cuando cambias el filtro
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
        {reviews.map((review, index) => (
          <ReviewCard key={index} {...review} />
        ))}
      </div>

      {loading && (
        <p className="text-center text-gray-600 mt-8">
          Cargando comentarios...
        </p>
      )}

      {reviews.length === 0 && !loading && (
        <p className="text-center text-gray-600 mt-8">
          No se encontraron comentarios que coincidan con tu búsqueda.
        </p>
      )}

      <div className="flex justify-between items-center mt-8">
        <Button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1 || loading}
          className="rounded-full"
        >
          <ChevronLeft />
        </Button>
        <p className="text-gray-600">
          Página {page} de {totalPages}
        </p>
        <Button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages || loading}
          className="rounded-full"
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
