"use client";
import React, { useState, useEffect, useContext, useMemo } from "react";
import provinciasData from "@/components/json/Site.json";
import { ThemeContext } from "@/components/BoltComponent/Navbar";
import { ContactUs } from "./contact-us";
import Category from "./Complementos/category";
import Loading from "@/components/Chadcn-components/loading";
import "@github/relative-time-element";
import Hero from "../BoltComponent/Hero";
import CategoryProducts from "../BoltComponent/CategoryProducts";
import FeaturedProducts from "../BoltComponent/FeaturedProducts";
import ProvinceStores from "../BoltComponent/ProvinceStores";
import Stores from "../BoltComponent/Stores";
import UltimateProducts from "../BoltComponent/UltimateProducst";
import Province from "./Complementos/provinceRandom";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

const Inicio = () => {
  const { webshop } = useContext(ThemeContext);
  const [products, setProducts] = useState([]);
  const [OrderStore, setOrderStore] = useState([]);
  const provincias = provinciasData.provincias;

  useEffect(() => {
    setProducts(webshop.products);
    setOrderStore(organizarTiendas(webshop.store, webshop.api));
  }, [webshop]);

  const provincesAvailable = useMemo(() => {
    const provinceSet = Array.from(
      new Set(webshop.store.map((obj) => obj.Provincia))
    );
    return provincias.filter((prov) => provinceSet.includes(prov.nombre));
  }, [webshop.store, provincias]);

  return webshop.loading === 100 ? (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="">
        <div className="p-4">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Negocios en Tendencia</h2>
          </div>
          <div className="relative">
            <div className="flex overflow-x-auto gap-4 no-scrollbar">
              {OrderStore.map((business) => (
                <div
                  key={business.id}
                  className="min-w-[140px] flex flex-col items-center gap-2"
                >
                  <Link href={`/${business?.variable}/${business?.sitioweb}`}>
                    <div className="w-[140px] h-[140px] rounded-full overflow-hidden border">
                      <Image
                        src={
                          business.urlPoster ||
                          "https://res.cloudinary.com/dbgnyc842/image/upload/v1725399957/xmlctujxukncr5eurliu.png"
                        }
                        alt={business.name}
                        width={140}
                        height={140}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm font-medium text-center">
                      {business.name}
                    </span>
                  </Link>
                </div>
              ))}
            </div>
            <div className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-white via-white/50 to-transparent w-12 pointer-events-none flex items-center justify-end"></div>
          </div>
        </div>

        <section className="mb-8">
          <Province obj={provincesAvailable} />
          <Category products={webshop.products} />
          <CategoryProducts />
          <UltimateProducts />
          <Stores />
          <FeaturedProducts />
          <Province obj={provincesAvailable} />

          <ProvinceStores />
        </section>
        <ContactUs />
      </main>
    </div>
  ) : (
    <Loading loading={webshop.loading} />
  );
};

const TimeAgo = ({ createdAt }) => {
  const diffInMinutes = Math.floor((Date.now() - new Date(createdAt)) / 60000);
  return diffInMinutes < 60
    ? `${diffInMinutes}m`
    : `${Math.floor(diffInMinutes / 60)}h`;
};

const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

export default Inicio;

function organizarTiendas(tiendas, sessionesPorTienda) {
  // Organizar las tiendas y agregar sesiones
  const tiendasOrganizadas = tiendas.map((tienda) => {
    const nombreTienda = tienda.sitioweb;
    const sesiones = sessionesPorTienda[nombreTienda];

    return {
      ...tienda,
      totalSessions: sesiones ? sesiones.totalSessions : 0,
      products: sesiones ? sesiones.products : {},
    };
  });

  // Ordenar las tiendas por totalSessions en orden descendente
  return tiendasOrganizadas

    .sort((a, b) => b.totalSessions - a.totalSessions)
    .slice(0, 5);
}
