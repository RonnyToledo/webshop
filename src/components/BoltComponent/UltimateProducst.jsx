"use client";
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { Store, Star } from "lucide-react";
import RetryableImage from "../globalFunctions/RetryableImage";
import { ThemeContext } from "@/app/layout";
import "@github/relative-time-element";
import Link from "next/link";

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
          {productsFiltering.slice(0, 6).map((product) => (
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

function StoreDetails({ storeId, name, creado, price, productId }) {
  const { webshop, setwebshop } = useContext(ThemeContext);
  const [newStore, setnewStore] = useState({});

  useEffect(() => {
    const [a] = webshop.store.filter((str) => str.UUID == storeId);
    setnewStore(a);
  }, [webshop.store, storeId]);

  return (
    <>
      <h3 className="text-lg font-semibold text-gray-800 mb-2"></h3>
      <h3 className="text-lg font-semibold text-gray-800 mb-2 h-14">{name}</h3>
      <div className="flex items-center space-x-2 mb-3">
        <Store className="h-4 w-4 text-gray-500" />
        <span className="text-sm text-gray-600 "> {newStore?.name}</span>

        <span className="text-sm text-gray-400">•</span>
        <span className="text-sm text-gray-600">
          <relative-time lang="es" datetime={creado} no-title></relative-time>
        </span>
      </div>
      <div className="flex items-center space-x-2 mb-3"></div>
      <div className="flex justify-between items-center">
        <p className="text-purple-600 font-bold">${Number(price).toFixed(2)}</p>
        <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
          <Link
            href={`/${newStore.variable}/${newStore.sitioweb}/products/${productId}`}
          >
            Ver detalles
          </Link>
        </button>
      </div>
    </>
  );
}

const filterRecentProducts = (products) =>
  products.sort((a, b) => new Date(b.creado) - new Date(a.creado)).slice(0, 10);
