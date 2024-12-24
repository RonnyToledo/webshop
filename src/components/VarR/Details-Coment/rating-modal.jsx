"use client";
import React, { useEffect, useState, useContext } from "react";
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
import { MyContext } from "@/context/MyContext";
import Image from "next/image";

export function RatingModal({
  isOpen,
  onClose,
  selectedRating,
  userName,
  setSelectedRating,
  description,
  setDescription,
  setnombre,
  nombre,
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
                <DialogTitle className="text-base">{userName}</DialogTitle>
                <p className="text-xs text-gray-400">
                  Las opiniones son públicas.{" "}
                  <span className="underline">Más información</span>
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="text-blue-400"
              onClick={handleSubmit}
            >
              {loading ? "Publicando" : "Publicar"}
            </Button>
          </div>
        </DialogHeader>
        <Input
          placeholder="Nombre"
          className="bg-transparent border-gray-700 resize-none "
          value={nombre}
          onChange={(e) => setnombre(e.target.value)}
        />

        <div className="flex gap-1 my-4">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              onClick={() => setSelectedRating(rating)}
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
