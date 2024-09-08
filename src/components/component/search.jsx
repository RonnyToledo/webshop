"use client";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select";
import Image from "next/image";
import Fuse from "fuse.js";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "@/context/MyContext";

const options = {
  includeScore: true,
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
    const productos = obtenerMejoresYPeoresProductos(store.products);
    const fuse = new Fuse(productos, options);

    if (store.search) {
      const results = fuse.search(store.search);
      const filteredResults =
        categoria === "All"
          ? results.map((obj) => obj.item)
          : results
              .filter((obj) => obj.item.caja === categoria)
              .map((obj) => obj.item);

      setListSearch(filteredResults);
    } else {
      const filteredProducts =
        categoria === "All"
          ? []
          : productos.filter((obj) => obj.caja === categoria);
      setListSearch(filteredProducts);
    }
  }, [store.search, categoria]);

  return (
    <div className="bg-gray-100 text-foreground">
      <HeaderSearch dispatchStore={dispatchStore} searchValue={store.search} />
      <main className="mx-auto max-w-6xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <CategorySelector
            categorias={store.categoria}
            setCategoria={setCategoria}
          />
          {renderResults(store, ListSearch)}
        </div>
      </main>
    </div>
  );
}

function HeaderSearch({ dispatchStore, searchValue }) {
  return (
    <header className="sticky top-16 z-40 w-full backdrop-blur-sm">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="relative flex-1 max-w-md">
          <Input
            type="search"
            placeholder="Search products..."
            className="w-full rounded-full bg-muted px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            value={searchValue}
            onChange={(e) =>
              dispatchStore({ type: "Search", payload: e.target.value })
            }
          />
          <div className="absolute inset-y-0 right-2 flex items-center">
            <SearchIcon className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </div>
    </header>
  );
}

function CategorySelector({ categorias, setCategoria }) {
  return (
    <div className="bg-white rounded-lg px-4 py-8 col-span-1 md:col-span-2 lg:col-span-1">
      <h2 className="mb-4 text-2xl font-bold">Categories</h2>
      <Select onValueChange={(value) => setCategoria(value)}>
        <SelectTrigger
          size="icon"
          className="text-muted-foreground hover:text-foreground"
        >
          <SelectValue placeholder="Escoge una Categoría a Filtrar" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">Todas</SelectItem>
          {categorias.map((categoria, index) => (
            <SelectItem key={index} value={categoria}>
              {categoria}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function renderResults(store, ListSearch) {
  if (!store.search && ListSearch.length === 0) {
    return (
      <ProductGrid
        title="Popular Products"
        products={obtenerMejoresYPeoresProductos(store.products).slice(0, 3)}
      />
    );
  }
  if (ListSearch.length === 0) {
    return <MessageWithAnimation message="No coinciden elementos" />;
  }
  return <ProductGrid title="Resultados" products={ListSearch} />;
}

function ProductGrid({ title, products }) {
  return (
    <div className="bg-white rounded-lg mr-4 ml-4 px-4 py-8 col-span-1 md:col-span-2 lg:col-span-2">
      <h2 className="mb-4 text-2xl font-bold">{title}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, ind) => (
          <ProductCard key={ind} product={product} />
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product }) {
  return (
    <div className="rounded-lg p-4 shadow-sm">
      <Link
        href={`/${product.productId}`}
        className="flex items-center justify-between"
        prefetch={false}
      >
        <Image
          src={
            product.image ||
            "https://res.cloudinary.com/dbgnyc842/image/upload/v1725399957/xmlctujxukncr5eurliu.png"
          }
          alt={product.title || "Producto"}
          width={300}
          height={300}
          className="h-20 w-auto rounded-full object-cover"
        />
        <h3 className="m-2 text-lg font-medium">{product.title}</h3>
        <ChevronRightIcon className="h-5 w-5 text-muted-foreground" />
      </Link>
    </div>
  );
}

function MessageWithAnimation({ message }) {
  return (
    <div className="bg-white rounded-lg mr-4 ml-4 px-4 py-8 col-span-1 md:col-span-2 lg:col-span-2">
      <h2 className="flex mb-4 text-2xl font-bold">
        {message}
        <div className="flex h-5 ml-1">
          <span className="animate-bounce">.</span>
          <span className="animate-bounce delay-100">.</span>
          <span className="animate-bounce delay-200">.</span>
          <span className="animate-bounce delay-300">.</span>
        </div>
      </h2>
    </div>
  );
}

function obtenerMejoresYPeoresProductos(productos) {
  const ahora = new Date();
  return productos
    .map((producto) => {
      const dias = (ahora - new Date(producto.creado)) / (1000 * 60 * 60 * 24);
      return dias > 7
        ? { ...producto, visitasPorDia: producto.visitas / dias }
        : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.visitasPorDia - a.visitasPorDia);
}

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
