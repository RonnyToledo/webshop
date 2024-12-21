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
import DeliveryDiningRoundedIcon from "@mui/icons-material/DeliveryDiningRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";

export function Home() {
  const { store, dispatchStore } = useContext(MyContext);
  const sectionRefs = useRef([]);
  const ref = useRef();

  return (
    <div
      className="flex flex-col items-center min-h-screen md:px-4 bg-gray-200"
      id={`${store.name?.replace(/\s+/g, "_")}`}
    >
      <section className="relative w-full  overflow-hidden mb-2" ref={ref}>
        <Housr />
        <section className="relative w-full px-2 ">
          <Card className=" px-6 py-2 bg-white rounded-t-2xl">
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
                  `Hacemos envios en ${store.envios.map(
                    (obj) => ` ${obj.nombre}`
                  )}`}
              </p>

              <div>
                {store.domicilio && (
                  <Badge className="mr-2">
                    <DeliveryDiningRoundedIcon className="h-4 w-4" /> Domicilio
                  </Badge>
                )}
                {store.act_tf && (
                  <Badge>
                    <CreditCardRoundedIcon className="h-4 w-4" /> Transferencia
                  </Badge>
                )}
              </div>
            </div>
          </Card>
        </section>
      </section>
      {store.active ? (
        <section className="p-2">
          {store.products.filter((obj) => obj.favorito).length > 0 && (
            <div className="w-full bg-white rounded-xl p-4 ">
              <div className="p-1 text-xl font-bold font-serif">
                Especialidades
              </div>
              <Carousel
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
                      <CarouselItem key={ind} className="mb-6  basis-2/5">
                        <div className="relative ">
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
                              className="w-full aspect-[3/4] object-cover object-center mb-2 rounded-xl"
                              width={300}
                              height={300}
                            />
                          </Link>
                          <div className="absolute inset-0 flex flex-col justify-end text-white w-full h-full top-0 z-[1]  bg-gradient-to-t from-black/80 to-transparent rounded-xl">
                            <div className="p-4 inset-1 text-white z-[4]">
                              <h2 className="text-base md:text-2xl font-bold mb-2">
                                ${Number(obj.price).toFixed(2)}
                              </h2>
                              <p className="text-xs md:text-sm line-clamp-1">
                                {obj.title}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                </CarouselContent>
              </Carousel>
            </div>
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
