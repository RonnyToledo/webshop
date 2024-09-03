"use client";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useContext, useEffect } from "react";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select";
import Image from "next/image";
import Fuse from "fuse.js";
import { MyContext } from "@/context/MyContext";

const options = {
  includeScore: true,
  // Ajusta estos valores según tus necesidades
  threshold: 0.4,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: ["title"],
};

export default function Search() {
  const { store, dispatchStore } = useContext(MyContext);
  const [categoria, setCategoria] = useState("All");
  const [ListSearch, setListSearch] = useState([]);

  useEffect(() => {
    const fuse = new Fuse(
      obtenerMejoresYPeoresProductos(store.products),
      options
    );
    if (store.search) {
      if (categoria == "All") {
        const results = fuse.search(store.search);
        setListSearch(results.map((obj) => obj.item));
      } else {
        const fuse1 = new Fuse(
          obtenerMejoresYPeoresProductos(store.products).filter(
            (obj) => obj.caja == categoria
          ),
          options
        );
        const results = fuse1.search(store.search);
        setListSearch(results.map((obj) => obj.item));
      }
    } else {
      if (categoria == "All") {
        setListSearch([]);
      } else {
        setListSearch(
          obtenerMejoresYPeoresProductos(store.products).filter(
            (obj) => obj.caja == categoria
          )
        );
      }
    }
  }, [store.search, categoria]);
  console.log(ListSearch);

  return (
    <div className="bg-gray-100 text-foreground">
      <header className="sticky top-16 z-40 w-full  backdrop-blur-sm">
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="relative flex-1 max-w-md">
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full rounded-full bg-muted px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              value={store.search}
              onChange={(e) => {
                dispatchStore({
                  type: "Search",
                  payload: e.target.value,
                });
              }}
            />
            <div className="absolute inset-y-0 right-2 flex items-center">
              <SearchIcon className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </div>
      </header>
      <main className=" mx-auto max-w-6xl sm:px-6 lg:px-8">
        <div className=" grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className=" bg-white rounded-lg mr-4 ml-4 px-4 py-8 col-span-1 md:col-span-2 lg:col-span-1">
            <h2 className="mb-4 text-2xl font-bold">Categories</h2>
            <div className="flex items-center justify-between mt-2">
              <Select onValueChange={(value) => setCategoria(value)}>
                <SelectTrigger
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <span className="sr-only">Filtrar una categoria</span>
                  <SelectValue placeholder="Escoge una Categoria a Filtrar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">Todas</SelectItem>
                  {store.categoria.map((ddd, index3) => (
                    <SelectItem key={index3} value={ddd}>
                      {ddd}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {store.search || ListSearch.length > 0 ? (
            !(ListSearch.length > 0) ? (
              <div className=" bg-white rounded-lg mr-4 ml-4 px-4 py-8  col-span-1 md:col-span-2 lg:col-span-2">
                <h2 className="flex mb-4 text-2xl font-bold">
                  No coinciden elementos
                  <div className="flex h-5 ml-1">
                    <span className="animate-bounce ">.</span>
                    <span className="animate-bounce delay-100">.</span>
                    <span className="animate-bounce delay-200">.</span>
                    <span className="animate-bounce delay-300">.</span>
                  </div>
                </h2>
              </div>
            ) : (
              <div className=" bg-white rounded-lg mr-4 ml-4 px-4 py-8  col-span-1 md:col-span-2 lg:col-span-2">
                <h2 className="flex mb-4 text-2xl font-bold">Resultados</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {ListSearch.map((obj, ind) => (
                    <div key={ind} className="rounded-lg  p-4 shadow-sm">
                      <Link
                        href={`/${store.variable}/${store.sitioweb}/products/${obj.productId}`}
                        className="flex items-center justify-between"
                        prefetch={false}
                      >
                        <Image
                          src={
                            obj.image
                              ? obj.image
                              : "https://res.cloudinary.com/dbgnyc842/image/upload/v1725399957/xmlctujxukncr5eurliu.png"
                          }
                          alt={obj.title ? obj.title : "Producto"}
                          width={300}
                          height={300}
                          className=" h-20 w-auto rounded-full object-cover transition-opacity group-hover:opacity-80"
                          style={{ aspectRatio: "300/300", objectFit: "cover" }}
                        />
                        <h3 className="m-2 text-lg font-medium">{obj.title}</h3>

                        <ChevronRightIcon className="h-5 w-5 text-muted-foreground" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )
          ) : (
            <div className=" bg-white rounded-lg m-4 px-4 py-8  col-span-1 md:col-span-2 lg:col-span-2">
              <h2 className="mb-4 text-2xl font-bold">Popular Products</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {obtenerMejoresYPeoresProductos(store.products)
                  .slice(0, 3)
                  .map((obj, ind) => (
                    <div key={ind} className="rounded-lg  p-4 shadow-sm">
                      <Link
                        href={`/${store.variable}/${store.sitioweb}/products/${obj.productId}`}
                        className="flex items-center justify-between"
                        prefetch={false}
                      >
                        <Image
                          src={
                            obj.image
                              ? obj.image
                              : "https://res.cloudinary.com/dbgnyc842/image/upload/v1725399957/xmlctujxukncr5eurliu.png"
                          }
                          alt={obj.title ? obj.title : "Producto"}
                          width={300}
                          height={300}
                          className=" h-20 w-auto rounded-full object-cover transition-opacity group-hover:opacity-80"
                          style={{ aspectRatio: "300/300", objectFit: "cover" }}
                        />
                        <h3 className="m-2 text-lg font-medium">{obj.title}</h3>

                        <ChevronRightIcon className="h-5 w-5 text-muted-foreground" />
                      </Link>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
const obtenerMejoresYPeoresProductos = (productos) => {
  const ahora = new Date();

  // Calcular visitas por día solo para productos con más de una semana de creados
  const productosConVisitasPorDia = productos
    .map((producto) => {
      const fechaCreado = new Date(producto.creado);
      const dias = (ahora - fechaCreado) / (1000 * 60 * 60 * 24); // Días desde la creación

      // Solo considerar productos con más de 7 días de creados
      if (dias > 7) {
        const visitasPorDia = producto.visitas / dias;
        return { ...producto, visitasPorDia };
      }
      return null; // Retornar null para productos que no cumplen la condición
    })
    .filter((producto) => producto !== null); // Filtrar los nulls

  // Ordenar productos por visitas por día
  productosConVisitasPorDia.sort((a, b) => b.visitasPorDia - a.visitasPorDia);
  return productosConVisitasPorDia;
};

function ChevronRightIcon(props) {
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
      <path d="m9 18 6-6-6-6" />
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

function ShoppingBagIcon(props) {
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
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
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
