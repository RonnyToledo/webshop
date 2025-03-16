"use client";
import React from "react";
import { useState, useEffect, useContext, useRef } from "react";
import { MyContext } from "@/context/MyContext";
import Image from "next/image";
import Link from "next/link";
import { ButtonOfCart } from "../globalFunctions/components";
import { Button } from "../ui/button";
import { ExtraerCategorias, Promedio } from "../globalFunctions/function";
import { Star } from "lucide-react";
import RemoveShoppingCartOutlinedIcon from "@mui/icons-material/RemoveShoppingCartOutlined";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";

export default function AllProduct({ sectionRefs }) {
  const pathname = usePathname();
  const { store } = useContext(MyContext);
  return (
    <>
      {store.categoria
        .filter((obj) => obj.subtienda)
        .sort((a, b) => a.order - b.order)
        .map((obj) => (
          <Card
            key={obj.id}
            className="my-4"
            id={`${obj.name.replace(/\s+/g, "_")}`}
          >
            <CardHeader className="flex justify-between p-4">
              <div className="p-1">
                <h3 className="text-lg font-semibold line-clamp-1">
                  {obj.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {obj.description}
                </p>
              </div>
            </CardHeader>
            <CardContent className="p-0" key={obj.id}>
              <div className="mx-4 my-2 rounded-2xl ">
                <Image
                  src={
                    obj.image ||
                    "https://res.cloudinary.com/dbgnyc842/image/upload/v1725399957/xmlctujxukncr5eurliu.png"
                  }
                  alt={obj.name || "Name"}
                  height="300"
                  width="300"
                  className="w-full rounded-2xl aspect-video object-cover"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <div className="p-1">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {store.products.filter((prod) => prod.caja == obj.id).length}{" "}
                  Productos
                </p>
              </div>
              <Button asChild className="rounded-full ">
                <Link href={`${pathname}/category/${obj.id}`}>
                  <ArrowRight />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      {ExtraerCategorias(
        store.categoria.filter((obj) => !obj.subtienda),
        store.products
      ).map((categoria, ind) => (
        <MapProducts
          key={ind}
          prod={store.products.filter((obj) => obj.caja == categoria.id)}
          title={categoria.name}
          description={categoria.description}
          sectionRefs={sectionRefs}
          ind={ind}
        />
      ))}
      {store.products.some(
        (prod) => !store.categoria.map((obj) => obj.id).includes(prod.caja)
      ) && (
        <MapProducts
          prod={store.products
            .filter(
              (prod) =>
                !store.categoria.map((obj) => obj.id).includes(prod.caja)
            )
            .sort((a, b) => a.order - b.order)}
          sectionRefs={sectionRefs}
          description={""}
          title={"Otros productos"}
          ind={ExtraerCategorias(store.categoria, store.products).length}
        />
      )}
    </>
  );
}
const ReturnImage = () => {
  return "https://res.cloudinary.com/dbgnyc842/image/upload/v1725399957/xmlctujxukncr5eurliu.png";
};
function MapProducts({ prod, title, sectionRefs, ind, description }) {
  // Estado para el criterio de ordenamiento
  const [Products, setProducts] = useState(prod);
  useEffect(() => {
    setProducts(prod);
  }, [prod]);

  return (
    <div
      className="flex flex-col w-full mt-4 p-2 md:p-4 bg-white rounded-lg shadow-md border"
      id={`${title.replace(/\s+/g, "_")}`}
    >
      <div
        className="flex justify-start items-center sticky  top-12 md:top-16 bg-white z-[10]"
        ref={(el) => {
          sectionRefs.current[ind] = el;
        }}
      >
        <h2 className="text-xl pt-4 font-bold font-serif">{title}</h2>
      </div>
      <div>
        <h2 className="text-sm  font-serif">{description}</h2>
      </div>
      <div className="grid grid-cols-2 gap-2 grid-flow-row-dense">
        {Products.sort((a, b) => {
          return prod.coment?.promedio == prod.coment?.promedio
            ? a.order - b.order
            : prod.coment?.promedio - prod.coment?.promedio;
        }).map((prod, index) => (
          <ProductGrid key={index} prod={prod} />
        ))}
      </div>
    </div>
  );
}

export const ProductGrid = ({ prod }) => {
  const { store, dispatchStore } = useContext(MyContext);
  const [isAnimating, setIsAnimating] = useState(false);
  const [imageClone, setImageClone] = useState(null); // Para almacenar la copia de la imagen
  const productImageRef = useRef(null);
  const AnimationCart = () => {};
  return (
    <div
      className={`rounded-lg relative my-2 ${prod.span ? "col-span-2" : ""}`}
    >
      <div className="bg-cover bg-center group rounded-2xl">
        <Link
          className={`relative rounded-2xl`}
          href={`/t/${store.sitioweb}/products/${prod.productId}`}
        >
          <div
            className="absolute flex justify-center items-center w-full h-full"
            style={{
              height: `${imageClone?.height}px`,
              width: `${imageClone?.width}px`,
            }}
          ></div>
          <div className="w-full h-full overflow-hidden rounded-lg">
            <Image
              ref={productImageRef}
              id={`product-img-${prod.productId}`}
              src={
                prod.image ||
                store.urlPoster ||
                "https://res.cloudinary.com/dbgnyc842/image/upload/v1725399957/xmlctujxukncr5eurliu.png"
              }
              alt={prod.title || "Product"}
              className={`w-full group-hover:scale-105 transition-transform  object-cover z-[1]  ${
                prod.span ? "h-52" : "h-auto"
              }`}
              height="300"
              width="300"
              style={{
                aspectRatio: "4/5",
                objectFit: "cover",
                filter: prod.agotado ? "grayscale(100%)" : "grayscale(0)",
              }}
              onLoad={() => ReturnImage()}
            />
          </div>
          {prod.oldPrice > prod.price && (
            <DiscountFunction price={prod.price} oldPrice={prod.oldPrice} />
          )}
          <HanPasadoSieteDias fecha={prod.creado} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-2 md:p-4 rounded-2xl">
            <p className="text-sm text-white font-semibold max-h-10 line-clamp-2 ">
              {prod.title}
            </p>
          </div>
        </Link>
      </div>
      <div className="flex justify-between items-center m-2 text-xs">
        <div className="flex">
          <Star className={`w-4 h-4 text-yellow-400 fill-current`} />{" "}
          {`(${Number(prod.coment?.promedio).toFixed(1)})`}
        </div>
        <p className="flex text-xs ">
          ${Number(prod.price).toFixed(2)} {store.moneda_default.moneda}
        </p>
      </div>
      <div className="grid grid-cols-6 overflow-hidden">
        <div
          className="h-7 m-2 text-gray-700 line-clamp-2 col-span-4"
          style={{ fontSize: "10px" }}
        >
          {prod.descripcion || "..."}
        </div>
        <div className="flex justify-end col-span-2">
          {!prod.agotado ? (
            <ButtonOfCart prod={prod} AnimationCart={AnimationCart} />
          ) : (
            <Button
              className="flex justify-evenly rounded-full"
              size="sm"
              disabled
            >
              <RemoveShoppingCartOutlinedIcon />
            </Button>
          )}
        </div>
      </div>
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
        <div className="absolute top-0 left-0 bg-gray-800 text-white font-bold rounded-br-2xl rounded-tl-2xl p-2 text-xs mb-1">
          New
        </div>
      )}
    </>
  );
}
function DiscountFunction({ price, oldPrice }) {
  return (
    <div className="absolute top-0 right-0 rounded-bl-2xl rounded-tr-2xl bg-gray-800 text-red-600 font-bold p-2 text-xs mb-1">
      {`-$${(oldPrice - price).toFixed(2)}`}
    </div>
  );
}
