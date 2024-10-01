"use client";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { ThemeContext } from "@/app/layout";
import { createClient } from "@/lib/supabase";
import Link from "next/link";
import provinciasData from "@/components/json/Site.json";

export default function usePage({ params }) {
  const provincias = provinciasData.provincias;
  const supabase = createClient();
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
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Índice aleatorio
      // Intercambiar elementos
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  return (
    <>
      <main className="w-full p-4 bg-gray-100">
        <div className="grid grid-cols-1 gap-4">
          {desordenarProvince.map((obj, ind3) => (
            <Link
              key={ind3}
              ü
              href={`/provincias/${String(obj.nombre)
                .split(" ")
                .join("_")
                .split("ü")
                .join("u")}`}
            >
              <div className="relative h-[400px] md:h-[500px] bg-cover bg-center group">
                <Image
                  src={
                    obj.image
                      ? obj.image
                      : "https://res.cloudinary.com/dbgnyc842/image/upload/v1721753647/kiphxzqvoa66wisrc1qf.jpg"
                  }
                  alt={
                    obj.nombre
                      ? obj.nombre
                      : "https://res.cloudinary.com/dbgnyc842/image/upload/v1721753647/kiphxzqvoa66wisrc1qf.jpg"
                  }
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
