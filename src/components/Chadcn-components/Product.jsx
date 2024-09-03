"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TestProducts from "@/components/Chadcn-components/TestProduct";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { createClient } from "@/lib/supabase";
import { useEffect, useState, useContext } from "react";
import { Share } from "lucide-react";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus } from "lucide-react";
import Loading from "../component/loading";
import { Card, CardContent } from "@/components/ui/card";
import { CircleArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import StarIcons from "@/components/Chadcn-components/StarIcons";
import { comment } from "postcss";
import { MyContext } from "@/context/MyContext";

export default function Prod({ tienda, specific }) {
  const { toast } = useToast();
  const { store, dispatchStore } = useContext(MyContext);
  const supabase = createClient();
  const [product] = store.products.filter((env) => env.productId === specific);

  useEffect(() => {
    const ActProd = async () => {
      if (product.productId) {
        console.log(product);
        const { data, error } = await supabase
          .from("Products")
          .update({
            visitas: Number(product?.visitas) + 1,
          })
          .eq("productId", product?.productId)
          .select();
      }
    };
    ActProd();
  }, [product]);

  const handleShare = async (title, descripcion, url) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: descripcion,
          url: url,
        });
      } catch (error) {}
    } else {
      // Fallback para navegadores que no soportan la API de compartir
      toast({
        title: "Informacion",
        description:
          "La API de compartir no está disponible en este navegador.",
        action: (
          <ToastAction altText="Goto schedule to undo">Cerrar</ToastAction>
        ),
      });
    }
  };

  function StarLength(product) {
    if (
      product?.coment &&
      Array.isArray(product.coment) &&
      product.coment.length > 0
    ) {
      const totalStars = product.coment.reduce(
        (acc, objeto) => acc + objeto.star,
        0
      );
      return totalStars / product.coment.length;
    } else {
      return 0; // Si no hay comentarios, establece la longitud a 0
    }
  }

  return (
    <>
      {store.products
        .filter((env) => env.productId === specific)
        .map((obj, ind) => (
          <div
            key={ind}
            className="grid md:grid-cols-2 gap-6 lg:gap-12 items-start max-w-6xl px-4 mx-auto py-6"
          >
            <div className="flex gap-4 md:gap-10 justify-center">
              <Image
                alt={obj.title ? obj.title : "Producto"}
                className=" object-cover border border-gray-200 h-auto w-9/12 rounded-lg overflow-hidden dark:border-gray-800 dark:border-gray-800"
                height={600}
                src={
                  obj.image == ""
                    ? "https://res.cloudinary.com/dbgnyc842/image/upload/v1725399957/xmlctujxukncr5eurliu.png"
                    : obj.image
                    ? obj.image
                    : "https://res.cloudinary.com/dbgnyc842/image/upload/v1725399957/xmlctujxukncr5eurliu.png"
                }
                width={400}
              />
            </div>
            <div className="gap-4 md:gap-10 justify-center">
              <div className="flex gap-4 md:gap-10 justify-center text-4xl font-bold sm:mb-4">
                {obj.title}
              </div>
              <div className="grid gap-4 md:gap-10 items-start">
                <div className="grid gap-2">
                  <div className=" flex justify-between">
                    <div className="text-2xl md:text-4xl font-bold">
                      ${(obj.price / store.moneda_default.valor).toFixed(2)}{" "}
                      {store.moneda_default.moneda}
                    </div>
                    <Button
                      onClick={() =>
                        handleShare(
                          obj.title,
                          obj.descripcion,
                          `https://rh-menu.vercel.app/${store.variable}/${store.sitioweb}/products/${obj.productId}`
                        )
                      }
                      size="lg"
                      variant="outline"
                    >
                      <Share className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="grid gap-2">
                    {obj.descripcion && (
                      <p className="text-gray-500 dark:text-gray-400 mt-4 mb-4">
                        {obj.descripcion}
                      </p>
                    )}
                    <div className="p-2">
                      <div className="flex justify-between items-center px-6">
                        <h2 className="text-2xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                          Valoraciones
                        </h2>
                        <CircleArrowRight className="ml-2 h-6 w-6" />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-2 flex flex-col">
                          <h2 className="text-7xl sm:text-8xl flex justify-center items-center font-bold tracking-tighter sm:text-4xl md:text-5xl">
                            {Number(StarLength(obj)).toFixed(1)}
                          </h2>
                          <StarIcons rating={StarLength(obj)} />
                        </div>
                        <div className="col-span-2 p-4 flex flex-col">
                          {"abcde".split("").map((_, indx) => (
                            <div
                              key={indx}
                              className="flex items-center gap-2 p-1"
                            >
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {indx + 1}
                              </div>
                              <Progress
                                value={
                                  (obj.coment?.filter(
                                    (obj) => obj.star == indx + 1
                                  ).length *
                                    100) /
                                  obj.coment?.length
                                }
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  {store.domicilio && !obj.agotado ? (
                    obj.agregados.length > 0 ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="w-full">Agregados</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[300px] sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Agregados</DialogTitle>
                            <DialogDescription>
                              Indique los agregados de su Producto, a este se le
                              agregrega al precio original de{" "}
                              {`${obj.title} - $${Number(obj.price).toFixed(
                                2
                              )}`}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            {obj.agregados.map((obj, ind2) => (
                              <div
                                key={ind2}
                                className="flex justify-between items-center gap-4"
                              >
                                <Label
                                  htmlFor="terms"
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {`${obj.nombre} - ${(
                                    obj.valor / store.moneda_default.valor
                                  ).toFixed(2)}`}{" "}
                                  {store.moneda_default.moneda}
                                </Label>
                                <div className="flex justify-between items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    disabled={obj.cantidad == 0}
                                    className="p-1  h-5 w-5 hover:text-foreground"
                                    onClick={(e) => {
                                      const c = obj.agregados.map((obj1) =>
                                        obj.nombre == obj1.nombre
                                          ? {
                                              ...obj1,
                                              cantidad: obj.cantidad - 1,
                                            }
                                          : obj1
                                      );

                                      dispatchStore({
                                        type: "AddCart",
                                        payload: JSON.stringify({
                                          ...obj,
                                          agregados: c,
                                        }),
                                      });
                                    }}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <Badge variant="outline">
                                    {obj.cantidad}
                                  </Badge>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className=" p-1 h-5 w-5 hover:text-foreground"
                                    onClick={(e) => {
                                      const c = obj.agregados.map((obj1) =>
                                        obj.nombre == obj1.nombre
                                          ? {
                                              ...obj1,
                                              cantidad: obj.cantidad + 1,
                                            }
                                          : obj1
                                      );
                                      dispatchStore({
                                        type: "AddCart",
                                        payload: JSON.stringify({
                                          ...obj,
                                          agregados: c,
                                        }),
                                      });
                                    }}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                          <DialogFooter>
                            <Button
                              onClick={(e) => {
                                dispatchStore({
                                  type: "AddCart",
                                  payload: JSON.stringify({
                                    ...obj,
                                    Cant: obj.Cant + 1,
                                  }),
                                });
                              }}
                            >
                              Sin Agregados
                              <Badge className="ml-3">{obj.Cant}</Badge>
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <Button
                        className="w-full"
                        onClick={() => {
                          dispatchStore({
                            type: "AddCart",
                            payload: JSON.stringify({
                              ...obj,
                              Cant: obj.Cant + 1,
                            }),
                          });
                        }}
                      >
                        Add to Cart <Badge className="ml-3">{obj.Cant}</Badge>
                      </Button>
                    )
                  ) : (
                    <Button disabled className="w-full">
                      Agotado
                    </Button>
                  )}
                </div>
              </div>
            </div>
            {obj.coment.length >= 1 && (
              <section className="py-8 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
                <div className="container px-4 md:px-6 mt-4">
                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                      Testimonios
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {obj.coment.map(
                        (comm, index) =>
                          index <= 3 && (
                            <Card key={index}>
                              <CardContent className="space-y-4  p-5">
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
                                    src={
                                      "https://res.cloudinary.com/dbgnyc842/image/upload/v1723126726/Coffe_react/mz37m1piafitiyr1esn2.png"
                                    }
                                    style={{
                                      aspectRatio: "40/40",
                                      objectFit: "cover",
                                      textAlign: "center",
                                    }}
                                    width="40"
                                  />
                                  <div>
                                    <div className="font-medium">
                                      {comm.name}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                      Cliente
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )
                      )}
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
          </div>
        ))}
    </>
  );
}

function ArrowLeftIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

function ShareIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" x2="12" y1="2" y2="15" />
    </svg>
  );
}

function StarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
