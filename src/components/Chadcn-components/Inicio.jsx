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

  const recentProducts = useMemo(
    () => filterRecentProducts(products),
    [products]
  );

  const shuffledComponents = useMemo(
    () => shuffleArray([CarruselProvince, Category, Province]),
    []
  );

  return webshop.loading === 100 ? (
    <div className="flex flex-col mb-8 min-h-screen bg-background">
      <main className="">
        <Hero />

        <section className="mb-8">
          <Categories />
          <Stores />
          <CategoryProducts />
          <FeaturedProducts />
          <ProvinceStores />
        </section>
        <ContactUs />
      </main>
    </div>
  ) : (
    <Loading loading={webshop.loading} />
  );
};

const StoreComponent = React.memo(({ product, store }) => {
  // Lógica del componente
  const { toast } = useToast();
  const [newStore, setnewStore] = useState({});
  const router = useRouter();

  useEffect(() => {
    const [a] = store.filter((str) => str.UUID == product.storeId);
    setnewStore(a);
  }, [store, product.storeId]);

  const handleShare = async (title, descripcion, url) => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: descripcion, url });
      } catch (error) {
        toast({ title: "Error al compartir", description: error.toString() });
      }
    } else {
      toast({
        title: "No disponible",
        description:
          "La API de compartir no está disponible en este navegador.",
      });
    }
  };

  return (
    <Card className="flex flex-col max-w-max justify-center border rounded-2x shadow-none p-4">
      <CardHeader className="max-w-max flex flex-row items-center p-2">
        <Link
          href={`/${newStore.variable}/${newStore.sitioweb}`}
          className="flex items-center gap-2 text-sm font-semibold"
          prefetch={false}
        >
          <Avatar className="w-8 h-8 border">
            <AvatarImage
              src={
                newStore.urlPoster ||
                "https://res.cloudinary.com/dbgnyc842/image/upload/v1725399957/xmlctujxukncr5eurliu.png"
              }
            />
            <AvatarFallback>{newStore.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            {newStore.name}
            <relative-time
              lang="es"
              datetime={product.creado}
              no-title
            ></relative-time>
          </div>
        </Link>
      </CardHeader>
      <CardContent className="max-w-max ">
        <Link
          href={`/${newStore.variable}/${newStore.sitioweb}/products/${product.productId}`}
          prefetch={false}
          className="max-w-max"
        >
          <Image
            src={
              product.image ||
              "https://res.cloudinary.com/dbgnyc842/image/upload/v1725399957/xmlctujxukncr5eurliu.png"
            }
            width={400}
            height={400}
            alt="Image"
            className="object-cover aspect-square"
          />
        </Link>
      </CardContent>
      <CardFooter className="max-w-max ">
        <Button
          icon
          onClick={() =>
            handleShare(
              product.title,
              product.descripcion,
              `/${newStore.variable}/${newStore.sitioweb}/products/${product.productId}`
            )
          }
        >
          Compartir
        </Button>
      </CardFooter>
    </Card>
  );
});

// Asignar displayName
StoreComponent.displayName = "StoreComponent";

const filterRecentProducts = (products) =>
  products.sort((a, b) => new Date(b.creado) - new Date(a.creado)).slice(0, 10);

const TimeAgo = ({ createdAt }) => {
  const diffInMinutes = Math.floor((Date.now() - new Date(createdAt)) / 60000);
  return diffInMinutes < 60
    ? `${diffInMinutes}m`
    : `${Math.floor(diffInMinutes / 60)}h`;
};

const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

export default Inicio;
