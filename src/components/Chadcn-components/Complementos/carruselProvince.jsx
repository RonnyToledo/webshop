"use client";
import React, { useContext, useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { ThemeContext } from "@/app/layout";
import Image from "next/image";
import Link from "next/link";
import { CircleArrowRight } from "lucide-react";

export default function CarruselProvince() {
  const { webshop, setwebshop } = useContext(ThemeContext);
  const [forPronvice, setforPronvice] = useState([]);
  useEffect(() => {
    setforPronvice(organizeStoresByProvince(webshop.store));
  }, [webshop]);

  return (
    <div
      className="flex items-center justify-between mb-4"
      id="carruselProvince"
    >
      {forPronvice.slice(0, 1).map((obj, ind) => (
        <div key={ind} className="w-full">
          <div className="flex items-center">
            <div>
              <h2 className="text-xl font-bold">Descubirir negocios en </h2>
              <Link
                className="text-xl font-bold"
                href={`/provincias/${String(obj.nombre)
                  .split(" ")
                  .join("_")
                  .split("ü")
                  .join("u")}`}
                prefetch={false}
              >
                {obj.nombre}
              </Link>
            </div>
          </div>

          <Carousel
            className="rounded-lg overflow-hidden"
            plugins={[
              Autoplay({
                delay: 10000,
              }),
            ]}
          >
            <CarouselContent>
              {desordenarArray(obj.store)
                .slice(0, 5)
                .map((obj1, ind1) => (
                  <div
                    key={ind1}
                    className=" relative w-[200px] h-[300px] md:h-[300px] bg-cover bg-center rounded-lg overflow-hidden"
                  >
                    <Link
                      key={ind1}
                      href={`/${obj1.variable}/${obj1.sitioweb}`}
                      className="group"
                      prefetch={false}
                    >
                      <Image
                        src={
                          obj1.urlPoster
                            ? obj1.urlPoster
                            : "https://res.cloudinary.com/dbgnyc842/image/upload/v1721753647/kiphxzqvoa66wisrc1qf.jpg"
                        }
                        alt={
                          obj1.name
                            ? obj1.name
                            : "https://res.cloudinary.com/dbgnyc842/image/upload/v1721753647/kiphxzqvoa66wisrc1qf.jpg"
                        }
                        width={200}
                        height={300}
                        className="object-cover  w-full h-full group-hover:scale-105 transition-transform block"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 md:p-8">
                        <h3 className="text-2xl md:text-3xl font-bold text-white">
                          {obj1.name}
                        </h3>
                        <p className="line-clamp-2 overflow-hidden text-xs md:text-xl text-white">
                          {obj1.parrrafo}
                        </p>
                      </div>
                    </Link>
                  </div>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <Link
            href={`/provincias/${String(obj.nombre)
              .split(" ")
              .join("_")
              .split("ü")
              .join("u")}`}
            className="text-primary  hover:animate-pulse font-bold  p-4 flex items-center "
            prefetch={false}
          >
            Ver en {obj.nombre} <CircleArrowRight className=" ml-2 h-6 w-6" />
          </Link>
        </div>
      ))}
    </div>
  );
}
const organizeStoresByProvince = (stores) => {
  let aux = [];
  let i = 0;
  return stores.reduce((result, store) => {
    if (!aux[store.Provincia]) {
      result[i] = { store: [], nombre: store.Provincia };
      result[i].store.push({ ...store });
      aux[store.Provincia] = { posicion: i };
      i++;
    } else {
      result[aux[store.Provincia]?.posicion].store.push({ ...store });
    }

    return desordenarArray(result);
  }, []);
};
function desordenarArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Índice aleatorio
    // Intercambiar elementos
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
