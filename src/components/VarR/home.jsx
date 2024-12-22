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
import { BannerTiendaInactiva } from "../banner-tienda-inactiva";
import DeliveryDiningRoundedIcon from "@mui/icons-material/DeliveryDiningRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import FmdGoodRoundedIcon from "@mui/icons-material/FmdGoodRounded";
import NearMeRoundedIcon from "@mui/icons-material/NearMeRounded";

const carruselPlugins = [
  Autoplay({
    delay: 7000,
  }),
];
const carruselPlugins1 = [
  Autoplay({
    delay: 2000,
  }),
];
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
          {store.Provincia &&
            store.act_tf &&
            store.domicilio &&
            store.envios.length > 0 && (
              <Card className=" px-6 py-2 bg-gray-200 rounded-t-2xl">
                <div className="space-y-4">
                  <div className="grid grid-cols-6 grid-flow-row-dense">
                    <div className="w-full col-span-4">
                      {store.Provincia && (
                        <Badge className="w-full">
                          <FmdGoodRoundedIcon className="h-4 w-4" />{" "}
                          {`${store.municipio ? `${store.municipio}-` : ""}${
                            store.Provincia
                          }`}
                        </Badge>
                      )}
                    </div>
                    <div className="w-full col-span-3">
                      {store.act_tf && (
                        <Badge className="w-full">
                          <CreditCardRoundedIcon className="h-4 w-4" />{" "}
                          Transferencia
                        </Badge>
                      )}
                    </div>
                    <div className="col-span-3">
                      {store.domicilio && (
                        <Badge className="w-full mr-4">
                          <DeliveryDiningRoundedIcon className="h-4 w-4" />{" "}
                          Domicilio
                        </Badge>
                      )}
                    </div>
                    <div className="col-span-6">
                      {store.domicilio && store.envios.length > 0 && (
                        <Badge className="w-full grid grid-cols-6">
                          <NearMeRoundedIcon className="h-4 w-4" />
                          <span className="col-span-2">Envíos en: </span>
                          <Carousel
                            className="col-span-3"
                            plugins={carruselPlugins1}
                          >
                            <CarouselContent>
                              {store.envios.map((obj, ind) => (
                                <CarouselItem key={ind} className="text-center">
                                  {obj.nombre}
                                </CarouselItem>
                              ))}
                            </CarouselContent>
                          </Carousel>
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            )}
        </section>
      </section>
      {store.active ? (
        <section className="p-2">
          {store.products.filter((obj) => obj.favorito).length > 0 && (
            <div className="w-full bg-white rounded-xl p-4 ">
              <div className="p-1 text-xl font-bold font-serif">
                Especialidades
              </div>
              <Carousel plugins={carruselPlugins}>
                <CarouselContent>
                  {store.products
                    .filter((obj) => obj.favorito && obj.image)
                    .slice(0, 5)
                    .map((obj, ind) => (
                      <CarouselItem key={ind} className=" basis-2/5">
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
                          <div className="absolute pointer-events-none inset-0 flex flex-col justify-end text-white w-full h-full top-0 z-[1]  bg-gradient-to-t from-black/80 to-transparent rounded-xl">
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
