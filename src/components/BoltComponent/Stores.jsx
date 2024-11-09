import Image from "next/image";
import React from "react";

const stores = [
  {
    id: 1,
    name: "TechZone",
    category: "Electrónica",
    image:
      "https://images.unsplash.com/photo-1491933382434-500287f9b54b?auto=format&fit=crop&q=80&w=800",
    floor: "Planta 1",
  },
  {
    id: 2,
    name: "Fashion Plus",
    category: "Moda",
    image:
      "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=800",
    floor: "Planta 2",
  },
  {
    id: 3,
    name: "SportMax",
    category: "Deportes",
    image:
      "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?auto=format&fit=crop&q=80&w=800",
    floor: "Planta 1",
  },
  {
    id: 4,
    name: "Café Central",
    category: "Restaurantes",
    image:
      "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&q=80&w=800",
    floor: "Planta 3",
  },
];

export default function Stores() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Nuestras Tiendas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stores.map((store) => (
            <div key={store.id} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg shadow-md">
                <Image
                  width="500"
                  height="500"
                  src={store.image}
                  alt={store.name}
                  className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="absolute bottom-0 p-4 text-white">
                    <h3 className="text-xl font-bold">{store.name}</h3>
                    <p className="text-sm opacity-90">{store.category}</p>
                    <p className="text-sm opacity-90">{store.floor}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
