"use client";
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import Loading from "../component/loading";
import MapProducts from "@/components/Chadcn-components/MapProducts";
import { BackgroundGradient } from "../ui/background-gradient";

export default function AllProducts({ context }) {
  const { store, dispatchStore } = useContext(context);
  const [category, setcategory] = useState([]);

  useEffect(() => {
    setcategory(ExtraerCategoria(store, store.products));
    if (store.loading != 100) {
      return <Loading loading={store.loading} />;
    }
  }, [store]);

  return (
    <>
      {category.map((cat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-1 mb-4">
          <h3 className="text-xl font-bold mb-4 p-4">{cat}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
            {store.products
              .filter((prod) => prod.caja === cat)
              .map((prod, ind) => (
                <div key={prod.id}>
                  {prod.favorito ? (
                    <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900">
                      <MapProducts prod={prod} store={store} />
                    </BackgroundGradient>
                  ) : (
                    <MapProducts prod={prod} store={store} />
                  )}
                </div>
              ))}
          </div>
        </div>
      ))}
      {store.products.filter((obj) => !store.categoria.includes(obj.caja))
        .length >= 1 && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <h3 className="text-xl font-bold mb-4">Otras Ofertas</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
            {products
              .filter((obj) => !store.categoria.includes(obj.caja))
              .map((prod, ind) => (
                <div key={prod.id}>
                  {prod.favorito ? (
                    <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900">
                      <MapProducts prod={prod} store={store} />
                    </BackgroundGradient>
                  ) : (
                    <MapProducts prod={prod} store={store} />
                  )}
                </div>
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
