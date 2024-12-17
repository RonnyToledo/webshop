"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ThemeContext } from "@/app/layout";

export default function Province({ obj }) {
  const d = desordenarArray(obj);
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mt-4">
        <h2 className="text-2xl font-bold">Descubrir</h2>
        <Link
          href="/provincias"
          className="text-primary hover:underline"
          prefetch={false}
        >
          Ver mas...
        </Link>
      </div>
      {d.slice(0, 1).map((obj, ind) => (
        <Link
          href={`/provincias/${String(obj.nombre)
            .split(" ")
            .join("_")
            .split("ü")
            .join("u")}`}
          id="provinceRandom"
          className="  rounded-2xl"
          key={ind}
        >
          <div className="relative  h-[400px] md:h-[500px] bg-cover bg-center group rounded-2xl">
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
              className="object-cover w-full h-full  rounded-2xl"
            />
            <div className="rounded-2xl absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 md:p-8">
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
  );
}
function desordenarArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Índice aleatorio
    // Intercambiar elementos
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
