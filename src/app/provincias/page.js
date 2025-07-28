"use client";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { ThemeContext } from "@/components/BoltComponent/Navbar";
import Link from "next/link";
import provinciasData from "@/components/json/Site.json";
import { logoApp } from "@/lib/image";

export default function usePage({ params }) {
  const provincias = provinciasData.provincias;
  const { webshop, setwebshop } = useContext(ThemeContext);
  const [desordenarProvince, setdesordenarProvince] = useState([]);

  useEffect(() => {
    const province1 = Array.from(
      new Set(webshop.store.map((obj) => obj.Provincia))
    );
    const provinciasCoincidentes = provincias.filter((provin) =>
      province1.includes(provin.nombre)
    );
    setdesordenarProvince(desordenarArray(provinciasCoincidentes));
  }, [webshop, provincias]);

  function desordenarArray(array) {
    return array.sort(() => Math.random() - 0.5); // Mezcla simple
  }

  return (
    <>
      <main className="w-full p-4 bg-gray-100">
        <div className="grid grid-cols-1 gap-4">
          {desordenarProvince.map((obj, ind3) => (
            <Link
              key={ind3}
              href={`/provincias/${urlSafeString(obj.nombre)}`}
              // Reemplaza cualquier caracter especial directamente con `.replace()`
            >
              <div className="relative h-[400px] md:h-[500px] bg-cover bg-center group">
                <Image
                  src={obj.image || logoApp}
                  alt={obj.nombre ? obj.nombre : "Tienda"}
                  width={1200}
                  height={500}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 md:p-8">
                  <h3 className="text-2xl md:text-3xl font-bold text-white">
                    {obj.nombre}
                  </h3>
                  <p className="line-clamp-2 overflow-hidden text-xs md:text-xl text-white">
                    {obj.descripcion}
                  </p>
                </div>
              </div>
            </Link>
          ))}
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
    .trim() // Elimina espacios al principio y al final
    .replace(/\s+/g, "_"); // Reemplaza espacios por guiones bajos
};
