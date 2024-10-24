"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useState, useEffect, useContext, useRef } from "react";
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
  const sectionRefs = useRef([]);
  const ref = useRef();
  // Crear referencias para cada sección
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.map((entry) => {
          if (entry.isIntersecting) {
            // Actualiza el ID de la sección visible
            dispatchStore({
              type: "Top",
              payload: entry.target.parentNode.id.split("_").join(" "),
            });
          }
        });
      },
      {
        threshold: 0, // Cambia este valor según necesites
      }
    );
    const handleScroll = () => {
      [ref.current, ...sectionRefs.current].forEach((section) => {
        observer.observe(section);
      });
    };
    window.addEventListener("scroll", handleScroll); // Agrega el listener
    return () => {
      // Desconectar el observer al desmontar
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll); // Limpia el listener al desmontar
    };
  }, [dispatchStore]);

  return (
    <div
      className="flex flex-col items-center min-h-screen md:px-4 bg-gray-100"
      id={`${store.name?.replace(/\s+/g, "_")}`}
    >
      <section className="relative w-full  overflow-hidden" ref={ref}>
        <Housr />
      </section>
      <section className="p-2">
        {store.products.filter((obj) => obj.favorito).length > 0 && (
          <Carousel
            className="w-full max-w-sm"
            plugins={[
              Autoplay({
                delay: 7000,
              }),
            ]}
          >
            <CarouselContent>
              {store.products
                .filter((obj) => obj.favorito && obj.image)
                .slice(0, 5)
                .map((obj, ind) => (
                  <CarouselItem key={ind} className="mb-6 ">
                    <div className="px-6">
                      <div className="relative bg-gray-800 overflow-hidden grid grid-cols-5 w-full h-36 md:h-48 md:h-72 rounded-2xl">
                        <div className="flex-1 p-4 text-white col-span-2"></div>
                        <div className="relative flex-1 col-span-3">
                          <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-transparent z-[1]"></div>
                          <Link
                            href={`/${store.variable}/${store.sitioweb}/products/${obj.productId}`}
                          >
                            <Image
                              src={
                                obj.image ||
                                store.urlPoster ||
                                "https://res.cloudinary.com/dbgnyc842/image/upload/v1725399957/xmlctujxukncr5eurliu.png"
                              }
                              alt={obj.title || `Producto ${ind}`}
                              className="absolute inset-0 w-full h-full object-cover object-center mb-2 "
                              width={300}
                              height={300}
                            />
                          </Link>
                        </div>
                        <div className="absolute p-4 inset-1 text-white">
                          <p className="text-sm mb-1">Especiales</p>
                          <h2 className="text-3xl font-bold mb-2">
                            {Number(obj.price).toFixed(2)}
                          </h2>
                          <p className="text-sm">{obj.title}</p>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
            </CarouselContent>
          </Carousel>
        )}
        <AllProduct sectionRefs={sectionRefs} />
      </section>
    </div>
  );
}
