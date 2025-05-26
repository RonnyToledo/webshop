"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "@/context/MyContext";
import RemoveShoppingCartOutlinedIcon from "@mui/icons-material/RemoveShoppingCartOutlined";
import { ButtonOfCart } from "../globalFunctions/components";
import Link from "next/link";
import { ExtraerCategorias, Promedio } from "../globalFunctions/function";
import { usePathname } from "next/navigation";

export default function AllCategoryShowcase() {
  const { store, dispatchStore } = useContext(MyContext);
  const pathname = usePathname();
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[300px] rounded-b-xl overflow-hidden mb-6 bg-white">
        <Image
          src={
            store?.banner ||
            store?.urlPoster ||
            "https://res.cloudinary.com/dbgnyc842/image/upload/v1725399957/xmlctujxukncr5eurliu.png"
          }
          alt={store?.name || "Tienda"}
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center p-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4  line-clamp-2">
            {store?.name}
          </h1>
          <p className="text-xl text-white max-w-2xl line-clamp-3">
            Revise mas las categorias de productos en la tienda
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="bg-white rounded-xl m-2 p-2">
        <h1 className="text-2xl text-center font-bold  mb-2  line-clamp-2">
          Todas las categorias
        </h1>
        <div className="grid gap-1 grid-flow-row-dense">
          {ExtraerCategorias(store.categorias, store.products).map((obj) => (
            <Link
              key={obj.id}
              className="relative h-[200px] rounded-xl overflow-hidden mb-6 bg-white"
              href={`${pathname}/${obj.id}`}
            >
              <Image
                src={
                  obj?.image ||
                  store?.urlPoster ||
                  "https://res.cloudinary.com/dbgnyc842/image/upload/v1725399957/xmlctujxukncr5eurliu.png"
                }
                alt={obj?.name || "Tienda"}
                layout="fill"
                objectFit="cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center p-6">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2  line-clamp-2">
                  {obj?.name}
                </h1>
                <p className="text-sm  text-white  text-muted-foreground line-clamp-2">
                  {store.products.filter((prod) => prod.caja == obj.id).length}{" "}
                  Productos
                </p>
                <p className="text-xl text-white max-w-2xl line-clamp-3">
                  {obj?.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
const AnimationCart = () => {};
