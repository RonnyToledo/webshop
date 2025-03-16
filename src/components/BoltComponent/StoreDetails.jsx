"use client";
import React, { useContext, useState, useEffect } from "react";
import { Store } from "lucide-react";
import Link from "next/link";
import { ThemeContext } from "./Navbar";

export function StoreDetails({ storeId, name, creado, price, productId }) {
  const { webshop, setwebshop } = useContext(ThemeContext);
  const [newStore, setnewStore] = useState({});

  useEffect(() => {
    const [a] = webshop.store.filter((str) => str.UUID == storeId);
    setnewStore(a);
  }, [webshop.store, storeId]);

  return (
    <>
      <h3 className="text-lg font-semibold text-gray-800 mb-2"></h3>
      <h3 className="text-lg font-semibold text-gray-800 mb-2 h-14 line-clamp-2">
        {name}
      </h3>
      <div className="flex  flex-col space-x-2 mb-3">
        <div className="flex gap-2">
          <Store className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600 line-clamp-1">
            {newStore?.name}
          </span>
        </div>

        <span className="text-sm text-gray-600">
          <relative-time lang="es" datetime={creado} no-title></relative-time>
        </span>
      </div>
      <div className="flex items-center space-x-2 mb-3"></div>
      <div className="flex justify-between items-center">
        <p className="text-purple-600 font-bold">${Number(price).toFixed(2)}</p>
        <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
          <Link href={`/t/${newStore.sitioweb}/products/${productId}`}>
            Ver detalles
          </Link>
        </button>
      </div>
    </>
  );
}
