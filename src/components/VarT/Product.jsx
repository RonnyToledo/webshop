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
import TestProducts from "@/components/VarT/TestProduct";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { createClient } from "@/lib/supabase";
import { useEffect, useState, useContext } from "react";
import { Share, Plus, Minus, CircleArrowRight } from "lucide-react";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import Loading from "../Chadcn-components/loading";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import StarIcons from "@/components/VarT/StarIcons";
import { MyContext } from "@/context/MyContext";

export default function Prod({ tienda, specific }) {
  const { toast } = useToast();
  const { store, dispatchStore } = useContext(MyContext);
  const supabase = createClient();
  const [product] = store.products.filter((env) => env.productId === specific);

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
  }, [product.productId, product.visitas, supabase]);

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
        console.log("Error al compartir", error);
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

  const StarLength = (product) => {
    if (product?.coment?.length > 0) {
      const totalStars = product.coment.reduce((acc, obj) => acc + obj.star, 0);
      return totalStars / product.coment.length;
    }
    return 0;
  };

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
                alt={obj.title || "Producto"}
                className="object-cover border border-gray-200 h-auto w-9/12 rounded-lg overflow-hidden dark:border-gray-800"
                height={600}
                src={
                  obj.image ||
                  "https://res.cloudinary.com/dbgnyc842/image/upload/v1725399957/xmlctujxukncr5eurliu.png"
                }
                width={400}
                style={{
                  aspectRatio: "200/300",
                  objectFit: "cover",
                  filter: obj.agotado ? "grayscale(100%)" : "grayscale(0)",
                }}
              />
            </div>
            <div className="gap-4 md:gap-10 justify-center">
              <div className="flex gap-4 md:gap-10 justify-center text-4xl font-bold sm:mb-4">
                {obj.title}
              </div>
              <div className="grid gap-4 md:gap-10 items-start">
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <div className="text-2xl md:text-4xl font-bold">
                      ${(obj.price / store.moneda_default.valor).toFixed(2)}{" "}
                      {store.moneda_default.moneda}
                    </div>
                    <Button
                      onClick={() =>
                        handleShare(
                          obj.title,
                          `Precio:${Number(obj.price).toFixed(2)}${
                            store.moneda_default.moneda
                          }${obj.descripcion && `,->${obj.descripcion}`}\n`,
                          `https://rh-menu.vercel.app/${store.variable}/${store.sitioweb}/products/${obj.productId}`,
                          obj.image
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
                    {/* Más contenido aquí... */}
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
          </div>
        ))}
    </>
  );
}
