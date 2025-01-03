"use client";

import React, { useState, useContext, useEffect } from "react";
import { Star } from "lucide-react";
import { RatingModal } from "./rating-modal";
import { ReviewsSection } from "./reviews-section";
import { MyContext } from "@/context/MyContext";
import { Promedio } from "@/components/globalFunctions/function";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { supabase } from "@/lib/supa";

export default function RatingSection({ specific, sitioweb, coments }) {
  const { toast } = useToast();
  const { store, dispatchStore } = useContext(MyContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [nombre, setnombre] = useState("");

  const handleStarClick = (rating) => {
    setSelectedRating(rating);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `/api/tienda/${sitioweb}/products/${specific}`,
        {
          comentario: { cmt: description, star: selectedRating, name: nombre },
        },
        { headers: { "Content-Type": "application/json" } } // Cambia a application/json
      );

      if (res.status === 200) {
        toast({
          title: "Tarea Ejecutada",
          description: "Información Actualizada",
          action: (
            <ToastAction altText="Goto schedule to undo">Cerrar</ToastAction>
          ),
        });
        dispatchStore({
          type: "AddComentProduct",
          payload: { data: res?.data?.value, specific: specific },
        });
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error al enviar el comentario:", error);
      toast({
        title: "Error",
        description: "No se pudo enviar el comentario.",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {store.products
        .filter((env) => env.productId === specific)
        .map((obj, ind) => (
          <div key={ind} className="max-w-xl mx-auto p-6 ">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg ">Calificaciones y opiniones</h2>
              <div className="text-lg">→</div>
            </div>

            <p className="text-gray-500 mb-6 text-sm">
              Las calificaciones y opiniones provienen de personas que usan el
              mismo tipo de dispositivo que tú.
            </p>

            <div className="flex items-center gap-8 mb-8">
              <div>
                <div className="text-6xl font-light">
                  {Number(obj.coment.promedio).toFixed(1)}
                </div>
                <div className="flex gap-1 my-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Number(obj.coment.promedio)
                          ? "fill-yellow-600 text-yellow-600"
                          : "text-yellow-600"
                      }`}
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  {obj.coment.total.toLocaleString()}
                </div>
              </div>

              <div className="flex-1">
                {[5, 4, 3, 2, 1].map((item) => (
                  <div key={item} className="flex items-center gap-2 mb-1">
                    <span className="w-3">{item}</span>
                    <div className="flex-1 h-2 bg-gray-400 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-400"
                        style={{
                          width: `${
                            (coments.filter((obj) => obj?.star == item).length *
                              100) /
                              coments.length || 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-800 pt-6">
              <h3 className="text-xl mb-2">Califica este producto</h3>
              <p className="text-gray-400 mb-4">
                Comparte tu opinión con otros usuarios
              </p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleStarClick(rating)}
                    className="hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-12 h-12 ${
                        rating <= selectedRating
                          ? "fill-blue-600 text-blue-600"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <ReviewsSection reviews={coments} />

            <RatingModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              selectedRating={selectedRating}
              setSelectedRating={setSelectedRating}
              userName="Usuario"
              description={description}
              setDescription={setDescription}
              setnombre={setnombre}
              nombre={nombre}
              loading={loading}
              handleSubmit={handleSubmit}
            />
          </div>
        ))}
    </>
  );
}
