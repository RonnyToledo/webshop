import React, { useState } from "react";
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
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";

const categories = [
  {
    name: "Electrónica",
    icon: Smartphone,
    color: "bg-blue-100 text-blue-600",
    products: [
      {
        id: 1,
        name: "iPhone 15 Pro",
        price: "1299,99 €",
        image:
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800",
      },
      {
        id: 2,
        name: "MacBook Air",
        price: "1199,99 €",
        image:
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800",
      },
      {
        id: 3,
        name: "AirPods Pro",
        price: "279,99 €",
        image:
          "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?auto=format&fit=crop&q=80&w=800",
      },
    ],
  },
  {
    name: "Moda",
    icon: Shirt,
    color: "bg-pink-100 text-pink-600",
    products: [
      {
        id: 4,
        name: "Vestido Elegante",
        price: "89,99 €",
        image:
          "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&q=80&w=800",
      },
      {
        id: 5,
        name: "Traje Formal",
        price: "299,99 €",
        image:
          "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800",
      },
      {
        id: 6,
        name: "Zapatos Casuales",
        price: "79,99 €",
        image:
          "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=800",
      },
    ],
  },
  {
    name: "Deportes",
    icon: Dumbbell,
    color: "bg-green-100 text-green-600",
    products: [
      {
        id: 7,
        name: "Zapatillas Running",
        price: "129,99 €",
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800",
      },
      {
        id: 8,
        name: "Mancuernas 10kg",
        price: "49,99 €",
        image:
          "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800",
      },
      {
        id: 9,
        name: "Yoga Mat",
        price: "29,99 €",
        image:
          "https://images.unsplash.com/photo-1601925260368-ae2f83cf9b3f?auto=format&fit=crop&q=80&w=800",
      },
    ],
  },
  {
    name: "Accesorios",
    icon: Watch,
    color: "bg-purple-100 text-purple-600",
    products: [
      {
        id: 10,
        name: "Reloj Smart Pro",
        price: "199,99 €",
        image:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800",
      },
      {
        id: 11,
        name: "Bolso Elegance",
        price: "299,99 €",
        image:
          "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800",
      },
      {
        id: 12,
        name: "Gafas de Sol",
        price: "149,99 €",
        image:
          "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800",
      },
    ],
  },
  {
    name: "Restaurantes",
    icon: Utensils,
    color: "bg-red-100 text-red-600",
    products: [
      {
        id: 13,
        name: "Menú Ejecutivo",
        price: "25,99 €",
        image:
          "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&q=80&w=800",
      },
      {
        id: 14,
        name: "Brunch Especial",
        price: "19,99 €",
        image:
          "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=800",
      },
      {
        id: 15,
        name: "Café Gourmet",
        price: "4,99 €",
        image:
          "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800",
      },
    ],
  },
];

export default function CategoryProducts() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Explora por Categorías
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category)}
              className={`flex flex-col items-center p-4 rounded-xl transition-all ${
                selectedCategory.name === category.name
                  ? "bg-purple-100 scale-105"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className={`p-3 rounded-full ${category.color} mb-2`}>
                <category.icon className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium text-gray-800">
                {category.name}
              </span>
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            {selectedCategory.name}
          </h3>
          <Slider {...settings}>
            {selectedCategory.products.map((product) => (
              <div key={product.id} className="px-2">
                <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <Image
                      width="500"
                      height="500"
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      {product.name}
                    </h4>
                    <p className="text-purple-600 font-bold">{product.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
}
