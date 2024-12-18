"use client";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { ThemeContext } from "@/components/BoltComponent/Navbar";
import provinciasData from "@/components/json/Site.json";
import Link from "next/link";

export default function usePage({ params }) {
  const provincias = provinciasData.provincias;
  const { webshop, setwebshop } = useContext(ThemeContext);
  const [province, setprovince] = useState({});

  useEffect(() => {
    console.log(
      params.province.split("_").join(" "),
      Array.from(new Set(webshop.store.map((obj) => obj.Provincia)))
    );
    const province1 = Array.from(
      new Set(webshop.store.map((obj) => obj.Provincia))
    );
    console.log(
      provincias.filter((provin) => province1.includes(provin.nombre))
    );
    const b = provincias
      .filter((provin) => province1.includes(provin.nombre))
      .find(
        (obj) =>
          urlSafeString(obj.nombre) == params.province.split("_").join(" ")
      );
    setprovince(b);
  }, [webshop.store, params.province, provincias]);

  return (
    <>
      <div className="w-full relative h-[500px] bg-cover bg-center group">
        <Image
          alt={province?.nombre || "Store"}
          className="w-full h-[500px] object-cover"
          height={500}
          src={
            province?.image ||
            "https://res.cloudinary.com/dbgnyc842/image/upload/v1725399957/xmlctujxukncr5eurliu.png"
          }
          style={{
            aspectRatio: "1920/400",
            objectFit: "cover",
          }}
          width={1920}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 md:p-8">
          <h3 className="text-2xl md:text-3xl font-bold text-white">
            {province?.nombre}
          </h3>
          <p className="text-xs md:text-xl text-white">
            {province?.descripcion}
          </p>
        </div>
      </div>
      <main className="w-full p-4 bg-gray-100">
        <div className="grid grid-cols-2  gap-4">
          {webshop.store.map(
            (obj, ind1) =>
              obj.Provincia == province?.nombre && (
                <Link
                  key={ind1}
                  href={`/${obj.variable}/${obj.sitioweb}`}
                  className="group"
                  prefetch={false}
                >
                  <div className="relative h-[300px] md:h-[200px] bg-cover bg-center rounded-lg overflow-hidden">
                    <Image
                      src={
                        obj.urlPoster ||
                        "https://res.cloudinary.com/dbgnyc842/image/upload/v1725399957/xmlctujxukncr5eurliu.png"
                      }
                      alt={obj.name || "Name"}
                      width={300}
                      height={500}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                      <h3 className="text-lg md:text-xl font-bold text-white">
                        {obj.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              )
          )}
        </div>
      </main>
    </>
  );
}
const urlSafeString = (str) => {
  return str
    .normalize("NFD") // Divide caracteres con acento y sus componentes
    .replace(/[\u0300-\u036f]/g, "") // Remueve los acentos
    .replace(/[^a-zA-Z0-9 ]/g, "") // Elimina caracteres especiales excepto letras, números y espacios
    .trim(); // Elimina espacios al principio y al final
};
