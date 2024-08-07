"use client";
import Link from "next/link";
import {
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectGroup,
  SelectValue,
  Select,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  SheetTrigger,
  SheetContent,
  SheetClose,
  Sheet,
} from "@/components/ui/sheet";
import React from "react";
import { useEffect, useState, useContext } from "react";
import { createClient } from "@/lib/supabase";
import { usePathname, useRouter } from "next/navigation";
import {
  HandCoins,
  CalendarClock,
  House,
  BadgeInfo,
  Boxes,
  AlignRight,
  Store,
  UserCog,
} from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export default function Header2({ tienda, context }) {
  const { store, dispatchStore } = useContext(context);
  const supabase = createClient();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [cantidad, setcantidad] = useState(0);

  const Login = () => {
    setIsOpen(false);
    router.push("/login");
  };

  useEffect(() => {
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
              });
          }
        });
    };

    obtenerDatos();
  }, [tienda]);

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
      <header
        className="flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-800 z-[100]"
        style={{ position: "sticky", top: 0 }}
      >
        <Link
          className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-50"
          href="#"
        >
          <Store className="h-6 w-6" />
          <span>
            {pathname == `/${store.variable}/${store.sitioweb}`
              ? store.name
              : pathname == `/${store.variable}/${store.sitioweb}/about`
              ? `Acerca de ${store.name}`
              : pathname == `/${store.variable}/${store.sitioweb}/products`
              ? `Ofertas en ${store.name} `
              : pathname == `/${store.variable}/${store.sitioweb}/resevation`
              ? `Reservacion`
              : pathname == `/${store.variable}/${store.sitioweb}/carrito`
              ? "Carrito de compras"
              : "Producto"}
          </span>
        </Link>
        <div className="flex items-center">
          <nav className="hidden md:flex items-center gap-4">
            <Link
              className={
                pathname === `/${store.variable}/${store.sitioweb}`
                  ? "flex  items-center gap-3 rounded-lg underline px-3 py-2 text-gray-900 text-gray-500 transition-all hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-50  bg-gray-100"
                  : "flex   items-center gap-3 rounded-lg hover:underline  text-gray-500 px-3 py-2 transition-all hover:text-gray-700  dark:text-gray-50 dark:hover:text-gray-50"
              }
              href={`/${store.variable}/${store.sitioweb}/`}
            >
              <House className="h-5 w-5" />
              Inicio
            </Link>
            <Link
              className={
                pathname === `/${store.variable}/${store.sitioweb}/about`
                  ? "flex items-center gap-3 rounded-lg underline px-3 py-2 text-gray-900 text-gray-500 transition-all hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-50  bg-gray-100"
                  : "flex   items-center gap-3 hover:underline rounded-lg  text-gray-500 px-3 py-2 transition-all hover:text-gray-700  dark:text-gray-50 dark:hover:text-gray-50"
              }
              href={`/${store.variable}/${store.sitioweb}/about`}
            >
              <BadgeInfo className="h-5 w-5" />
              Acerca de
            </Link>
            {store.variable != "r" && (
              <Link
                className={
                  pathname === `/${store.variable}/${store.sitioweb}/products`
                    ? "flex items-center gap-3 rounded-lg underline px-3 py-2 text-gray-900 text-gray-500 transition-all hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-50  bg-gray-100"
                    : "flex  items-center gap-3 hover:underline rounded-lg  text-gray-500 px-3 py-2 transition-all hover:text-gray-700  dark:text-gray-50 dark:hover:text-gray-50"
                }
                href={`/${store.variable}/${store.sitioweb}/products`}
              >
                <Boxes className="h-5 w-5" />
                Productos
              </Link>
            )}
            {store.reservas && (
              <Link
                className={
                  pathname ===
                  `/${store.variable}/${store.sitioweb}/reservation`
                    ? "flex  items-center gap-3 rounded-lg underline px-3 py-2 text-gray-900 text-gray-500 transition-all hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-50  bg-gray-100"
                    : "flex   items-center gap-3 hover:underline rounded-lg  text-gray-500 px-3 py-2 transition-all hover:text-gray-700  dark:text-gray-50 dark:hover:text-gray-50"
                }
                onClick={() => setIsOpen(false)}
                href={`/${store.variable}/${store.sitioweb}/reservation`}
              >
                <CalendarClock className="h-5 w-5" />
                Reservacion
              </Link>
            )}
            <div className="relative flex gap-1 items-center">
              <HandCoins className="h-5 w-5" />
              <Select
                onValueChange={(value) => {
                  const [a] = store.moneda.filter((obj) => obj.moneda == value);
                  dispatchStore({
                    type: "ChangeCurrent",
                    payload: JSON.stringify(a),
                  });
                }}
              >
                <SelectTrigger className="flex items-center gap-2 text-sm font-medium hover:underline underline-offset-4 dark:text-gray-400 dark:hover:text-gray-50">
                  <SelectValue
                    placeholder={store.moneda_default.moneda}
                  ></SelectValue>
                </SelectTrigger>
                <SelectContent className="w-40">
                  {store.moneda.map(
                    (mon, ind) =>
                      mon.valor > 0 && (
                        <SelectGroup key={ind}>
                          <SelectItem value={mon.moneda}>
                            {mon.moneda}
                          </SelectItem>
                        </SelectGroup>
                      )
                  )}
                </SelectContent>
              </Select>
            </div>

            <Button
              className=" gap-1 flex items-center text-sm px-10 font-medium hover:underline underline-offset-4 dark:text-gray-400 dark:hover:text-gray-50"
              onClick={Login}
            >
              <UserCog className="h-5 w-5" />
              Admin
            </Button>
          </nav>

          <Drawer>
            <DrawerTrigger
              id="tester"
              className="md:hiddentext-white rounded-lg flex items-center justify-center"
            >
              <AlignRight className="h-6 w-6" />
              <span className="sr-only">Menu</span>
            </DrawerTrigger>
            <DrawerContent className="z-[200]">
              <DrawerHeader>
                <DrawerTitle>Menu</DrawerTitle>
              </DrawerHeader>
              <DrawerFooter>
                <div className="grid gap-4">
                  <Link
                    className={
                      pathname === `/${store.variable}/${store.sitioweb}`
                        ? "flex   items-center gap-3 rounded-lg underline px-3 py-2 text-gray-900 text-gray-500 transition-all hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-50  bg-gray-100"
                        : "flex   items-center gap-3 hover:underline rounded-lg  text-gray-500 px-3 py-2 transition-all hover:text-gray-700  dark:text-gray-50 dark:hover:text-gray-50"
                    }
                    onClick={() => setIsOpen(false)}
                    href={`/${store.variable}/${store.sitioweb}/`}
                  >
                    <House className="h-5 w-5" />
                    Inicio
                  </Link>
                  <Link
                    className={
                      pathname === `/${store.variable}/${store.sitioweb}/about`
                        ? "flex  items-center gap-3 rounded-lg underline px-3 py-2 text-gray-900 text-gray-500 transition-all hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-50  bg-gray-100"
                        : "flex   items-center gap-3 hover:underline rounded-lg  text-gray-500 px-3 py-2 transition-all hover:text-gray-700  dark:text-gray-50 dark:hover:text-gray-50"
                    }
                    onClick={() => setIsOpen(false)}
                    href={`/${store.variable}/${store.sitioweb}/about`}
                  >
                    <BadgeInfo className="h-5 w-5" />
                    Acerca de
                  </Link>
                  {store.variable == "t" && (
                    <Link
                      className={
                        pathname ===
                        `/${store.variable}/${store.sitioweb}/products`
                          ? "flex  items-center gap-3 rounded-lg underline px-3 py-2 text-gray-900 text-gray-500 transition-all hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-50  bg-gray-100"
                          : "flex   items-center gap-3 hover:underline rounded-lg  text-gray-500 px-3 py-2 transition-all hover:text-gray-700  dark:text-gray-50 dark:hover:text-gray-50"
                      }
                      onClick={() => setIsOpen(false)}
                      href={`/${store.variable}/${store.sitioweb}/products`}
                    >
                      <Boxes className="h-5 w-5" />
                      Productos
                    </Link>
                  )}
                  {store.reservas && (
                    <Link
                      className={
                        pathname ===
                        `/${store.variable}/${store.sitioweb}/reservation`
                          ? "flex  tems-center gap-3 rounded-lg underline px-3 py-2 text-gray-900 text-gray-500 transition-all hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-50  bg-gray-100"
                          : "flex items-center gap-3 hover:underline rounded-lg  text-gray-500 px-3 py-2 transition-all hover:text-gray-700  dark:text-gray-50 dark:hover:text-gray-50"
                      }
                      onClick={() => setIsOpen(false)}
                      href={`/${store.variable}/${store.sitioweb}/reservation`}
                    >
                      <CalendarClock className="h-5 w-5" />
                      Reservacion
                    </Link>
                  )}
                  <div className="relative  flex gap-3 items-center px-3 py-2 ">
                    <HandCoins className="h-5 w-5" />

                    <Select
                      onValueChange={(value) => {
                        const [a] = store.moneda.filter(
                          (obj) => obj.moneda == value
                        );
                        dispatchStore({
                          type: "ChangeCurrent",
                          payload: JSON.stringify(a),
                        });
                      }}
                    >
                      <SelectTrigger className="flex items-center gap-2 text-sm font-medium hover:underline underline-offset-4 dark:text-gray-400 dark:hover:text-gray-50">
                        <SelectValue
                          placeholder={store.moneda_default.moneda}
                        ></SelectValue>
                      </SelectTrigger>
                      <SelectContent className="w-40">
                        {store.moneda.map(
                          (mon, ind) =>
                            mon.valor > 0 && (
                              <SelectGroup key={ind}>
                                <SelectItem value={mon.moneda}>
                                  {mon.moneda}
                                </SelectItem>
                              </SelectGroup>
                            )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="bg-gray-900  rounded-lg flex items-center justify-center">
                    <Button
                      className="w-1/2 gap-1 flex items-center text-sm font-medium hover:underline underline-offset-4 dark:text-gray-400 dark:hover:text-gray-50"
                      onClick={Login}
                    >
                      <UserCog className="h-5 w-5" />
                      Admin
                    </Button>
                  </div>
                </div>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
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

function ChevronDownIcon(props) {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function MenuIcon(props) {
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
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function Package2Icon(props) {
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
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
      <path d="M12 3v6" />
    </svg>
  );
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
