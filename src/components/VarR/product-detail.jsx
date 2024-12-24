"use client";
import TestProducts from "./TestProduct";
import Image from "next/image";
import { createClient } from "@/lib/supabase";
import { useEffect, useState, useContext, useRef } from "react";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import StarIcons from "./StarIcons";
import { MyContext } from "@/context/MyContext";
import { ButtonOfCart } from "../globalFunctions/components";
import { Promedio } from "../globalFunctions/function";
import { ProductGrid } from "./allProduct";
import RemoveShoppingCartOutlinedIcon from "@mui/icons-material/RemoveShoppingCartOutlined";
import { Button } from "../ui/button";
import RatingSection from "./Details-Coment/rating-section";

export function ProductDetailComponent({ specific }) {
  const { toast } = useToast();
  const { store, dispatchStore } = useContext(MyContext);
  const [isAnimating, setIsAnimating] = useState(false);
  const [imageClone, setImageClone] = useState(null); // Para almacenar la copia de la imagen
  const productImageRef = useRef(null);

  const handleShare = async (title, descripcion, url, imageUrl) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: descripcion,
          url,
          image: imageUrl,
        });
      } catch (error) {
        console.error("Error al compartir", error);
      }
    } else {
      toast({
        title: "Información",
        description:
          "La API de compartir no está disponible en este navegador.",
        action: (
          <ToastAction altText="Goto schedule to undo">Cerrar</ToastAction>
        ),
      });
    }
  };
  const AnimationCart = () => {
    setIsAnimating(true); // Iniciar animación
    dispatchStore({ type: "animateCart", payload: true });

    // Simular que la animación termina después de 1 segundo y ocultar el componente

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
    const timeoutId = setTimeout(() => {
      dispatchStore({ type: "animateCart", payload: false });
    }, 2000);

    return () => {
      clearTimeout(timeoutId); // Limpiar el timeout
    };
  };
  return (
    <>
      {store.products
        .filter((env) => env.productId === specific)
        .map((obj, ind) => (
          <div key={ind} className="relative flex flex-col bg-gray-100">
            <div
              className="absolute flex justify-center items-center w-full h-full"
              style={{ height: "60vh" }}
            ></div>
            <div className="relative rounded-b-2xl overflow-hidden">
              <Image
                ref={productImageRef}
                id={`product-img-${obj.productId}`}
                src={
                  obj.image ||
                  store.urlPoster ||
                  "https://res.cloudinary.com/dbgnyc842/image/upload/v1725399957/xmlctujxukncr5eurliu.png"
                }
                alt={obj.title || "Shoes background"}
                className="inset-0 w-full h-auto block object-cover object-center "
                width={500}
                height={500}
                style={{
                  aspectRatio: "1",
                  objectFit: "cover",
                  filter: obj.agotado ? "grayscale(100%)" : "grayscale(0)",
                }}
              />
              <div className="absolute inset-0 flex flex-col justify-end text-white w-full h-full top-0 z-[1]  bg-gradient-to-t from-black/80 to-transparent">
                <div className="backdrop-blur-xl h-20 p-4 rounded-2xl bottom-0 translate-y-px flex justify-between items-center">
                  <h2 className="text-2xl font-bold">{obj.title}</h2>
                  <div className="flex flex-col items-center gap-2">
                    <Badge
                      className={`${true ? "bg-green-500" : "bg-red-500"}`}
                    >
                      {obj.agotado ? "Out of Stock" : "In Stock"}
                    </Badge>
                    <span className="text-xl font-bold text-white">
                      ${Number(obj.price).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <main className="flex-grow p-4 space-y-6">
              <div className="space-y-4">
                <div>
                  <p className="text-gray-700">Descripcion</p>
                  <p className="text-gray-400 line-clamp-6">
                    {obj.descripcion}
                  </p>
                </div>
              </div>
            </main>
            <footer className="p-4">
              <div className="flex justify-end col-span-2">
                {!obj.agotado ? (
                  <ButtonOfCart
                    prod={obj}
                    condition={false}
                    AnimationCart={AnimationCart}
                  />
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
            </footer>
            <RatingSection specific={specific} sitioweb={store.sitioweb} />

            {store.products.filter((prod) => obj.caja == prod.caja).length >
              1 && (
              <div className="flex flex-col w-full mt-4 p-2 md:p-4 bg-white rounded-lg shadow-md border">
                <div className="flex justify-between items-center sticky  top-12 md:top-16 bg-white z-[10]">
                  <h2 className="text-xl font-semibold font-serif">
                    Otras ofertas
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-1 grid-flow-row-dense">
                  {store.products
                    .filter((prod) => obj.caja == prod.caja)
                    .map((prod, index) => (
                      <ProductGrid key={index} prod={prod} />
                    ))}
                </div>
              </div>
            )}
          </div>
        ))}
    </>
  );
}
