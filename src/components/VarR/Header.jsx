"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState, useContext } from "react";
import { supabase } from "@/lib/supa";
import { usePathname, useRouter } from "next/navigation";
import { HandCoins, Search, Store, BadgeInfo } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Loading from "./loading";
import { MyContext } from "@/context/MyContext";
import Image from "next/image";
import { notFound } from "next/navigation";
import Head from "next/head";

export default function Header({ tienda, children }) {
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
            `id,sitioweb,urlPoster,parrrafo,horario,cell,email,act_tf,insta,Provincia,UUID,domicilio,reservas,comentario,moneda,moneda_default,name,variable,categoria,local,envios,municipio,font,color,active,plan,marketing, Products (id,title,image,price,descripcion,agotado,caja,Cant,creado,favorito,visible,productId,agregados,coment,visitas,order),codeDiscount (*),Custom (*)`
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
  }, [tienda, dispatchStore]);

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

    const sumarAgregados = (agregados) => {
      return agregados.reduce((sum, obj) => sum + obj.cantidad, 0);
    };

    setCantidad(calcularCantidadCarrito());

    if (store.variable && pathname.slice(1, 2) !== store.variable) {
      router.push(`/${store.variable}/${store.sitioweb}`);
    }
  }, [store, pathname, router]);

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
      <header className="relative flex items-center justify-between sticky top-0 p-2 h-16 bg-gray-100 z-[10]">
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
            className="w-10 h-10 rounded-full"
            width={40}
            style={{
              aspectRatio: "200/200",
              objectFit: "cover",
            }}
            height={40}
          />{" "}
        </Link>{" "}
        <h1 className="text-xl font-semibold line-clamp-1 overflow-hidden">
          {store.name}
        </h1>
        <span className="w-10 h-10"></span>
      </header>
      <div className="min-h-screen">{children}</div>

      <footer className="flex justify-around p-4 sticky bottom-0 bg-gray-100 z-[10]">
        <Button variant="ghost">
          <Link
            href={`/${store.variable}/${store.sitioweb}`}
            className={
              pathname == `/${store.variable}/${store.sitioweb}`
                ? "text-red-500"
                : ""
            }
          >
            <HomeIcon className="w-6 h-6" />
          </Link>
        </Button>
        <Button variant="ghost">
          <Link
            href={`/${store.variable}/${store.sitioweb}/about`}
            className={
              pathname == `/${store.variable}/${store.sitioweb}/about`
                ? "text-red-500"
                : ""
            }
          >
            <BadgeInfo className="w-6 h-6" />
          </Link>
        </Button>
        <Button variant="ghost">
          <Link
            href={`/${store.variable}/${store.sitioweb}/search`}
            className={
              pathname == `/${store.variable}/${store.sitioweb}/search`
                ? "text-red-500"
                : ""
            }
          >
            <Search className="w-6 h-6" />
          </Link>
        </Button>
        <Button
          className={
            pathname == `/${store.variable}/${store.sitioweb}/carrito`
              ? "text-red-500"
              : ""
          }
          variant="ghost"
          disabled={cantidad == 0}
        >
          <CarritoButton
            cantidad={cantidad}
            href={`/${store.variable}/${store.sitioweb}/carrito`}
          />{" "}
        </Button>
        <NavigationMenu view="bottom-full">
          <NavigationMenuList>
            <CurrencySelector store={store} dispatchStore={dispatchStore} />
          </NavigationMenuList>
        </NavigationMenu>
      </footer>
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

function ListIcon(props) {
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
      <line x1="8" x2="21" y1="6" y2="6" />
      <line x1="8" x2="21" y1="12" y2="12" />
      <line x1="8" x2="21" y1="18" y2="18" />
      <line x1="3" x2="3.01" y1="6" y2="6" />
      <line x1="3" x2="3.01" y1="12" y2="12" />
      <line x1="3" x2="3.01" y1="18" y2="18" />
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
