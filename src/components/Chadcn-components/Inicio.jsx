"use client";
import React, { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
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
import { Store } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { provincias } from "@/components/json/Site.json";
import { ThemeContext } from "@/context/createContext";
import { usePathname, useRouter } from "next/navigation";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

export default function Inicio() {
  const router = useRouter();
  const { webshop, setwebshop } = useContext(ThemeContext);
  const supabase = createClient();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const obtenerDatos = async () => {
      await supabase
        .from("Products")
        .select("*")
        .then((respuesta) => {
          setProducts(respuesta.data);
        });
    };
    obtenerDatos();
  }, [supabase]);
  const forPronvice = organizeStoresByProvince(webshop);
  const province = Array.from(new Set(webshop.map((obj) => obj.Provincia)));
  const provinciasCoincidentes = provincias.filter((provin) =>
    province.includes(provin.nombre)
  );
  function desordenarArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Índice aleatorio
      // Intercambiar elementos
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const provinciasDesordenadas = desordenarArray(provinciasCoincidentes);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 container px-4 py-8 md:px-6">
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Nuestras ubicaciones</h2>
            <Link
              href="/provincias"
              className="text-primary hover:underline"
              prefetch={false}
            >
              Ver mas...
            </Link>
          </div>
          <Carousel
            className="rounded-lg overflow-hidden"
            plugins={[
              Autoplay({
                delay: 10000,
              }),
            ]}
          >
            <CarouselContent>
              {provinciasDesordenadas.map((obj, ind3) => (
                <CarouselItem key={ind3}>
                  <Link href={`/provincias/${obj.nombre.split(" ").join("_")}`}>
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
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Tiendas</h2>
            <Link
              href="/provincias"
              className="text-primary hover:underline"
              prefetch={false}
            >
              Ver mas...
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {webshop.slice(0, 4).map((obj, ind1) => (
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
            ))}
          </div>
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
          <div className="flex flex-col gap-4 p-4 md:w-1/3 lg:w-1/4">
            {filterRecentProducts(products).map((obj, ind) => (
              <Card key={ind} className="border-0 rounded-none shadow-none">
                <StoreComponent product={obj} store={webshop} />
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

const filterRecentProducts = (products) => {
  return products
    .sort((a, b) => new Date(b.creado) - new Date(a.creado)) // Ordenar desde el más nuevo hasta el más antiguo
    .slice(0, 20); // Ordenar desde el más nuevo hasta el más antiguo
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
    console.log(a);
    console.log(store);
    console.log(product);
    setnewStore(a);
  }, [store, product]);

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
    <>
      <CardHeader className="flex flex-row items-center p-4">
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
      <CardFooter className="grid gap-2 p-2 pb-4">
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
    </>
  );
};

const organizeStoresByProvince = (stores) => {
  return stores.reduce((result, store) => {
    if (!result[store.Provincia]) {
      result[store.Provincia] = [];
    }
    result[store.Provincia].push(store);
    return result;
  }, {});
};
function ComputerIcon(props) {
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
      <rect width="14" height="8" x="5" y="2" rx="2" />
      <rect width="20" height="8" x="2" y="14" rx="2" />
      <path d="M6 18h2" />
      <path d="M12 18h6" />
    </svg>
  );
}

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

function FileWarningIcon(props) {
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
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
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

function HomeIcon(props) {
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
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
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

function MountainIcon(props) {
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
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}

function MoveHorizontalIcon(props) {
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
      <polyline points="18 8 22 12 18 16" />
      <polyline points="6 8 2 12 6 16" />
      <line x1="2" x2="22" y1="12" y2="12" />
    </svg>
  );
}

function SearchIcon(props) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
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

function SettingsIcon(props) {
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
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
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

function UsersIcon(props) {
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
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
