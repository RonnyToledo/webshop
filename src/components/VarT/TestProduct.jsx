"use client";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import React, { useState } from "react";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { Button } from "@/components/ui/button";

export default function TestProducts({ com, sitioweb, specific }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [newComment, setNewComment] = useState({
    cmt: "",
    title: "",
    star: 1,
    name: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        `/api/tienda/${sitioweb}/products/${specific}`,
        {
          comentario: [...com, newComment],
        },
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast({
        title: "Tarea Ejecutada",
        description: "Información Actualizada",
        action: (
          <ToastAction altText="Goto schedule to undo">Cerrar</ToastAction>
        ),
      });
    } catch (error) {
      console.error("Error al enviar el comentario:", error);
      toast({
        title: "Error",
        description: "No se pudo enviar el comentario.",
      });
    } finally {
      setLoading(false);
      setNewComment({ cmt: "", title: "", star: 1, name: "" });
    }
  };

  return (
    <div>
      <Drawer>
        <DrawerTrigger className="text-white bg-primary my-10 py-4 px-8 rounded-lg flex items-center justify-center">
          Dar reseña
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Deja tu reseña</DrawerTitle>
            <DrawerDescription>
              Comparte tu experiencia con otros clientes
            </DrawerDescription>
          </DrawerHeader>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                required
                placeholder="Ingresa tu nombre"
                value={newComment.name}
                onChange={(e) =>
                  setNewComment({ ...newComment, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                required
                placeholder="Ponle un encabezado a tu comentario"
                value={newComment.title}
                onChange={(e) =>
                  setNewComment({ ...newComment, title: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rating">Calificación</Label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    onClick={() => setNewComment({ ...newComment, star })}
                    className={`w-6 h-6 ${
                      newComment.star >= star
                        ? "fill-primary"
                        : "fill-muted stroke-muted-foreground"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="review">Reseña</Label>
              <Textarea
                id="review"
                required
                placeholder="Escribe tu reseña"
                rows={4}
                value={newComment.cmt}
                onChange={(e) =>
                  setNewComment({ ...newComment, cmt: e.target.value })
                }
              />
            </div>
            <Button
              className={`bg-primary text-white font-medium py-2 px-4 rounded ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar"}
            </Button>
            <DrawerClose>
              <Button variant="outline">Cancelar</Button>
            </DrawerClose>
          </form>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

function StarIcon({ className, ...props }) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
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
