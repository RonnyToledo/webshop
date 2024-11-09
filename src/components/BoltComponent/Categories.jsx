"use client";
import React from "react";
import {
  Smartphone,
  ShoppingBag,
  Utensils,
  Watch,
  Shirt,
  Dumbbell,
  Book,
  Gift,
} from "lucide-react";

const categories = [
  { name: "Electrónica", icon: Smartphone, color: "bg-blue-100 text-blue-600" },
  { name: "Moda", icon: Shirt, color: "bg-pink-100 text-pink-600" },
  { name: "Deportes", icon: Dumbbell, color: "bg-green-100 text-green-600" },
  { name: "Accesorios", icon: Watch, color: "bg-purple-100 text-purple-600" },
  { name: "Restaurantes", icon: Utensils, color: "bg-red-100 text-red-600" },
  { name: "Libros", icon: Book, color: "bg-yellow-100 text-yellow-600" },
  { name: "Regalos", icon: Gift, color: "bg-indigo-100 text-indigo-600" },
  { name: "Otros", icon: ShoppingBag, color: "bg-gray-100 text-gray-600" },
];

export default function Categories() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Categorías</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.name}
              className="flex flex-col items-center p-6 rounded-xl cursor-pointer hover:transform hover:scale-105 transition-all"
            >
              <div className={`p-4 rounded-full ${category.color} mb-4`}>
                <category.icon className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                {category.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
