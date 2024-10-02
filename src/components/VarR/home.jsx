"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useState, useEffect, useContext } from "react";
import { MyContext } from "@/context/MyContext";
import Housr from "./Horas";
import AllProduct from "./allProduct";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";

export function Home() {
  const { store, dispatchStore } = useContext(MyContext);
  return (
    <div className="flex flex-col items-center min-h-screen p-2 md:p-4 bg-gray-100">
      <Housr />
      {store.products.filter((obj) => obj.favorito).length > 0 && (
        <Carousel
          className="w-full max-w-sm mt-4"
          plugins={[
            Autoplay({
              delay: 3000,
            }),
          ]}
        >
          <CarouselContent>
            {store.products
              .filter((obj) => obj.favorito)
              .slice(0, 5)
              .map((obj, ind) => (
                <CarouselItem key={ind} className="mb-6">
                  <div className="bg-gray-800 overflow-hidden grid grid-cols-3 w-full h-48 md:h-72 rounded-2xl">
                    <div className="flex-1 p-4 text-white">
                      <p className="text-sm mb-1">Especiales</p>
                      <h2 className="text-3xl font-bold mb-2">
                        {Number(obj.price).toFixed(2)}
                      </h2>
                      <p className="text-sm">{obj.title}</p>
                    </div>
                    <div className="relative flex-1 col-span-2">
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-transparent z-[1]"></div>
                      <Link
                        className="relative"
                        href={`/${store.variable}/${store.sitioweb}/products/${obj.productId}`}
                      >
                        <Image
                          src={
                            obj.image ||
                            store.urlPoster ||
                            "https://res.cloudinary.com/dbgnyc842/image/upload/v1725399957/xmlctujxukncr5eurliu.png"
                          }
                          alt={obj.title || `Producto ${ind}`}
                          className="w-full h-full object-cover rounded-xl mb-2"
                          width={300}
                          height={300}
                        />
                      </Link>
                    </div>
                  </div>
                </CarouselItem>
              ))}
          </CarouselContent>
        </Carousel>
      )}

      <AllProduct />
    </div>
  );
}
