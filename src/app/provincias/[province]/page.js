"use client";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { ThemeContext } from "@/context/createContext";
import { provincias } from "@/components/json/Site.json";
import { createClient } from "@/lib/supabase";
import Link from "next/link";

export default function usePage({ params }) {
  const supabase = createClient();
  const { webshop, setwebshop } = useContext(ThemeContext);
  const [province, setprovince] = useState({});

  useEffect(() => {
    const obtenerDatos = async () => {
      await supabase
        .from("Sitios")
        .select("*")
        .then((res) => {
          const a = res.data.map((obj) => {
            return { ...obj, categoria: JSON.parse(obj.categoria) };
          });
          const province1 = Array.from(new Set(a.map((obj) => obj.Provincia)));
          const [b] = provincias
            .filter((provin) => province1.includes(provin.nombre))
            .filter(
              (obj) =>
                obj.nombre ==
                (params.province == "Camaguey"
                  ? params.province.split("_").join(" ").split("u").join("ü")
                  : params.province.split("_").join(" "))
            );
          setprovince(b);
          supabase
            .from("Products")
            .select("*")
            .then((respuesta) => {
              setwebshop({ ...webshop, store: a, products: respuesta.data });
            });
        });
    };
    obtenerDatos();
  }, [supabase]);

  return (
    <>
      <div className="w-full relative h-[500px] bg-cover bg-center group">
        <Image
          alt={province.nombre ? province.nombre : "Store"}
          className="w-full h-[500px] object-cover"
          height={500}
          src={
            province.image
              ? province.image
              : "https://res.cloudinary.com/dbgnyc842/image/upload/v1721753647/kiphxzqvoa66wisrc1qf.jpg"
          }
          style={{
            aspectRatio: "1920/400",
            objectFit: "cover",
          }}
          width={1920}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 md:p-8">
          <h3 className="text-2xl md:text-3xl font-bold text-white">
            {province.nombre}
          </h3>
          <p className="text-xs md:text-xl text-white">
            {province.descripcion}
          </p>
        </div>
      </div>
      <main className="w-full p-4 bg-gray-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {webshop.map(
            (obj, ind1) =>
              obj.Provincia == province.nombre && (
                <Link
                  key={ind1}
                  href={`/${obj.variable}/${obj.sitioweb}`}
                  className="group"
                  prefetch={false}
                >
                  <div className="relative h-[300px] md:h-[200px] bg-cover bg-center rounded-lg overflow-hidden">
                    <Image
                      src={
                        obj.urlPoster
                          ? obj.urlPoster
                          : "https://res.cloudinary.com/dbgnyc842/image/upload/v1721753647/kiphxzqvoa66wisrc1qf.jpg"
                      }
                      alt={
                        obj.name
                          ? obj.name
                          : "https://res.cloudinary.com/dbgnyc842/image/upload/v1721753647/kiphxzqvoa66wisrc1qf.jpg"
                      }
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
