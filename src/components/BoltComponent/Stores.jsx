"use client";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "@/components/BoltComponent/Navbar";
import RetryableImage from "../globalFunctions/RetryableImage";
import { logoApp } from "@/lib/image";

export default function Stores() {
  const { webshop, setwebshop } = useContext(ThemeContext);
  const [storesFiltering, setstoresFiltering] = useState([]);

  useEffect(() => {
    setstoresFiltering(desordenarArray(webshop.store));
  }, [webshop]);
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Nuestras Tiendas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {storesFiltering.slice(0, 4).map((store) => (
            <div key={store.id} className="group cursor-pointer">
              <Link href={`/t/${store?.sitioweb}`}>
                <div className="relative overflow-hidden rounded-lg shadow-md">
                  <RetryableImage
                    width="500"
                    height="500"
                    src={store.urlPoster || logoApp}
                    alt={store.name || ""}
                    className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                    <div className="absolute bottom-0 p-4 text-white">
                      <h3 className="text-xl font-bold">{store.name}</h3>
                      <p className="text-sm opacity-90">{store.tipo}</p>
                      <p className="text-sm opacity-90">
                        {store.municipio && `${store.municipio}-`}
                        {store.Provincia}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
function desordenarArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Índice aleatorio
    // Intercambiar elementos
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
