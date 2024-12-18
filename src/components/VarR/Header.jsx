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
import { initialState, MyContext } from "@/context/MyContext";
import Image from "next/image";
import { notFound } from "next/navigation";
import Head from "next/head";
import Footer from "./Footer";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { ExtraerCategorias } from "../globalFunctions/function";
import useSWR from "swr";
import { generateSchedule } from "../globalFunctions/function";
import { ThemeContext } from "../BoltComponent/Navbar";
import Loading from "../Chadcn-components/loading";

export default function Header({ tienda, children }) {
  const { store, dispatchStore } = useContext(MyContext);
  const { webshop, setwebshop } = useContext(ThemeContext);
  const pathname = usePathname();
  const router = useRouter();
  const [cantidad, setCantidad] = useState(0);
  const [compra, setCompra] = useState([]);
  // Implementación correcta de useSWR

  // Efecto para manejar los datos
  useEffect(() => {
    dispatchStore({
      type: "Add",
      payload:
        webshop.store.find((obj) => obj.sitioweb == tienda) || initialState,
    });
    if (webshop.store.find((obj) => obj.sitioweb == tienda)) {
      dispatchStore({ type: "Loader", payload: 100 });
    }
  }, [webshop, dispatchStore, tienda]);

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

  const newHorario = generateSchedule(store.horario);
  const open = isOpen(newHorario);
  console.log(store.loading);
  return (
    <div className=" max-w-lg w-full">
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
      {store.loading == 100 ? (
        <main>
          <header className="max-w-lg flex items-center justify-between gap-4 fixed top-0 p-2 h-12 md:h-16 bg-white  w-full z-[10]">
            {pathname == `/${store.variable}/${store.sitioweb}` ? (
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
                    aspectRatio: "1",
                    objectFit: "cover",
                  }}
                  height={40}
                />
                <div>
                  <div>{store.name}</div>
                  <div className="flex items-center">
                    <div
                      className={
                        open.open
                          ? "rounded-full bg-white mx-1 my-px px-1 py-0.5 text-gray-900"
                          : "rounded-full bg-red-700 mx-1 my-px px-1 py-0.5 text-white"
                      }
                      style={{ fontSize: "8px" }}
                    >
                      {open.open ? "ABIERTO" : "CERRADO"}
                    </div>
                    <p className="text-gray-700" style={{ fontSize: "8px" }}>
                      {open.open ? (
                        estadoCierre(newHorario) ? (
                          <>
                            Cierra{" "}
                            <relative-time
                              lang="es"
                              datetime={estadoCierre(newHorario)}
                              no-title
                            ></relative-time>{" "}
                          </>
                        ) : (
                          "24 horas"
                        )
                      ) : estadoApertura(newHorario) ? (
                        <>
                          Abre{" "}
                          <relative-time
                            lang="es"
                            datetime={estadoApertura(newHorario)}
                            no-title
                          ></relative-time>
                        </>
                      ) : (
                        "24 horas"
                      )}
                    </p>
                  </div>
                </div>
              </Link>
            ) : (
              <Link href={`/${store.variable}/${store.sitioweb}`}>
                <ArrowLeft className="h-6 w-6" />
              </Link>
            )}
            <div className="flex gap-2">
              {pathname !== `/${store.variable}/${store.sitioweb}/search` && (
                <Link
                  href={
                    pathname !== `/${store.variable}/${store.sitioweb}/search`
                      ? `/${store.variable}/${store.sitioweb}/search`
                      : `/${store.variable}/${store.sitioweb}`
                  }
                  className="w-5/6 h-10 md:h-14"
                >
                  <div className="flex justify-center items-center  rounded-full w-full h-full p-2 grid-cols-4">
                    <Search className=" h-5 w-5 left-2 " />
                  </div>
                </Link>
              )}

              {pathname == `/${store.variable}/${store.sitioweb}` && (
                <CategorySelector />
              )}
            </div>
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
      ) : (
        <Loading />
      )}
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
          <SheetContent side="right" className="bg-gray-100 ">
            <SheetHeader>
              <SheetTitle>{store.name}</SheetTitle>
              <SheetDescription>Navegue por nuestra tienda</SheetDescription>
            </SheetHeader>
            <ScrollArea
              className="relative whitespace-nowrap m-4 flex items-center"
              style={{ height: "75vh" }}
            >
              <div className="flex flex-col max-w-max gap-4 justify-center">
                {categoria.map((cat, ind) => (
                  <Button
                    key={ind}
                    variant="outline"
                    className="w-full"
                    onClick={() => SearchCategory(cat.name)}
                  >
                    {cat.name}
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

  // Controlar la animación solo cuando cambian las condiciones relevantes
  useEffect(() => {
    const shouldAnimate =
      (isProductPage && store.animateCart) ||
      (cantidad > 0 && pathname === basePath);

    setIsAnimating(shouldAnimate);
  }, [isProductPage, store.animateCart, cantidad, pathname, basePath]);

  return (
    <>
      {/* Mostrar solo en la ruta base */}
      <motion.div
        initial={{ opacity: 0, y: 100 }} // Comienza oculto y debajo de la posición final
        animate={
          isAnimating
            ? { opacity: 1, y: 0, transition: { duration: 0.5 } } // Mostrar en la posición original
            : { opacity: 0, y: 100, transition: { duration: 0.5 } } // Ocultar si no se cumplen las condiciones
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
          <div className="w-full p-3">
            <div
              id="sticky-footer"
              className="grid grid-cols-7 p-2 bg-gray-900 h-16 md:h-20 place-content-center rounded-full"
            >
              <ScrollArea className="flex items-center relative bg-gray-900 whitespace-nowrap col-span-6">
                <div className="absolute pointer-events-none inset-0 bg-gradient-to-l from-gray-900 via-transparent to-transparent z-[1]"></div>

                <div className="flex items-center px-2 w-max -space-x-2 ">
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
                        className="rounded-full h-full object-cover object-center aspect-square"
                      />
                      <div className="absolute bg-red-500 bottom-0 left-0 h-4 w-4 rounded-full text-white text-xs text-center">
                        {obj.Cant + sumarAgregados(obj.agregados)}
                      </div>
                    </motion.div>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
              <div className="relative rounded-full px-2 flex items-center justify-center text-white">
                <ShoppingCart />
                <div className="absolute bg-red-500 top-0 right-0 h-4 w-4 rounded-full text-white text-xs text-center">
                  {cantidad}
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
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
function isOpen(newHorario) {
  const now = new Date();

  let element;
  for (let index = 0; index < newHorario.length; index++) {
    if (
      !(
        newHorario[index]?.apertura.toISOString() ==
        newHorario[index]?.cierre.toISOString()
      )
    ) {
      if (
        newHorario[index]?.apertura <= now &&
        newHorario[index]?.cierre > now
      ) {
        element = {
          week: newHorario[index]?.apertura.getDay() % 7,
          open: true,
        };
      }
    }
  }
  if (element) {
    return element;
  } else {
    return { week: 7, open: false }; // Está cerrado
  }
}
function estadoApertura(fechas) {
  const ahora = new Date();
  let resultados = [];

  fechas.forEach(({ apertura, cierre }) => {
    const abierto = ahora >= apertura && ahora < cierre;

    let tiempoRestante = null;
    if (abierto) {
      tiempoRestante = new Date(cierre - ahora);
    } else {
      // Si está cerrado, se calcula el tiempo hasta la próxima apertura
      tiempoRestante = new Date(apertura - ahora);
    }

    resultados.push({
      apertura,
      cierre,
      abierto,
      tiempoRestante: {
        horas: Math.floor(tiempoRestante / (1000 * 60 * 60)),
        minutos: Math.floor((tiempoRestante % (1000 * 60 * 60)) / (1000 * 60)),
        segundos: Math.floor((tiempoRestante % (1000 * 60)) / 1000),
      },
    });
  });
  let proximaApertura = null;

  for (let i = 0; i < resultados.length; i++) {
    const tiempo = resultados[i % 7].tiempoRestante;
    const apertura = resultados[i % 7].apertura;
    const cierre = resultados[(i + 6) % 7].cierre;
    const cierreHoy = resultados[i % 7].cierre;

    // Verifica si hay horas, minutos o segundos positivos
    if (tiempo.horas > 0 || tiempo.minutos > 0 || tiempo.segundos > 0) {
      //Si no abre hoy
      if (!(apertura.toISOString() == cierreHoy.toISOString())) {
        //cierre despues de la apertura siguiente
        if (apertura > cierre) {
          //Si no es 24 horas
          if (!(apertura.toISOString() == cierre.toISOString())) {
            // no ha pasado la apertura
            if (apertura > ahora) {
              proximaApertura = resultados[i % 7].apertura; // Guarda la apertura
              break; // Rompe el ciclo al encontrar el primer tiempo positivo
            }
          }
        }
      }
    }
  }
  return proximaApertura;
}
function estadoCierre(fechas) {
  const ahora = new Date();
  let estado = [];

  for (let i = 0; i < fechas.length; i++) {
    const cerrado =
      ahora >= fechas[i]?.cierre && ahora < fechas[(i + 1) % 7]?.apertura;

    let tiempoRestante = null;

    tiempoRestante = new Date(fechas[(i + 1) % 7]?.apertura - ahora);

    estado.push({
      apertura: fechas[i % 7]?.apertura,
      cierre: fechas[i % 7]?.cierre,
      cerrado,
      tiempoRestante: {
        horas: Math.floor(tiempoRestante / (1000 * 60 * 60)),
        minutos: Math.floor((tiempoRestante % (1000 * 60 * 60)) / (1000 * 60)),
        segundos: Math.floor((tiempoRestante % (1000 * 60)) / 1000),
      },
    });
  }

  let proximoCierre = null;

  for (let i = 0; i < estado.length; i++) {
    const tiempo = estado[i % 7].tiempoRestante;
    const apertura = estado[(i + 1) % 7].apertura;
    const aperturahoy = estado[i % 7].apertura;
    const cierre = estado[i % 7].cierre;

    if (cierre > ahora) {
      if (!(apertura.toISOString() == cierre.toISOString())) {
        if (aperturahoy.toISOString() == cierre.toISOString()) {
          // Verifica si hay horas, minutos o segundos positivos
          proximoCierre = cierre; // Guarda la apertura
          break; // Rompe el ciclo al encontrar el primer tiempo positivo
        }
      }
    }
  }
  return proximoCierre;
}
