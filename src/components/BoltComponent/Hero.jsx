import React from "react";

export default function Hero() {
  return (
    <div
      className="relative h-[600px] bg-cover bg-center"
      style={{
        backgroundImage:
          'url("https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&q=80")',
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-5xl font-bold mb-4">R&H || Boulevard</h1>
            <p className="text-xl mb-8">
              Descubre una nueva experiencia de compras
            </p>
            <button className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition-colors">
              Explorar Tiendas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
