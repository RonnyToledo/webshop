"use client";
import { useState, useEffect, useContext } from "react";
import { Search, ChevronRightIcon, User, Star } from "lucide-react";
import { MyContext } from "@/context/MyContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Fuse from "fuse.js";
import Link from "next/link";
import { StarCount } from "../globalFunctions/components";
import { Promedio } from "../globalFunctions/function";

const options = {
  includeScore: true,
  threshold: 0.4,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: ["title"],
};

export function ProductSearchComponent() {
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
  }, [store, categoria]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center space-x-2 mb-6">
        <Input
          type="text"
          placeholder="Search products..."
          value={store.search}
          onChange={(e) =>
            dispatchStore({ type: "Search", payload: e.target.value })
          }
          className="flex-grow"
        />
      </div>
      <div className="flex space-x-2 mb-6 overflow-x-auto">
        {["All", ...store.categoria].map((category) => (
          <Button
            key={category}
            variant={categoria === category ? "default" : "outline"}
            onClick={() => setCategoria(category)}
            className="whitespace-nowrap"
          >
            {category}
          </Button>
        ))}
      </div>
      <div className="space-y-4">{renderResults(store, ListSearch)}</div>
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
    <div className="bg-white rounded-lg mr-4 ml-4 px-4 py-8 col-span-1 ">
      <h2 className="mb-4 text-2xl font-bold">{title}</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {products.map((product, ind) => (
          <ProductCard key={ind} product={product} />
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product }) {
  return (
    <Card key={product.id}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <Image
            src={
              product.image ||
              "https://res.cloudinary.com/dbgnyc842/image/upload/v1725399957/xmlctujxukncr5eurliu.png"
            }
            alt={product.name}
            className="w-24 h-24 object-cover rounded-2xl"
            width={200}
            height={200}
          />
          <div className="flex-grow">
            <h3 className="font-semibold">{product.title}</h3>
            <p className="text-sm text-gray-600">{product.caja}</p>
            <p className="font-bold mt-1">${product.price.toFixed(2)}</p>
            <div className="flex items-center mt-1">
              <StarCount array={product.coment} campo={"star"} />

              <span className="text-sm ml-1">
                {Number(Promedio(product.coment, "star")).toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MessageWithAnimation({ message }) {
  return (
    <div className="bg-white rounded-lg mr-4 ml-4 px-4 py-8 col-span-1 ">
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