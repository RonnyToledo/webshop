"use client";
import React, { useEffect, useState, useContext } from "react";
import MapProducts from "./MapProducts";
import { LayoutList } from "lucide-react";
import { MyContext } from "@/context/MyContext";

export default function AllProducts({ sectionRefs }) {
  const [categories, setCategories] = useState([]);
  const { store, dispatchStore } = useContext(MyContext);

  useEffect(() => {
    setCategories(ExtraerCategorias(store, store.products));
  }, [store]);
  console.log(
    store.products.some(
      (prod) => !store.categoria.map((obj) => obj.name).includes(prod.caja)
    )
  );
  return (
    <>
      {categories.map((category, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md p-1 mb-4"
          id={`${category.replace(/\s+/g, "_")}`}
        >
          <h3 className="flex items-center bg-background mb-4 p-2">
            <div className="text-xl font-bold flex justify-between items-center w-full line-clamp-1">
              {category}
              <LayoutList className="h-5 w-5" />
            </div>
          </h3>
          <div
            className="grid grid-cols-2 gap-1"
            ref={(el) => {
              sectionRefs.current[index] = el;
            }}
          >
            {store.products
              .filter((prod) => prod.caja === category)
              .sort((a, b) => a.order - b.order)
              .map((prod, ind) => (
                <MapProducts
                  key={ind}
                  prod={prod}
                  store={store}
                  dispatchStore={dispatchStore}
                />
              ))}
          </div>
        </div>
      ))}

      {/* Productos que no pertenecen a ninguna categoría */}
      {store.products.some(
        (prod) => !store.categoria.map((obj) => obj.name).includes(prod.caja)
      ) && (
        <div className="bg-white rounded-lg shadow-md p-1 mb-4">
          <h3 className="sticky top-16 z-[5] bg-background text-xl font-bold mb-4">
            Otras Ofertas
          </h3>
          <div className="grid grid-cols-2 gap-1">
            {store.products
              .filter(
                (prod) =>
                  !store.categoria.map((obj) => obj.name).includes(prod.caja)
              )
              .map((prod, ind) => (
                <MapProducts
                  key={ind}
                  prod={prod}
                  store={store}
                  dispatchStore={dispatchStore}
                />
              ))}
          </div>
        </div>
      )}
    </>
  );
}

// Función para extraer categorías únicas basadas en los productos
function ExtraerCategorias(store, products) {
  const categoriasProductos = new Set(products.map((prod) => prod.caja));
  return store.categoria.filter((cat) => categoriasProductos.has(cat));
}
