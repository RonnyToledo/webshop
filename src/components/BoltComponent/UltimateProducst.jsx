"use client";
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { Store, Star } from "lucide-react";
import RetryableImage from "../globalFunctions/RetryableImage";
import { ThemeContext } from "@/components/BoltComponent/Navbar";
import "@github/relative-time-element";
import Link from "next/link";
import { StoreDetails } from "./StoreDetails";

export default function UltimateProducts() {
  const { webshop, setwebshop } = useContext(ThemeContext);
  const [productsFiltering, setproductsFiltering] = useState([]);

  useEffect(() => {
    setproductsFiltering(filterRecentProducts(webshop.products));
  }, [webshop]);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Nuevas Ofertas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2  gap-8">
          {productsFiltering.slice(0, 4).map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow group"
            >
              <div className="relative">
                {product.favorito && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Especial
                    </span>
                  </div>
                )}
                <div className="h-48 overflow-hidden">
                  <RetryableImage
                    width="500"
                    height="500"
                    src={
                      product.image ||
                      "https://res.cloudinary.com/dbgnyc842/image/upload/v1725399957/xmlctujxukncr5eurliu.png"
                    }
                    alt={product.title || ""}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>
              <div className="p-4">
                <StoreDetails
                  storeId={product.storeId}
                  name={product.title}
                  creado={product.creado}
                  price={product.price}
                  productId={product.productId}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const filterRecentProducts = (products) =>
  products.sort((a, b) => new Date(b.creado) - new Date(a.creado)).slice(0, 10);
