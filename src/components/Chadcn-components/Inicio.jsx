"use client";
import React, { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { createClient } from "@/lib/supabase";
import { provincias } from "@/components/json/Site.json";
import { ThemeContext } from "@/app/layout";
import { useRouter } from "next/navigation";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import Province from "./Complementos/provinceRandom";
import { ContactUs } from "../component/contact-us";
import CarruselProvince from "./Complementos/carruselProvince";
import Category from "./Complementos/category";
import Loading from "@/components/component/loading";

export default function Inicio() {
  const router = useRouter();
  const { webshop, setwebshop } = useContext(ThemeContext);
  const supabase = createClient();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(webshop.products);
  }, [webshop]);

  const province = Array.from(
    new Set(webshop.store.map((obj) => obj.Provincia))
  );
  const provinciasCoincidentes = provincias.filter((provin) =>
    province.includes(provin.nombre)
  );

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  return (
    <>
      {webshop.loading == 100 ? (
        <div className="flex flex-col min-h-screen bg-background">
          <main className="flex-1 container px-4 py-8 md:px-6">
            <section className="mb-8">
              <Province obj={provinciasCoincidentes} />
            </section>
            <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Nuevas Ofertas</h2>
                <Link
                  href="/provincias"
                  className="text-primary hover:underline"
                  prefetch={false}
                >
                  Ver mas..
                </Link>
              </div>
              <div className="flex flex-col gap-4 md:w-1/3 lg:w-1/4">
                {filterRecentProducts(products).map((obj, ind) => {
                  const componentesAleatorios = [
                    <CarruselProvince key="comp1" />,
                    <Category key="comp3" products={products} />,
                    <Province key={ind} obj={provinciasCoincidentes} />,
                  ];
                  const componentesShuffleados = shuffleArray([
                    ...componentesAleatorios,
                  ]);
                  return (
                    <React.Fragment key={ind}>
                      <StoreComponent product={obj} store={webshop.store} />
                      {componentesShuffleados}
                    </React.Fragment>
                  );
                })}
              </div>
            </section>
            <ContactUs />
          </main>
        </div>
      ) : (
        <Loading loading={webshop.loading} />
      )}
    </>
  );
}

const filterRecentProducts = (products) => {
  return products
    .sort((a, b) => new Date(b.creado) - new Date(a.creado)) // Ordenar desde el más nuevo hasta el más antiguo
    .slice(0, 5); // Ordenar desde el más nuevo hasta el más antiguo
};
const TimeAgo = ({ createdAt }) => {
  const now = new Date();
  const created = new Date(createdAt);
  const diffInMinutes = Math.floor((now - created) / 60000);

  if (diffInMinutes < 60) {
    return (
      <span className="text-xs">{`${diffInMinutes} minuto${
        diffInMinutes !== 1 ? "s" : ""
      }`}</span>
    );
  } else if (diffInMinutes < 1440) {
    const diffInHours = Math.floor(diffInMinutes / 60);
    return (
      <span className="text-xs">{`${diffInHours} hora${
        diffInHours !== 1 ? "s" : ""
      }`}</span>
    );
  } else {
    const diffInDays = Math.floor(diffInMinutes / 1440);
    return (
      <span className="text-xs">{`${diffInDays} día${
        diffInDays !== 1 ? "s" : ""
      }`}</span>
    );
  }
};

// Componente principal que utiliza la función
const StoreComponent = ({ product, store }) => {
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
        await navigator.share({
          title: title,
          text: descripcion,
          url: url,
        });
      } catch (error) {
        toast({
          title: "Informacion",
          description: `Error al compartir: ${error}`,
          action: (
            <ToastAction altText="Goto schedule to undo">Cerrar</ToastAction>
          ),
        });
      }
    } else {
      // Fallback para navegadores que no soportan la API de compartir
      toast({
        title: "Informacion",
        description:
          "La API de compartir no está disponible en este navegador.",
        action: (
          <ToastAction altText="Goto schedule to undo">Cerrar</ToastAction>
        ),
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
            <AvatarImage
              src={
                newStore.urlPoster
                  ? newStore.urlPoster
                  : "https://res.cloudinary.com/dbgnyc842/image/upload/v1721753647/kiphxzqvoa66wisrc1qf.jpg"
              }
            />
            <AvatarFallback>{String(newStore.name).charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            {newStore.name}
            <TimeAgo createdAt={product.creado} />
          </div>
        </Link>
        {/* <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 ml-auto rounded-full"
          >
            <MoveHorizontalIcon className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <BookmarkIcon className="w-4 h-4 mr-2" />
            Guardar
          </DropdownMenuItem>
          <DropdownMenuItem>
            <StarIcon className="w-4 h-4 mr-2" />
            Agregar a favoritos
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <FileWarningIcon className="w-4 h-4 mr-2" />
            Reportar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu> */}
      </CardHeader>
      <CardContent className="p-0">
        <Link
          href={`/${newStore.variable}/${newStore.sitioweb}/products/${product.productId}`}
          className="text-primary hover:underline font-medium"
          prefetch={false}
        >
          {product.title}

          <Image
            src={
              product.image
                ? product.image
                : "https://res.cloudinary.com/dbgnyc842/image/upload/v1721753647/kiphxzqvoa66wisrc1qf.jpg"
            }
            width={400}
            height={400}
            alt="Image"
            className="object-cover aspect-square"
          />
        </Link>
      </CardContent>
      <CardFooter className="px-0 py-2 grid gap-2">
        <div className="flex items-center w-full">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              router.push(
                `/${newStore.variable}/${newStore.sitioweb}/products/${product.productId}`
              )
            }
          >
            <HeartIcon className="w-4 h-4" />
            <span className="sr-only">Me gusta</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              router.push(`/${newStore.variable}/${newStore.sitioweb}/about`)
            }
          >
            <MessageCircleIcon className="w-4 h-4" />
            <span className="sr-only">Comentar</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              handleShare(
                products.title,
                products.descripcion,
                `https://rh-menu.vercel.app/${newStore.variable}/${newStore.sitioweb}/products/${product.productId}`
              )
            }
          >
            <SendIcon className="w-4 h-4" />
            <span className="sr-only">Compartir</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto"
            onClick={() =>
              router.push(`/${newStore.variable}/${newStore.sitioweb}/`)
            }
          >
            <BookmarkIcon className="w-4 h-4" />
            <span className="sr-only">Guardar</span>
          </Button>
        </div>
        <div className="px-2 text-sm w-full grid gap-1.5">
          <p className="line-clamp-2 overflow-hidden text-xs md:text-xl text-white">
            {product.descripcion}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

function BookmarkIcon(props) {
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
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
  );
}

function HeartIcon(props) {
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
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function MessageCircleIcon(props) {
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
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}

function SendIcon(props) {
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
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}
