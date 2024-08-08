"use client";
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import MapProducts2 from "./MapProducts2";

export default function AllProducts2({ context }) {
  const [category, setcategory] = useState([]);
  const { store, dispatchStore } = useContext(context);

  useEffect(() => {
    setcategory(ExtraerCategoria(store, store.products));
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
                <MapProducts2
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
          <h3 className="text-xl font-bold mb-4">Otras Ofertas</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
            {store.products
              .filter((obj) => !store.categoria.includes(obj.caja))
              .map((prod, ind) => (
                <MapProducts2
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
