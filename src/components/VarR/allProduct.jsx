"use client";
import React from "react";
import { useState, useEffect, useContext, useRef } from "react";
import { MyContext } from "@/context/MyContext";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";
import {
  StarCount,
  ButtonOfCart,
  IconCartAnimation,
} from "../globalFunctions/components";
import { Button } from "../ui/button";
import { ExtraerCategorias } from "../globalFunctions/function";

export default function AllProduct({ sectionRefs }) {
  const { store, dispatchStore } = useContext(MyContext);
  return (
    <>
      {ExtraerCategorias(store, store.products).map((categoria, ind) => (
        <div
          key={ind}
          className="flex flex-col w-full mt-4 p-2 md:p-4 bg-white rounded-lg shadow-md"
          id={`${categoria.replace(/\s+/g, "_")}`}
        >
          <div
            className="flex justify-start mt-4"
            ref={(el) => {
              sectionRefs.current[ind] = el;
            }}
          >
            <h2 className="text-lg font-semibold">{categoria}</h2>
          </div>
          <MapProducts
            prod={store.products.filter((obj) => obj.caja == categoria)}
            store={store}
            title={categoria}
          />
        </div>
      ))}
      {store.products.some((prod) => !store.categoria.includes(prod.caja)) && (
        <div className="flex flex-col w-full mt-4 p-2 md:p-4 bg-white rounded-lg shadow-md">
          <div className="flex justify-start mt-4">
            <h2 className="text-lg font-semibold">Otros productos</h2>
          </div>
          <MapProducts
            prod={store.products.filter(
              (prod) => !store.categoria.includes(prod.caja)
            )}
            store={store}
          />
        </div>
      )}
    </>
  );
}
const ReturnImage = () => {
  return "https://res.cloudinary.com/dbgnyc842/image/upload/v1725399957/xmlctujxukncr5eurliu.png";
};
function MapProducts({ prod, store }) {
  return (
    <div className="grid grid-cols-2 gap-1">
      {prod
        .sort((a, b) => a.order - b.order)
        .map((prod, index) => (
          <Product key={index} prod={prod} />
        ))}
    </div>
  );
}

const Product = ({ prod }) => {
  const { store, dispatchStore } = useContext(MyContext);
  const [isAnimating, setIsAnimating] = useState(false);
  const [imageClone, setImageClone] = useState(null); // Para almacenar la copia de la imagen
  const productImageRef = useRef(null);
  const AnimationCart = () => {
    setIsAnimating(true); // Iniciar animación
    const productImageElement = productImageRef.current;
    const stickyElement = document.getElementById("sticky-footer"); // Elemento sticky

    if (productImageElement && stickyElement) {
      const productRect = productImageElement.getBoundingClientRect();
      const stickyRect = stickyElement.getBoundingClientRect();

      const finalX = stickyRect.left - productRect.left;
      const finalY = stickyRect.top - productRect.top;

      // Crear una copia temporal de la imagen para la animación
      setImageClone({
        initialX: productRect.left,
        initialY: productRect.top,
        width: productRect.width,
        height: productRect.height,
        finalX,
        finalY,
      });
    }
  };
  return (
    <div className="p-2 md:p-4 rounded-2xl relative">
      <div className="bg-cover bg-center group rounded-2xl">
        <Link
          className={`relative rounded-2xl`}
          href={`/${store.variable}/${store.sitioweb}/products/${prod.productId}`}
        >
          <div
            className="absolute flex justify-center items-center w-full h-full"
            style={{
              height: `${imageClone?.height}px`,
              width: `${imageClone?.width}px`,
            }}
          >
            <IconCartAnimation
              imageClone={imageClone}
              prod={prod}
              store={store}
              isAnimating={isAnimating}
              setIsAnimating={setIsAnimating}
              setImageClone={setImageClone}
            />
          </div>
          <div className="w-full h-full overflow-hidden rounded-2xl">
            <Image
              ref={productImageRef}
              id={`product-img-${prod.productId}`}
              src={
                prod.image ||
                store.urlPoster ||
                "https://res.cloudinary.com/dbgnyc842/image/upload/v1725399957/xmlctujxukncr5eurliu.png"
              }
              alt={prod.title || "Product"}
              className="w-full group-hover:scale-105 transition-transform block object-cover z-[1] rounded-2xl"
              height="300"
              width="200"
              style={{
                aspectRatio: "200/300",
                objectFit: "cover",
                filter: prod.agotado ? "grayscale(100%)" : "grayscale(0)",
              }}
              onLoad={() => ReturnImage()}
            />
          </div>

          <HanPasadoSieteDias fecha={prod.creado} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-2 md:p-8 rounded-2xl">
            <p className="text-sm text-white font-semibold h-10 line-clamp-2 ">
              {prod.title}
            </p>
          </div>
        </Link>
      </div>
      <div className="flex items-center m-2 justify-center">
        <StarCount array={prod.coment} campo={"star"} />
      </div>
      <p className="flex text-sm font-bold mb-1 justify-end">
        ${Number(prod.price).toFixed(2)} {store.moneda_default.moneda}
      </p>
      {!prod.agotado ? (
        <ButtonOfCart
          prod={prod}
          AnimationCart={AnimationCart}
          isAnimating={isAnimating}
        />
      ) : (
        <Button className="w-full" disabled>
          Agotado
        </Button>
      )}
    </div>
  );
};

function HanPasadoSieteDias({ fecha }) {
  const fechaEntrada = new Date(fecha);
  const fechaActual = new Date();
  const diferenciaEnDias = (fechaActual - fechaEntrada) / (1000 * 60 * 60 * 24);

  return (
    <>
      {diferenciaEnDias <= 7 && (
        <Badge className="absolute top-2 left-2 text-xs mb-1">New</Badge>
      )}
    </>
  );
}
