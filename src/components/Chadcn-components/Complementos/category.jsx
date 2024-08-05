"use client";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "@/context/createContext";
import Image from "next/image";
import { CircleArrowRight } from "lucide-react";

export default function Category({ products }) {
  const { webshop, setwebshop } = useContext(ThemeContext);
  const [category, setcategory] = useState([]);

  useEffect(() => {
    setcategory(ExtraerCategoria(webshop.store, products));
  }, [products]);

  return (
    <section className="mb-8" id="categoryProvince">
      {category.slice(0, 1).map((cat, ind) => (
        <div key={ind}>
          <div className="flex items-center mb-4">
            <div>
              <Link
                className="text-2xl font-bold"
                href={`/${cat.variable}/${cat.sitioweb}${
                  cat.variable == "t" ? "/products" : ""
                }`}
                prefetch={false}
              >
                {cat.categoria} en{" "}
              </Link>
              <Link
                className="text-2xl font-bold"
                href={`/provincias/${String(cat.Provincia)
                  .split(" ")
                  .join("_")
                  .split("ü")
                  .join("u")}`}
                prefetch={false}
              >
                {cat.provincia}
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {BuscarProductos(products, cat)
              .slice(0, 4)
              .map((obj, ind1) => (
                <Link
                  key={ind1}
                  href={`/${obj.variable}/${obj.sitioweb}`}
                  className="group"
                  prefetch={false}
                >
                  <div className="relative h-[200px] bg-cover bg-center rounded-lg overflow-hidden">
                    <Image
                      src={
                        obj.image
                          ? obj.image
                          : "https://res.cloudinary.com/dbgnyc842/image/upload/v1721753647/kiphxzqvoa66wisrc1qf.jpg"
                      }
                      alt={
                        obj.name
                          ? obj.name
                          : "https://res.cloudinary.com/dbgnyc842/image/upload/v1721753647/kiphxzqvoa66wisrc1qf.jpg"
                      }
                      width={300}
                      height={200}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                      <h3 className="text-lg md:text-xl font-bold text-white">
                        {obj.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
          <Link
            href={`/provincias/${String(cat.Provincia)
              .split(" ")
              .join("_")
              .split("ü")
              .join("u")}`}
            className="text-primary  font-bold  p-4 flex items-center hover:animate-pulse"
            prefetch={false}
          >
            Ir a la tienda <CircleArrowRight className="ml-2 h-6 w-6" />
          </Link>
        </div>
      ))}
    </section>
  );
}
function ExtraerCategoria(data, products) {
  const categoriaProducts = [...new Set(products.map((prod) => prod.caja))];
  const repeticiones = contarRepeticiones(products.map((prod) => prod.caja));
  const categorias_unicas = [
    ...new Set(data.flatMap((tienda) => tienda.categoria)),
  ];
  const newCat = categorias_unicas.filter(
    (prod) => repeticiones[prod] >= 4 && categoriaProducts.includes(prod)
  );

  const newArray = newCat.map((obj) => {
    const [tienda1] = data.filter((tienda) => tienda.categoria.includes(obj));
    return {
      provincia: tienda1.Provincia,
      tienda: tienda1.name,
      sitioweb: tienda1.sitioweb,
      variable: tienda1.variable,
      categoria: obj,
    };
  });
  return desordenarArray(newArray);
}
function BuscarProductos(products, category) {
  return products.filter((obj) => obj.caja == category.categoria);
}
function desordenarArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Índice aleatorio
    // Intercambiar elementos
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
function contarRepeticiones(array) {
  const repeticiones = {};

  for (let i = 0; i < array.length; i++) {
    const elemento = array[i];

    if (repeticiones[elemento]) {
      repeticiones[elemento]++;
    } else {
      repeticiones[elemento] = 1;
    }
  }

  return repeticiones;
}
