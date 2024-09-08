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
import { createClient } from "@/lib/supabase";
import { provincias } from "@/components/json/Site.json";
import { ThemeContext } from "@/app/layout";
import { useRouter } from "next/navigation";
import { useToast, ToastAction } from "@/components/ui/use-toast";
import Province from "./Complementos/provinceRandom";
import { ContactUs } from "../component/contact-us";
import CarruselProvince from "./Complementos/carruselProvince";
import Category from "./Complementos/category";
import Loading from "@/components/component/loading";

const Inicio = () => {
  const { webshop } = useContext(ThemeContext);
  const supabase = createClient();
  const router = useRouter();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(webshop.products);
  }, [webshop]);

  const provincesAvailable = useMemo(() => {
    const provinceSet = Array.from(
      new Set(webshop.store.map((obj) => obj.Provincia))
    );
    return provincias.filter((prov) => provinceSet.includes(prov.nombre));
  }, [webshop.store]);

  const recentProducts = useMemo(
    () => filterRecentProducts(products),
    [products]
  );

  const shuffledComponents = useMemo(
    () => shuffleArray([CarruselProvince, Category, Province]),
    []
  );

  return webshop.loading === 100 ? (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 container px-4 py-8 md:px-6">
        <section className="mb-8">
          <Province obj={provincesAvailable} />
        </section>
        <section className="mb-8">
          <Header title="Nuevas Ofertas" href="/provincias" />
          <div className="flex flex-col gap-4 md:w-1/3 lg:w-1/4">
            {recentProducts.map((product, index) => (
              <React.Fragment key={index}>
                <StoreComponent product={product} store={webshop.store} />
                {shuffledComponents.map((Component, i) => (
                  <Component
                    key={i}
                    obj={provincesAvailable}
                    products={products}
                  />
                ))}
              </React.Fragment>
            ))}
          </div>
        </section>
        <ContactUs />
      </main>
    </div>
  ) : (
    <Loading loading={webshop.loading} />
  );
};

const Header = ({ title, href }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-2xl font-bold">{title}</h2>
    <Link href={href} className="text-primary hover:underline" prefetch={false}>
      Ver más...
    </Link>
  </div>
);
const StoreComponent = React.memo(({ product, store }) => {
  // Lógica del componente
  const { toast } = useToast();
  const [newStore, setnewStore] = useState({});
  const router = useRouter();

  useEffect(() => {
    const [a] = store.filter((str) => str.UUID == product.storeId);
    setnewStore(a);
  }, [store]);

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
    <Card className="border rounded-2x shadow-none p-4">
      <CardHeader className="flex flex-row items-center p-2">
        <Link
          href={`/${newStore.variable}/${newStore.sitioweb}`}
          className="flex items-center gap-2 text-sm font-semibold"
          prefetch={false}
        >
          <Avatar className="w-8 h-8 border">
            <AvatarImage src={newStore.urlPoster || "default-image-url"} />
            <AvatarFallback>{newStore.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            {newStore.name}
            <TimeAgo createdAt={product.creado} />
          </div>
        </Link>
      </CardHeader>
      <CardContent>
        <Link
          href={`/${newStore.variable}/${newStore.sitioweb}/products/${product.productId}`}
          prefetch={false}
        >
          <Image
            src={product.image || "default-image-url"}
            width={400}
            height={400}
            alt="Image"
            className="object-cover aspect-square"
          />
        </Link>
      </CardContent>
      <CardFooter>
        <Button
          icon
          onClick={() =>
            handleShare(product.title, product.descripcion, `product-url`)
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
