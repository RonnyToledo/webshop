"use client";
import React, { useState, useEffect, useContext, useRef } from "react";
import { MyContext } from "@/context/MyContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Fuse from "fuse.js";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { MapProducts } from "./allProduct";

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
    <div className="container mx-auto p-4 mt-6">
      <div className="flex items-center space-x-2 mb-6">
        <Input
          type="text"
          value={store.search}
          placeholder="Search products..."
          autoFocus
          onChange={(e) =>
            dispatchStore({ type: "Search", payload: e.target.value })
          }
          className="flex-grow"
        />
      </div>
      <div className="grid">
        <ScrollArea className="whitespace-nowrap">
          <div className="flex space-x-2 mb-6 overflow-x-auto items-center w-max">
            {[
              { name: "All", id: "2fb35ac2-5d35-4000-b877-9839ef39a5e6" },
              ...store.categorias,
            ].map((category, index) => (
              <Button
                key={index}
                variant={categoria === category.id ? "default" : "outline"}
                onClick={() => setCategoria(category.id)}
                className="whitespace-nowrap"
              >
                {category.name}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <div className="space-y-4">{RenderResults(store, ListSearch)}</div>
    </div>
  );
}
function RenderResults(store, ListSearch) {
  const sectionRefs = useRef([]);
  if (!store.search && ListSearch.length === 0) {
    return (
      <MapProducts
        prod={obtenerMejoresYPeoresProductos(store.products).slice(0, 4)}
        title={"Popular Products"}
        description={""}
        sectionRefs={sectionRefs}
        ind={1}
      />
    );
  }
  if (ListSearch.length === 0) {
    return <MessageWithAnimation message="No coinciden elementos" />;
  }
  return (
    <MapProducts
      prod={ListSearch}
      title={"Resultados"}
      description={""}
      sectionRefs={sectionRefs}
      ind={1}
    />
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
      return { ...producto, visitasPorDia: producto.visitas / dias };
    })
    .filter(Boolean)
    .sort((a, b) => b.visitasPorDia - a.visitasPorDia);
}
