"use client";
import React from "react";
import { Heart, ShoppingCart, Star, Plus, Minus } from "lucide-react";
import { useState, useEffect, useContext } from "react";
import { MyContext } from "@/context/MyContext";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { StarCount, ButtonOfCart } from "../globalFunctions/components";

export default function AllProduct() {
  const { store, dispatchStore } = useContext(MyContext);
  console.log(store);
  return (
    <>
      {ExtraerCategorias(store, store.products).map((categoria, ind) => (
        <div
          key={ind}
          className="flex flex-col w-full mt-4 p-2 md:p-4 bg-white rounded-lg shadow-md"
        >
          <div className="flex justify-start mt-4">
            <h2 className="text-lg font-semibold">{categoria}</h2>
          </div>
          <MapProducts
            prod={store.products.filter((obj) => obj.caja == categoria)}
            store={store}
            title={categoria}
          />
        </div>
      ))}
      {store.products.some((prod) => !store.categoria.includes(prod.caja)) && (
        <div className="flex flex-col w-full mt-4 p-2 md:p-4 bg-white rounded-lg shadow-md">
          <div className="flex justify-start mt-4">
            <h2 className="text-lg font-semibold">Otros productos</h2>
          </div>
          <MapProducts
            prod={store.products.filter(
              (prod) => !store.categoria.includes(prod.caja)
            )}
            store={store}
          />
        </div>
      )}
    </>
  );
}

function MapProducts({ prod, store }) {
  return (
    <div className="grid grid-cols-2 gap-1">
      {prod
        .sort((a, b) => a.order - b.order)
        .map((prod, index) => (
          <div
            key={index}
            className="bg-gray-50 p-2 md:p-4 rounded-2xl relative"
          >
            <Link
              className="relative"
              href={`/${store.variable}/${store.sitioweb}/products/${prod.productId}`}
            >
              <Image
                src={
                  prod.image ||
                  store.urlPoster ||
                  "https://res.cloudinary.com/dbgnyc842/image/upload/v1725399957/xmlctujxukncr5eurliu.png"
                }
                alt={prod.title || `Producto ${index}`}
                className="w-full h-48 md:h-64 object-cover rounded-xl mb-2"
                width={300}
                height={300}
              />
              {prod.agotado && (
                <Badge variant="destructive" className="absolute top-2 right-2">
                  Agotado
                </Badge>
              )}
              <HanPasadoSieteDias fecha={prod.creado} />
            </Link>
            <p className="text-sm font-semibold">{prod.title}</p>
            <p className="text-sm font-bold mb-1">
              ${Number(prod.price).toFixed(2)} {store.moneda_default.moneda}
            </p>
            <div className="flex items-center mb-2">
              <StarCount array={prod.coment} campo={"star"} />
            </div>
            <ButtonOfCart prod={prod} />
          </div>
        ))}
    </div>
  );
}

function ExtraerCategorias(store, products) {
  const categoriasProductos = new Set(products.map((prod) => prod.caja));
  return store.categoria.filter((cat) => categoriasProductos.has(cat));
}
function HanPasadoSieteDias({ fecha }) {
  const fechaEntrada = new Date(fecha);
  const fechaActual = new Date();
  const diferenciaEnDias = (fechaActual - fechaEntrada) / (1000 * 60 * 60 * 24);

  return (
    <>
      {diferenciaEnDias <= 7 && (
        <Badge className="absolute top-2 left-2 text-xs mb-1">New</Badge>
      )}
    </>
  );
}
