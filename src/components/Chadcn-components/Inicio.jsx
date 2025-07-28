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
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { logoApp } from "@/lib/image";

const Inicio = () => {
  const { webshop, setwebshop } = useContext(ThemeContext);
  const [products, setProducts] = useState([]);
  const [OrderStore, setOrderStore] = useState([]);
  const [provincesAvailable, setProvincesAvailable] = useState([]);
  const provincias = provinciasData.provincias;

  useEffect(() => {
    async function SearchApi() {
      let provinceSet;
      if (!webshop.api) {
        const response = await fetch("/api/GA");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setwebshop((prev) => ({ ...prev, api: result }));
        setOrderStore(organizarTiendas(webshop.store, result));
        setProvincesAvailable(
          filtrarYOrdenarProvincias(
            provincias,
            webshop.store.map((obj) => ({
              ...obj,
              visitas: result[obj.sitioweb],
            }))
          )
        );
      } else {
        setProvincesAvailable(
          filtrarYOrdenarProvincias(
            provincias,
            webshop.store.map((obj) => ({
              ...obj,
              visitas: webshop.api[obj.sitioweb],
            }))
          )
        );
      }

      setProducts(webshop.products);
    }
    SearchApi();
  }, [setwebshop, webshop.products, webshop.store, webshop.api, provincias]);

  return webshop.loading === 100 ? (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="">
        <AnimatePresence>
          {webshop.api && (
            <motion.div
              className="p-4"
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ duration: 0.4 }}
            >
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
                      <Link href={`/t/${business?.sitioweb}`}>
                        <div className="w-[140px] h-[140px] rounded-full overflow-hidden border">
                          <Image
                            src={business.urlPoster || logoApp}
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
            </motion.div>
          )}
        </AnimatePresence>

        <section className="mb-8">
          <Province obj={provincesAvailable[0]} />
          <Category products={webshop.products} />
          <UltimateProducts />
          <CategoryProducts />
          <Stores />
          <FeaturedProducts />
          <Province obj={provincesAvailable[1]} />

          <ProvinceStores />
        </section>
        <ContactUs />
      </main>
    </div>
  ) : (
    <Loading loading={webshop.loading} />
  );
};

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
const filtrarYOrdenarProvincias = (provincias, tiendas) => {
  // Crear un objeto para acumular visitas por provincia
  const visitasPorProvincia = tiendas.reduce((acc, tienda) => {
    acc[tienda.Provincia] =
      (acc[tienda.Provincia] || 0) + tienda.visitas?.totalSessions;
    return acc;
  }, {});
  // Filtrar provincias que tienen tiendas
  const provinciasConTiendas = provincias.filter(
    (provincia) => visitasPorProvincia[provincia.nombre]
  );

  // Ordenar provincias según la cantidad de visitas (descendente)
  return provinciasConTiendas.sort(
    (a, b) => visitasPorProvincia[b.nombre] - visitasPorProvincia[a.nombre]
  );
};
