"use client";
import TestProducts from "@/components/VarT/TestProduct";
import Image from "next/image";
import { createClient } from "@/lib/supabase";
import { useEffect, useState, useContext, useRef } from "react";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import StarIcons from "@/components/VarT/StarIcons";
import { MyContext } from "@/context/MyContext";
import { ButtonOfCart, IconCartAnimation } from "../globalFunctions/components";
import { Promedio } from "../globalFunctions/function";
import { ProductGrid } from "./allProduct";

export function ProductDetailComponent({ specific }) {
  const { toast } = useToast();
  const { store, dispatchStore } = useContext(MyContext);
  const supabase = createClient();
  const [product] = store.products.filter((env) => env.productId === specific);
  const [isAnimating, setIsAnimating] = useState(false);
  const [imageClone, setImageClone] = useState(null); // Para almacenar la copia de la imagen
  const productImageRef = useRef(null);

  useEffect(() => {
    const ActProd = async () => {
      if (product?.productId) {
        const { data, error } = await supabase
          .from("Products")
          .update({ visitas: Number(product.visitas) + 1 })
          .eq("productId", product.productId)
          .select();
      }
    };
    ActProd();
  }, [product?.productId, product?.visitas, supabase]);

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
      {" "}
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
                style={{ height: "60vh" }}
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
              <div className="grid grid-cols-2 space-y-4">
                <div>
                  <p className="text-gray-700">Descripcion</p>
                  <p className="text-gray-400 line-clamp-6">
                    {obj.descripcion}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-2 flex flex-col justify-center">
                    <h2 className="text-3xl sm:text-8xl flex justify-center items-center font-bold tracking-tighter sm:text-4xl md:text-5xl">
                      {Number(Promedio(obj.comment, "star")).toFixed(1)}
                    </h2>
                    <StarIcons rating={Promedio(obj.comment, "star")} />
                  </div>
                  <div className="col-span-2 p-4 flex flex-col">
                    {"abcde".split("").map((_, indx) => (
                      <div key={indx} className="flex items-center gap-2 p-1">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {indx + 1}
                        </div>
                        <Progress
                          value={
                            (obj.coment?.filter((obj) => obj.star == indx + 1)
                              .length *
                              100) /
                            obj.coment?.length
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </main>
            <footer className="p-4">
              <ButtonOfCart prod={obj} />
            </footer>
            {obj.coment.length >= 1 && (
              <section className="py-8 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
                <div className="container px-4 md:px-6 mt-4">
                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                      Testimonios
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {obj.coment.slice(0, 3).map((comm, index) => (
                        <Card key={index}>
                          <CardContent className="space-y-4 p-5">
                            <div className="space-y-2">
                              <p className="text-lg font-semibold">
                                {comm.title}
                              </p>
                              <p className="text-gray-500 dark:text-gray-400">
                                {comm.cmt}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Image
                                alt={comm.name.charAt(0)}
                                className="rounded-full bg-gray-100 object-cover"
                                height="40"
                                src="https://res.cloudinary.com/dbgnyc842/image/upload/v1723126726/Coffe_react/mz37m1piafitiyr1esn2.png"
                                width="40"
                              />
                              <div>
                                <div className="font-medium">{comm.name}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  Cliente
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}
            <div className="flex justify-center">
              <TestProducts
                com={obj.coment}
                specific={obj.productId}
                sitioweb={store.sitioweb}
              />
            </div>
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
