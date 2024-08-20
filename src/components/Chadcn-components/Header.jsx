"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import React from "react";
import { useEffect, useState, useContext } from "react";
import { createClient } from "@/lib/supabase";
import { usePathname, useRouter } from "next/navigation";
import {
  HandCoins,
  CalendarClock,
  House,
  BadgeInfo,
  AlignRight,
  Store,
  Search,
  UserCog,
} from "lucide-react";
import {
  SheetTrigger,
  SheetContent,
  SheetClose,
  Sheet,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Loading from "../component/loading";
import { v4 as uuidv4 } from "uuid";
import { sendGTMEvent } from "@next/third-parties/google";
import { initializeAnalytics } from "@/lib/datalayer";
import { FlipWords } from "@/components/ui/flip-words";

export default function Header({ tienda, context }) {
  const { store, dispatchStore } = useContext(context);
  const supabase = createClient();
  const pathname = usePathname();
  const router = useRouter();
  const [cantidad, setcantidad] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const now = new Date();

  useEffect(() => {
    sendGTMEvent("event", "CArga de datos", { value: "xyz" });
    dispatchStore({
      type: "Loader",
      payload: 10,
    });
    const obtenerDatos = async () => {
      await supabase
        .from("Sitios")
        .select("*")
        .eq("sitioweb", tienda)
        .then((res) => {
          if (res.data) {
            const [a] = res.data;
            dispatchStore({
              type: "Loader",
              payload: 50,
            });
            supabase
              .from("Products")
              .select("*")
              .eq("storeId", a.UUID)
              .then((respuesta) => {
                const c = respuesta.data.map((obj) => ({
                  ...obj,
                  agregados: JSON.parse(obj.agregados),
                  coment: JSON.parse(obj.coment),
                }));
                const b = {
                  ...a,
                  moneda: JSON.parse(a.moneda),
                  moneda_default: JSON.parse(a.moneda_default),
                  horario: JSON.parse(a.horario),
                  comentario: JSON.parse(a.comentario),
                  categoria: JSON.parse(a.categoria),
                  envios: JSON.parse(a.envios),
                  products: c,
                };
                dispatchStore({
                  type: "Add",
                  payload: b,
                });
                dispatchStore({
                  type: "Loader",
                  payload: 100,
                });
                initializeAnalytics({
                  tienda: a.sitioweb,
                  events: "inicio",
                  date: getLocalISOString(now),
                  desc: "[]",
                  uid: uuidv4(),
                });
              });
          }
        });
    };

    obtenerDatos();
  }, [tienda]);

  console.log(store);

  function getLocalISOString(date) {
    const offset = date.getTimezoneOffset(); // Obtiene el desfase en minutos
    const localDate = new Date(date.getTime() - offset * 60000); // Ajusta la fecha a UTC
    return localDate.toISOString().slice(0, 19); // Formato "YYYY-MM-DDTHH:mm:ss"
  }

  useEffect(() => {
    let a = 0;
    function Suma(agregados) {
      let b = 0;
      agregados.map((objeto) => (b = b + objeto.cantidad));
      return b;
    }
    store.products.map(
      (objeto) => (a = a + objeto.Cant + Suma(objeto.agregados))
    );

    setcantidad(a);
  }, [store]);

  return (
    <>
      {store.loading != 100 && <Loading loading={store.loading} />}
      <header
        className="flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-800 z-[100]"
        style={{ position: "sticky", top: 0 }}
      >
        <Link
          className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-50"
          href={`/${store.variable}/${store.sitioweb}`}
        >
          <Store className="h-6 w-6" />
        </Link>
        <Link
          className="w-2/3"
          href={`/${store.variable}/${store.sitioweb}/search`}
        >
          {pathname != `/${store.variable}/${store.sitioweb}/search` ? (
            <div className="grid items-center border bg-white rounded-full w-full h-full p-2 grid-cols-4">
              <Search className="h-5 w-5" />
              <span className="col-span-3 line-clamp-1 overflow-hidden">
                <FlipWords
                  className="line-clamp-1 overflow-hidden"
                  words={
                    store.loading == 100
                      ? [
                          store.name,
                          store.tipo,
                          store.Provincia,
                          `${CalcularPromedio(store.comentario)}-estrellas`,
                        ]
                      : ["Webshop", "R&H"]
                  }
                  duration={5000}
                />
              </span>
            </div>
          ) : (
            <span className="col-span-3  w-full text-center line-clamp-1 overflow-hidden">
              {store.name}
            </span>
          )}
        </Link>
        <div className="flex items-center">
          <NavigationMenu className="hidden md:flex items-center gap-4">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link
                  href={`/${store.variable}/${store.sitioweb}/`}
                  legacyBehavior
                  passHref
                >
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <House className="h-5 w-5" />
                    Inicio
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link
                  href={`/${store.variable}/${store.sitioweb}/about`}
                  legacyBehavior
                  passHref
                >
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <BadgeInfo className="h-5 w-5" />
                    Acerca de
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              {store.reservas && (
                <NavigationMenuItem>
                  <Link
                    href={`/${store.variable}/${store.sitioweb}/reservation`}
                    legacyBehavior
                    passHref
                  >
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      <CalendarClock className="h-5 w-5" />
                      Reservacion
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )}

              <NavigationMenuItem>
                <Link
                  href="https://admin-rh.vercel.app"
                  legacyBehavior
                  passHref
                >
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <UserCog className="h-5 w-5" />
                    Admin
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="gap-2">
                  <HandCoins className="h-5 w-5" />
                  {store.moneda_default.moneda}
                </NavigationMenuTrigger>
                <NavigationMenuContent className="w-[100px]">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <div className="grid max-w-max gap-4 ">
                      {store.moneda.map(
                        (mon, ind) =>
                          mon.valor > 0 && (
                            <Button
                              key={ind}
                              className="w-16"
                              onClick={() => {
                                const [a] = store.moneda.filter(
                                  (obj) => obj.moneda == mon.moneda
                                );
                                dispatchStore({
                                  type: "ChangeCurrent",
                                  payload: JSON.stringify(a),
                                });
                              }}
                            >
                              {mon.moneda}
                            </Button>
                          )
                      )}
                    </div>
                  </NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                className="md:hidden"
                onClick={() => (isOpen ? setIsOpen(false) : setIsOpen(true))}
                size="icon"
                variant="outline"
              >
                <AlignRight className="h-6 w-6" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-gray-100">
              <NavigationMenu className="w-full mt-16">
                <NavigationMenuList className="flex flex-col w-full gap-4">
                  <NavigationMenuItem className="w-full">
                    <Link
                      href={`/${store.variable}/${store.sitioweb}/`}
                      legacyBehavior
                      passHref
                    >
                      <NavigationMenuLink
                        className={`${navigationMenuTriggerStyle()} gap-4	`}
                      >
                        <House className="h-5 w-5" />
                        Inicio
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem className="w-full">
                    <Link
                      href={`/${store.variable}/${store.sitioweb}/about`}
                      legacyBehavior
                      passHref
                    >
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        <BadgeInfo className="h-5 w-5" />
                        Acerca de
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  {store.reservas && (
                    <NavigationMenuItem className="w-full">
                      <Link
                        href={`/${store.variable}/${store.sitioweb}/reservation`}
                        legacyBehavior
                        passHref
                      >
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle()}
                        >
                          <CalendarClock className="h-5 w-5" />
                          Reservacion
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  )}

                  <NavigationMenuItem className="w-full">
                    <Link
                      href="https://admin-rh.vercel.app"
                      legacyBehavior
                      passHref
                    >
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        <UserCog className="h-5 w-5" />
                        Admin
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>
                      <HandCoins className="h-5 w-5" />
                      {store.moneda_default.moneda}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="w-[100px]">
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        <div className="grid max-w-max gap-4 ">
                          {store.moneda.map(
                            (mon, ind) =>
                              mon.valor > 0 && (
                                <Button
                                  key={ind}
                                  className="w-16"
                                  onClick={() => {
                                    const [a] = store.moneda.filter(
                                      (obj) => obj.moneda == mon.moneda
                                    );
                                    dispatchStore({
                                      type: "ChangeCurrent",
                                      payload: JSON.stringify(a),
                                    });
                                  }}
                                >
                                  {mon.moneda}
                                </Button>
                              )
                          )}
                        </div>
                      </NavigationMenuLink>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      {cantidad > 0 &&
        pathname != `/${store.variable}/${store.sitioweb}/carrito` && (
          <div className="fixed bottom-6 right-6  z-[100]">
            <Link
              href={`/${store.variable}/${store.sitioweb}/carrito`}
              size="icon"
              className="flex items-center justify-center rounded-full md:rounded-5x bg-primary p-4 text-primary-foreground shadow-lg transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:w-32"
            >
              <span className="mr-4 sr-only sm:not-sr-only">Carrito</span>

              <div className="relative">
                <ShoppingCartIcon className="h-6 w-6" />
                <div className="absolute -top-4 -right-4 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-red-50">
                  {cantidad}
                </div>
              </div>
            </Link>
          </div>
        )}
    </>
  );
}
function CalcularPromedio(arr) {
  const suma = arr.reduce((acc, item) => acc + item.star, 0); // Sumar los valores de star
  const a = suma / arr.length; // Calcular el promedio
  return a;
}
function ShoppingCartIcon(props) {
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
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}
