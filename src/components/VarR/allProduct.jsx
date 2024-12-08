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
import { ExtraerCategorias, Promedio } from "../globalFunctions/function";
import { ListOrdered, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function AllProduct({ sectionRefs }) {
  const { store, dispatchStore } = useContext(MyContext);
  return (
    <>
      {ExtraerCategorias(store, store.products).map((categoria, ind) => (
        <MapProducts
          key={ind}
          prod={store.products.filter((obj) => obj.caja == categoria.name)}
          title={categoria.name}
          description={categoria.description}
          sectionRefs={sectionRefs}
          ind={ind}
        />
      ))}
      {store.products.some((prod) => !store.categoria.includes(prod.caja)) && (
        <MapProducts
          prod={store.products.filter(
            (prod) => !store.categoria.includes(prod.caja)
          )}
          sectionRefs={sectionRefs}
          description={""}
          title={"Otros productos"}
          ind={ExtraerCategorias(store, store.products).length}
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
  const [sortCriteria, setSortCriteria] = useState("none");
  const [Products, setProducts] = useState(prod);

  const handleSortChange = (criteria) => {
    setSortCriteria(criteria);

    // Ordenar según el criterio seleccionado
    const sortedProducts = [...Products];
    switch (criteria) {
      case "price-asc":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-desc":
        sortedProducts.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "none":
      default:
        // Restaurar el orden original o mantenerlo
        sortedProducts.sort((a, b) => a.order - b.order);
        break;
    }

    // Actualizar la lista ordenada
    setProducts(sortedProducts);
  };

  return (
    <div
      className="flex flex-col w-full mt-4 p-2 md:p-4 bg-white rounded-lg shadow-md border"
      id={`${title.replace(/\s+/g, "_")}`}
    >
      <div
        className="flex justify-between items-center sticky  top-12 md:top-16 bg-white z-[10]"
        ref={(el) => {
          sectionRefs.current[ind] = el;
        }}
      >
        <h2 className="text-xl font-bold font-serif">{title}</h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost">
              <ListOrdered className="h-8 w-8" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <RadioGroup
              onValueChange={handleSortChange}
              defaultValue={sortCriteria}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="r1" />
                <Label htmlFor="r1">Nada</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="price-asc" id="r2" />
                <Label htmlFor="r2">Precio Ascendente</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="price-desc" id="r3" />
                <Label htmlFor="r3">Precio Descendente</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="name-desc" id="r4" />
                <Label htmlFor="r4">Nombre Descendente</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="name-desc" id="r5" />
                <Label htmlFor="r5">Nombre Descendente</Label>
              </div>
            </RadioGroup>
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <h2 className="text-sm  font-serif">{description}</h2>
      </div>
      <div className="grid grid-cols-2 gap-1 grid-flow-row-dense">
        {Products.map((prod, index) => (
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
    <div
      className={`rounded-2xl relative my-2 ${prod.span ? "col-span-2" : ""}`}
    >
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
              className={`w-full group-hover:scale-105 transition-transform block object-cover z-[1] rounded-2xl ${
                prod.span ? "h-52" : "h-auto"
              }`}
              height="300"
              width="300"
              style={{
                aspectRatio: "1",
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-2 md:p-8 rounded-2xl">
            <p className="text-sm text-white font-semibold max-h-10 line-clamp-2 ">
              {prod.title}
            </p>
          </div>
        </Link>
      </div>
      <div className="flex justify-between items-center m-2 text-xs">
        <div className="flex">
          <Star className={`w-4 h-4 text-yellow-400 fill-current`} />{" "}
          {`(${Promedio(prod.coment, "star").toFixed(1)})`}
        </div>
        <p className="flex text-xs ">
          ${Number(prod.price).toFixed(2)} {store.moneda_default.moneda}
        </p>
      </div>
      <div
        className="h-7 m-2 text-gray-700 line-clamp-2"
        style={{ fontSize: "10px" }}
      >
        {prod.descripcion}
      </div>

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
