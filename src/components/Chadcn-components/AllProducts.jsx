"use client";
import React, { useEffect, useState, useRef } from "react";
import { useContext } from "react";
import MapProducts from "./MapProducts";
import { Button } from "@/components/ui/button";
import { LayoutList, ChevronsRight } from "lucide-react";
import { MyContext } from "@/context/MyContext";

export default function AllProducts({ sectionRefs }) {
  const [category, setcategory] = useState([]);
  const { store, dispatchStore } = useContext(MyContext);
  useEffect(() => {
    setcategory(ExtraerCategoria(store, store.products));
  }, [store]);

  return (
    <>
      {category.map((cat, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md p-1 mb-4"
          id={`${cat.split(" ").join("_")}`}
        >
          <h3 className="flex items-center bg-background mb-4 p-2">
            <div className="text-xl font-bold flex justify-between items-center w-full  line-clamp-1">
              {cat}
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
              .filter((prod) => prod.caja === cat)
              .sort((a, b) => a.order - b.order)
              .map((prod, ind) => (
                <MapProducts
                  prod={prod}
                  key={ind}
                  store={store}
                  dispatchStore={dispatchStore}
                />
              ))}
          </div>
        </div>
      ))}
      {store.products.filter((obj) => !store.categoria.includes(obj.caja))
        .length >= 1 && (
        <div className="bg-white rounded-lg shadow-md p-1 mb-4">
          <h3 className="sticky top-16 z-[5]  bg-background text-xl font-bold mb-4">
            Otras Ofertas
          </h3>
          <div className="grid grid-cols-2 gap-1">
            {store.products
              .filter((obj) => !store.categoria.includes(obj.caja))
              .map((prod, ind) => (
                <MapProducts
                  prod={prod}
                  key={ind}
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
function ExtraerCategoria(data, products) {
  const categoriaProducts = [...new Set(products.map((prod) => prod.caja))];

  const newCat = data.categoria.filter((prod) =>
    categoriaProducts.includes(prod)
  );
  return newCat;
}
