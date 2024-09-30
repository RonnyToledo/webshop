"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState, useContext } from "react";
import { supabase } from "@/lib/supa";
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
import { SheetTrigger, SheetContent, Sheet } from "@/components/ui/sheet";
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
import { MyContext } from "@/context/MyContext";
import Image from "next/image";
import { notFound } from "next/navigation";
import Head from "next/head";

export default function Header({ tienda }) {
  const { store, dispatchStore } = useContext(MyContext);
  const pathname = usePathname();
  const router = useRouter();
  const [cantidad, setCantidad] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: tiendaData, error } = await supabase
          .from("Sitios") // Tabla de tiendas
          .select(
            `id,sitioweb,urlPoster,parrrafo,horario,cell,act_tf,insta,Provincia,UUID,domicilio,reservas,comentario,moneda,moneda_default,name,variable,categoria,local,envios,municipio,font,color,active,plan,marketing, Products (id,title,image,price,descripcion,agotado,caja,Cant,creado,visible,productId,agregados,coment,visitas,order),codeDiscount (*),Custom (*)`
          )
          .eq("sitioweb", tienda)
          .single();
        if (error) throw error;
        if (tiendaData) {
          const [custom] = tiendaData.Custom;
          const storeData = {
            ...tiendaData,
            moneda: JSON.parse(tiendaData.moneda),
            moneda_default: JSON.parse(tiendaData.moneda_default),
            horario: JSON.parse(tiendaData.horario),
            comentario: JSON.parse(tiendaData.comentario),
            categoria: JSON.parse(tiendaData.categoria),
            envios: JSON.parse(tiendaData.envios),
            products: tiendaData.Products.map((obj) => ({
              ...obj,
              agregados: JSON.parse(obj.agregados),
              coment: JSON.parse(obj.coment),
            })),
            top: tiendaData.name,
            custom: custom,
          };
          delete storeData.Products;
          delete storeData.Custom;

          dispatchStore({ type: "Add", payload: storeData });
          dispatchStore({ type: "Loader", payload: 100 });
        } else {
          notFound();
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [tienda]);

  useEffect(() => {
    dispatchStore({
      type: "Top",
      payload: store.name,
    });
  }, [pathname]);

  useEffect(() => {
    const calcularCantidadCarrito = () => {
      return store.products.reduce(
        (acc, producto) =>
          acc + producto.Cant + sumarAgregados(producto.agregados),
        0
      );
    };

    const sumarAgregados = (agregados) => {
      return agregados.reduce((sum, obj) => sum + obj.cantidad, 0);
    };

    setCantidad(calcularCantidadCarrito());

    if (store.variable && pathname.slice(1, 2) !== store.variable) {
      router.push(`/${store.variable}/${store.sitioweb}`);
    }
  }, [store]);

  return (
    <>
      {store.loading !== 100 && <Loading loading={store.loading} />}
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
      <header className="flex items-center justify-between sticky top-0 px-4 py-3 bg-gray-100 z-[10]">
        <Link
          href={`/${store.variable}/${store.sitioweb}`}
          className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-50"
        >
          <Image
            src={
              store.urlPoster ||
              "https://res.cloudinary.com/dbgnyc842/image/upload/v1725399957/xmlctujxukncr5eurliu.png"
            }
            alt={store.name || "Store"}
            className="w-10 h-auto rounded-full"
            width={40}
            height={40}
          />{" "}
        </Link>
        <Link
          href={`/${store.variable}/${store.sitioweb}/search`}
          className="w-2/3"
        >
          {pathname !== `/${store.variable}/${store.sitioweb}/search` ? (
            <div className="relative flex justify-between items-center border bg-white rounded-full w-full h-full p-2 grid-cols-4">
              <Search className="absolute h-5 w-5 mr-3 bg-white" />
              <span className="line-clamp-1 overflow-hidden w-full text-center">
                {store.top}
              </span>
            </div>
          ) : (
            <span className="w-full text-center line-clamp-1 overflow-hidden">
              {store.name}
            </span>
          )}
        </Link>
        <div className="flex items-center">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                onClick={() => setIsOpen(true)}
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
                  <MenuItem
                    href={`/${store.variable}/${store.sitioweb}/`}
                    icon={<House className="h-5 w-5" />}
                    label="Inicio"
                    onClose={() => setIsOpen(false)}
                  />
                  <MenuItem
                    href={`/${store.variable}/${store.sitioweb}/about`}
                    icon={<BadgeInfo className="h-5 w-5" />}
                    label="Acerca de"
                    onClose={() => setIsOpen(false)}
                  />
                  {store.reservas && (
                    <MenuItem
                      href={`/${store.variable}/${store.sitioweb}/reservation`}
                      icon={<CalendarClock className="h-5 w-5" />}
                      label="Reservacion"
                      onClose={() => setIsOpen(false)}
                    />
                  )}

                  <CurrencySelector
                    store={store}
                    dispatchStore={dispatchStore}
                  />
                </NavigationMenuList>
              </NavigationMenu>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      {cantidad > 0 &&
        pathname !== `/${store.variable}/${store.sitioweb}/carrito` && (
          <CarritoButton
            cantidad={cantidad}
            href={`/${store.variable}/${store.sitioweb}/carrito`}
          />
        )}
    </>
  );
}

function MenuItem({ href, icon, label, onClose }) {
  return (
    <NavigationMenuItem className="w-full">
      <Link href={href} onClick={onClose}>
        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
          {icon}
          {label}
        </NavigationMenuLink>
      </Link>
    </NavigationMenuItem>
  );
}

function CurrencySelector({ store, dispatchStore }) {
  return (
    <>
      {store.moneda.length > 1 ? (
        <NavigationMenuItem>
          <NavigationMenuTrigger>
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
                          const selectedMoneda = store.moneda.find(
                            (obj) => obj.moneda === mon.moneda
                          );
                          dispatchStore({
                            type: "ChangeCurrent",
                            payload: JSON.stringify(selectedMoneda),
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
      ) : (
        <></>
      )}
    </>
  );
}

function CarritoButton({ cantidad, href }) {
  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <Link
        href={href}
        size="icon"
        className="flex items-center justify-center rounded-full bg-primary p-4 text-primary-foreground shadow-lg transition-colors hover:bg-primary/90"
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
  );
}

function CalcularPromedio(arr) {
  const suma = arr.reduce((acc, item) => acc + item.star, 0);
  return suma / arr.length;
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
