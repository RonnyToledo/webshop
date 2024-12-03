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
import { Clock, MapPin, Star } from "lucide-react";
import { BannerTiendaInactiva } from "../banner-tienda-inactiva";

export function Home() {
  const { store, dispatchStore } = useContext(MyContext);
  const sectionRefs = useRef([]);
  const ref = useRef();

  return (
    <div
      className="flex flex-col items-center min-h-screen md:px-4 bg-gray-100"
      id={`${store.name?.replace(/\s+/g, "_")}`}
    >
      <section className="relative w-full  overflow-hidden" ref={ref}>
        <Housr />
        <section className="relative w-full overflow-hidden bg-white">
          <Card className=" bottom-8 left-4 right-4 md:bottom-12 md:left-8 md:right-auto md:w-[450px] px-6 py-2 bg-white/95 backdrop-blur">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {store.parrrafo}
              </p>
              <p className="text-sm text-muted-foreground">
                {store.Provincia &&
                  `Radicamos en ${
                    store.municipio ? `${store.municipio}-` : ""
                  }${store.Provincia}`}
                <br />
                {store.domicilio &&
                  `Hacemos envios a en ${store.envios.map(
                    (obj) => `${obj.nombre}`
                  )}`}
              </p>

              <div>
                {store.domicilio && <Badge>Domicilio</Badge>}
                {store.act_tf && <Badge>Transferencia</Badge>}
              </div>
            </div>
          </Card>
        </section>
      </section>
      {store.active ? (
        <section className="p-2">
          {store.products.filter((obj) => obj.favorito).length > 0 && (
            <Carousel
              className="w-full"
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
                          <div className="absolute p-4 inset-1 text-white z-[4]">
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
      ) : (
        <div className="px-6 py-10">
          <BannerTiendaInactiva />
        </div>
      )}
    </div>
  );
}
