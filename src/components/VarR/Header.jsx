"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState, useContext } from "react";
import { supabase } from "@/lib/supa";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingCartIcon,
  ShoppingCart,
  LayoutGrid,
  Search,
  ArrowLeft,
} from "lucide-react";
import {
  SheetTrigger,
  SheetContent,
  Sheet,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { MyContext } from "@/context/MyContext";
import Image from "next/image";
import { notFound } from "next/navigation";
import Head from "next/head";
import Footer from "./Footer";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { ExtraerCategorias } from "../globalFunctions/function";
import useSWR from "swr";

// Creamos el fetcher como una función que retorna una promesa
const createFetcher = (tienda) => {
  return async () => {
    try {
      const { data: tiendaData, error } = await supabase
        .from("Sitios")
        .select(
          `*, Products (*, agregados (*), coment (*)),codeDiscount (*),comentTienda(*)`
        )
        .eq("sitioweb", tienda)
        .single();

      if (error) throw error;

      if (tiendaData) {
        // Transformamos los datos como lo hacía la función original
        const storeData = {
          ...tiendaData,
          moneda: JSON.parse(tiendaData.moneda),
          moneda_default: JSON.parse(tiendaData.moneda_default),
          horario: JSON.parse(tiendaData.horario),
          categoria: JSON.parse(tiendaData.categoria),
          envios: JSON.parse(tiendaData.envios),
          products: tiendaData.Products,
          top: tiendaData.name,
        };
        delete storeData.Products;
        return storeData;
      } else {
        notFound();
      }
    } catch (error) {
      console.error("Error:", error);
      throw error; // Importante: propagar el error para que SWR lo maneje
    }
  };
};

export default function Header({ tienda, children }) {
  const { store, dispatchStore } = useContext(MyContext);
  const pathname = usePathname();
  const router = useRouter();
  const [cantidad, setCantidad] = useState(0);
  const [compra, setCompra] = useState([]);
  // Implementación correcta de useSWR
  const { data, error, mutate, isValidating } = useSWR(
    [`sitios-${tienda}`, tienda], // Clave única para el caché
    createFetcher(tienda),
    {
      refreshInterval: 10 * 60 * 1000, // 10 minutos
      suspense: true,
      revalidateOnFocus: false, // Evita revalidaciones innecesarias
      shouldRetryOnError: true, // Reintentar en caso de error
      dedupingInterval: 5000, // Evita múltiples llamadas en 5 segundos
      onError: (error) => {
        console.error("Error en SWR:", error);
      },
      onSuccess: (data) => {
        // Opcional: manejar datos exitosos
        if (data) {
          dispatchStore({ type: "Add", payload: data });
          dispatchStore({ type: "Loader", payload: 100 });
        }
      },
    }
  );

  // Efecto para manejar los datos
  useEffect(() => {
    if (data) {
      dispatchStore({ type: "Add", payload: data });
      dispatchStore({ type: "Loader", payload: 100 });
    }
  }, [data, dispatchStore]);

  useEffect(() => {
    dispatchStore({
      type: "Top",
      payload: store.name,
    });
  }, [pathname, store.name, dispatchStore]);

  useEffect(() => {
    const calcularCantidadCarrito = () => {
      return store.products.reduce(
        (acc, producto) =>
          acc + producto.Cant + sumarAgregados(producto.agregados),
        0
      );
    };

    setCantidad(calcularCantidadCarrito());

    if (store.variable && pathname.slice(1, 2) !== store.variable) {
      router.push(`/${store.variable}/${store.sitioweb}`);
    }
    setCompra(
      store.products.filter((obj) => obj.Cant > 0 || Suma(obj.agregados) > 0)
    );
  }, [store, pathname, router]);

  return (
    <div className="max-w-2xl w-full">
      <Head>
        <title>
          {store.name} - {store.tipo} en {store.municipio}
        </title>
        <meta name="description" content={store.parrrafo} />
        <meta
          name="keywords"
          content={`${store.tipo}, ${store.name}, ${store.Provincia}, ${store.municipio},${store.sitioweb}`}
        />
      </Head>
      <main>
        <header className="flex items-center justify-between gap-4 fixed top-0 p-2 h-12 md:h-16 backdrop-blur-xl max-w-2xl w-full z-[10]">
          {pathname == `/${store.variable}/${store.sitioweb}` ? (
            <CategorySelector />
          ) : (
            <Link href={`/${store.variable}/${store.sitioweb}`}>
              <ArrowLeft className="h-6 w-6" />
            </Link>
          )}

          <Link
            href={
              pathname !== `/${store.variable}/${store.sitioweb}/search`
                ? `/${store.variable}/${store.sitioweb}/search`
                : `/${store.variable}/${store.sitioweb}`
            }
            className="w-5/6"
          >
            {pathname !== `/${store.variable}/${store.sitioweb}/search` ? (
              <div className="relative flex justify-center items-center border bg-white  rounded-full w-full h-full p-2 grid-cols-4">
                <Search className="absolute h-5 w-5 left-2 bg-white" />
                <span className="line-clamp-1 overflow-hidden w-full text-center">
                  {store.top}
                </span>
              </div>
            ) : (
              <span className="flex justify-center items-center border bg-white  rounded-full w-full h-full p-2 ">
                {store.name}
              </span>
            )}
          </Link>
          <Link
            href={
              pathname == `/${store.variable}/${store.sitioweb}`
                ? `/${store.variable}/${store.sitioweb}/about`
                : `/${store.variable}/${store.sitioweb}`
            }
            className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-50"
          >
            <Image
              src={
                store.urlPoster ||
                "https://res.cloudinary.com/dbgnyc842/image/upload/v1725399957/xmlctujxukncr5eurliu.png"
              }
              alt={store.name || "Store"}
              className="w-10 h-10 rounded-full object-cover object-center"
              width={40}
              style={{
                aspectRatio: "200/200",
                objectFit: "cover",
              }}
              height={40}
            />
          </Link>
        </header>

        <div className="min-h-screen">{children}</div>
        <CartComponent
          cantidad={cantidad}
          compra={compra}
          sumarAgregados={sumarAgregados}
        />
        <div
          id="sticky-footer"
          className="bg-transparent sticky bottom-0 h-px w-full"
        ></div>
        <Footer />
      </main>
    </div>
  );
}

export function CategorySelector() {
  const { store, dispatchStore } = useContext(MyContext);
  const [isOpen, setIsOpen] = useState(false);

  const [categoria, setcategoria] = useState([]);
  useEffect(() => {
    setcategoria(ExtraerCategorias(store, store.products));
  }, [store]);

  async function SearchCategory(category) {
    const element = await document.getElementById(
      category.replace(/\s+/g, "_")
    );
    await setIsOpen(false);
    if (element) {
      // Realiza la acción que desees con el elemento
      element.scrollIntoView({ behavior: "smooth" }); // Ejemplo: hacer scroll hasta el elemento
    }
  }

  return (
    <>
      {categoria.length > 1 ? (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button onClick={() => setIsOpen(true)} size="icon" variant="ghost">
              <LayoutGrid className="h-6 w-6" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-gray-100">
            <SheetHeader>
              <SheetTitle>{store.name}</SheetTitle>
              <SheetDescription>Navegue por nuestra tienda</SheetDescription>
            </SheetHeader>
            <ScrollArea className="whitespace-nowrap m-4 flex items-center">
              <div className="flex flex-col max-w-max gap-4 justify-center">
                {categoria.map((cat, ind) => (
                  <Button
                    key={ind}
                    variant="outline"
                    className="w-full"
                    onClick={() => SearchCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      ) : (
        <></>
      )}
    </>
  );
}

const CartComponent = ({ cantidad, compra, sumarAgregados }) => {
  const { store, dispatchStore } = useContext(MyContext);

  const pathname = usePathname();
  const [isAnimating, setIsAnimating] = useState(false);

  // Ruta base donde se muestra el carrito
  const basePath = `/${store.variable}/${store.sitioweb}`;

  // Ruta de productos
  const isProductPage = pathname.startsWith(`${basePath}/products/`);

  return (
    <>
      {/* Mostrar solo en la ruta base */}
      {(isProductPage || (cantidad > 0 && pathname === basePath)) && (
        <motion.div
          initial={{ opacity: 0, y: 100 }} // Comienza oculto y debajo de la posición final
          animate={
            (isProductPage && store.animateCart) ||
            (cantidad > 0 && pathname === basePath)
              ? { opacity: 1, y: 0, transition: { duration: 0.5 } } // Mostrar en la posición original
              : { opacity: 0, y: 100, transition: { duration: 0.5 } } // Ocultar si se cumplen las condiciones
          }
          exit={{
            opacity: 0,
            y: 100, // Sale hacia abajo
          }}
          className="sticky bottom-0 right-0 left-0 max-w-2xl w-full overflow-hidden z-[10]"
        >
          <Link
            href={`/${store.variable}/${store.sitioweb}/carrito`}
            className="max-w-2xl w-full overflow-hidden"
          >
            <div className="w-full h-20 md:h-24">
              <div
                className="bg-transparent h-8 md:h-10 w-full rounded-b-full "
                style={{ boxShadow: "-1px 20px 0px 9px rgb(17 24 39)" }}
              ></div>
              <div
                id="sticky-footer"
                className="grid grid-cols-8 p-2 bg-gray-900 h-12 md:h-14 place-content-center"
              >
                <span className="text-white flex items-center justify-center">
                  <ShoppingCart className="md:w-6 md:h-6 w-5 h-5" />
                </span>
                <ScrollArea className="bg-gray-900 whitespace-nowrap col-span-6 h-8 md:h-10">
                  <div className="flex items-center px-4 w-max -space-x-2 ">
                    {compra.map((obj, ind) => (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{
                          opacity: 1,
                          height: "100%",
                          transition: { duration: 0.5 },
                        }}
                        key={ind}
                        className="relative"
                      >
                        <Image
                          src={
                            obj.image ||
                            store.urlPoster ||
                            "https://res.cloudinary.com/dbgnyc842/image/upload/v1725399957/xmlctujxukncr5eurliu.png"
                          }
                          alt={obj.title || `Shopping-Product-${ind}`}
                          width={40}
                          height={40}
                          className="rounded-full h-8 md:h-10 w-8 md:w-10 object-cover object-center"
                        />
                        <div className="absolute bg-red-500 bottom-0 left-0 h-4 w-4 rounded-full text-white text-xs text-center">
                          {obj.Cant + sumarAgregados(obj.agregados)}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
                <div className="bg-white rounded-full h-8 md:h-10 w-8 md:w-10 text-gray-900 flex items-center justify-center">
                  {cantidad}
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      )}
    </>
  );
};

const Suma = (agregados) =>
  agregados.reduce((sum, obj) => sum + obj.cantidad, 0);
const sumarAgregados = (agregados) => {
  return agregados.reduce((sum, obj) => sum + obj.cantidad, 0);
};
function CarritoButton({ cantidad, href }) {
  return (
    <Link href={href} size="icon" className="flex items-center justify-center">
      <div className="relative">
        <ShoppingCartIcon className="h-6 w-6" />
        <div className="absolute -top-4 -right-4 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-red-50">
          {cantidad}
        </div>
      </div>
    </Link>
  );
}
