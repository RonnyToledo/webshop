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
      <Carousel
        className="w-full max-w-xs mt-4"
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
              <CarouselItem
                key={ind}
                className=" mb-6 overflow-hidden flex w-full  "
              >
                <div className="rounded-l-2xl flex-1 p-4 bg-gray-800 text-white">
                  <p className="text-sm mb-1">Ofertas Especiales</p>
                  <h2 className="text-3xl font-bold mb-2">{obj.price}</h2>
                  <p className="text-sm">{obj.title}</p>
                </div>
                <div className="relative flex-1">
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
                      className="w-full h-full  object-cover rounded-xl mb-2"
                      width={200}
                      height={200}
                    />
                  </Link>
                </div>
              </CarouselItem>
            ))}
        </CarouselContent>
      </Carousel>

      <AllProduct />
    </div>
  );
}

function MenuIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ShoppingCartIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

function StarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
