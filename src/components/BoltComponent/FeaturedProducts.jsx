import React from "react";
import { Store, Star } from "lucide-react";
import Image from "next/image";

const products = [
  {
    id: 1,
    name: "Smartphone XZ Pro",
    price: "899,99 €",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800",
    store: {
      name: "TechZone",
      rating: 4.8,
      location: "Planta 1",
    },
    badge: "Nuevo",
  },
  {
    id: 2,
    name: "Zapatillas Running Air",
    price: "129,99 €",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800",
    store: {
      name: "SportMax",
      rating: 4.9,
      location: "Planta 1",
    },
    badge: "Oferta",
  },
  {
    id: 3,
    name: "Bolso Elegance",
    price: "299,99 €",
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800",
    store: {
      name: "Fashion Plus",
      rating: 4.7,
      location: "Planta 2",
    },
    badge: "Exclusivo",
  },
  {
    id: 4,
    name: "Reloj Smart Pro",
    price: "199,99 €",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800",
    store: {
      name: "TechZone",
      rating: 4.8,
      location: "Planta 1",
    },
    badge: "Tendencia",
  },
];

export default function FeaturedProducts() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Productos Destacados
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2  gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow group"
            >
              <div className="relative">
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {product.badge}
                  </span>
                </div>
                <div className="h-48 overflow-hidden">
                  <Image
                    width="500"
                    height="500"
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {product.name}
                </h3>
                <div className="flex items-center space-x-2 mb-3">
                  <Store className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {product.store.name}
                  </span>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-sm text-gray-600">
                    {product.store.location}
                  </span>
                </div>
                <div className="flex items-center space-x-1 mb-3">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">
                    {product.store.rating}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-purple-600 font-bold">{product.price}</p>
                  <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                    Ver detalles
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
