"use client";
import React, { useState } from "react";
import { Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import { initializeAnalytics } from "@/lib/datalayer";

// Componente RatingModal
export function RatingModal({
  isOpen,
  onClose,
  selectedRating,
  userName,
  image,
  setSelectedRating,
  description,
  setDescription,
  nombre,
  setNombre,
  loading,
  handleSubmit,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <Image
                  src="/placeholder.svg"
                  alt={userName}
                  width="100"
                  height="100"
                />
              </Avatar>
              <div className="flex flex-col">
                <DialogTitle className="text-lg">{userName}</DialogTitle>
                <p className="text-sm text-gray-400">
                  Calificarias nuestro servicio
                </p>
                <p className="text-xs text-gray-400">
                  Las opiniones son públicas.{" "}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="text-blue-400"
              onClick={handleSubmit}
            >
              {loading ? "Publicando..." : "Publicar"}
            </Button>
          </div>
        </DialogHeader>
        <Input
          placeholder="Nombre"
          className="bg-transparent border-gray-700 resize-none"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <div className="flex gap-1 my-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              onClick={() => setSelectedRating(rating)}
              className="hover:scale-110 transition-transform"
            >
              <Star
                className={`w-10 h-10 ${
                  rating <= selectedRating
                    ? "fill-blue-600 text-blue-600"
                    : "text-gray-400"
                }`}
              />
            </button>
          ))}
        </div>
        <Textarea
          placeholder="Describe tu experiencia (opcional)"
          className="bg-transparent border-gray-700 resize-none"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={500}
        />
        <div className="text-right text-xs text-gray-400">
          {description.length}/500
        </div>
      </DialogContent>
    </Dialog>
  );
}
