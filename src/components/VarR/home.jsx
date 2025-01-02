"use client";
import React from "react";
import { MapPin, Clock, CreditCard, Truck, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useContext, useRef } from "react";
import { MyContext } from "@/context/MyContext";
import Housr from "./Horas";
import AllProduct from "./allProduct";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
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
      className="flex flex-col items-center min-h-screen bg-gray-200"
      id={`${store.name?.replace(/\s+/g, "_")}`}
    >
      <section className="relative w-full  overflow-hidden mb-2" ref={ref}>
        <Housr />
        <section className="relative w-full p-4 mb-4">
          <div className="max-w-5xl mx-auto">
            <p className="text-center mb-4 line-clamp-3">{store?.parrrafo}</p>
            {store.Provincia &&
              store.act_tf &&
              store.domicilio &&
              store.envios.length > 0 && (
                <div className="grid grid-cols-1 gap-2">
                  {store.Provincia && (
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 flex-shrink-0" />
                      <span className="text-xs">{`${
                        store.direccion ? `${store.direccion}, ` : ""
                      }${store.municipio ? `${store.municipio}, ` : ""}${
                        store.Provincia
                      }`}</span>
                    </div>
                  )}
                  {store.act_tf && (
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2 flex-shrink-0" />
                      <span className="text-xs">
                        Aceptamos pagos por transferencia
                      </span>
                    </div>
                  )}
                  {store.domicilio && store.envios.length > 0 && (
                    <div className="flex items-center">
                      <Truck className="h-5 w-5 mr-2 flex-shrink-0" />
                      <div className="text-xs flex">
                        <span className="mr-1">Entregas: </span>
                        <Carousel plugins={carruselPlugins1}>
                          <CarouselContent>
                            {store.envios.map((obj, ind) => (
                              <CarouselItem
                                key={ind}
                                className="basis-auto text-center border-b"
                              >
                                {obj.nombre}
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                        </Carousel>
                      </div>
                    </div>
                  )}
                </div>
              )}
          </div>
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
                            href={`/t/${store.sitioweb}/products/${obj.productId}`}
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
