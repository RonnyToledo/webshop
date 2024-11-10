"use client";
import React, { useState, useEffect, useContext, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import provinciasData from "@/components/json/Site.json";
import { ThemeContext } from "@/app/layout";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import Province from "./Complementos/provinceRandom";
import { ContactUs } from "./contact-us";
import CarruselProvince from "./Complementos/carruselProvince";
import Category from "./Complementos/category";
import Loading from "@/components/Chadcn-components/loading";
import "@github/relative-time-element";
import Hero from "../BoltComponent/Hero";
import Categories from "../BoltComponent/Categories";
import CategoryProducts from "../BoltComponent/CategoryProducts";
import FeaturedProducts from "../BoltComponent/FeaturedProducts";
import ProvinceStores from "../BoltComponent/ProvinceStores";
import Stores from "../BoltComponent/Stores";
import UltimateProducts from "../BoltComponent/UltimateProducst";

const Inicio = () => {
  const { webshop } = useContext(ThemeContext);
  const [products, setProducts] = useState([]);
  const provincias = provinciasData.provincias;

  useEffect(() => {
    setProducts(webshop.products);
  }, [webshop]);

  const provincesAvailable = useMemo(() => {
    const provinceSet = Array.from(
      new Set(webshop.store.map((obj) => obj.Provincia))
    );
    return provincias.filter((prov) => provinceSet.includes(prov.nombre));
  }, [webshop.store, provincias]);

  return webshop.loading === 100 ? (
    <div className="flex flex-col mb-8 min-h-screen bg-background">
      <main className="">
        <Hero />
        <section className="mb-8">
          <CategoryProducts />
          <UltimateProducts />
          <Stores />
          <CategoryProducts />
          <FeaturedProducts />
          <CategoryProducts />
          <ProvinceStores />
          <CategoryProducts />
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
