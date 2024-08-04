"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { createClient } from "@/lib/supabase";
import { useEffect, useState, useContext } from "react";
import { Share } from "lucide-react";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus } from "lucide-react";
import { context } from "@/app/layout";

export default function Prod({ tienda, specific }) {
  const { toast } = useToast();
  const { store, dispatchStore } = useContext(context);
  const supabase = createClient();
  const [products, setProducts] = useState({ Cant: 0, agregados: [] });
  const [product] = store.products.filter((env) => env.productId === specific);
  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        await supabase
          .from("Products")
          .select("*")
          .eq("productId", specific)
          .then((respuesta) => {
            const [a] = respuesta.data;
            setProducts({
              ...a,
              Cant: a.Cant,
              agregados: JSON.parse(a.agregados),
            });
          });
      } catch (error) {
        alert("Error fetching data:", error);
      }
    };
    obtenerDatos();
  }, [supabase]);

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

  useEffect(() => {
    const CambiarDatos = async () => {
      setProducts({
        ...products,
        Cant: product.Cant,
        agregados: product.agregados,
      });
    };
    CambiarDatos();
  }, [product]);
  return (
    <>
      <div className="grid md:grid-cols-2 gap-6 lg:gap-12 items-start max-w-6xl px-4 mx-auto py-6">
        <div className="flex gap-4 md:gap-10 justify-center">
          <Image
            alt={products.title ? products.title : "Producto"}
            className=" object-cover border border-gray-200 h-auto w-9/12 rounded-lg overflow-hidden dark:border-gray-800 dark:border-gray-800"
            height={600}
            src={
              products.image == ""
                ? "https://res.cloudinary.com/dbgnyc842/image/upload/v1721753647/kiphxzqvoa66wisrc1qf.jpg"
                : products.image
                ? products.image
                : "https://res.cloudinary.com/dbgnyc842/image/upload/v1721753647/kiphxzqvoa66wisrc1qf.jpg"
            }
            width={400}
          />
        </div>
        <div className="flex gap-4 md:gap-10 justify-center text-4xl font-bold">
          {product?.title}
        </div>
        <div className="grid gap-4 md:gap-10 items-start">
          <div className="grid gap-2">
            <div className=" flex justify-between">
              <div className="text-4xl font-bold">
                ${(products.price / store.moneda_default.valor).toFixed(2)}{" "}
                {store.moneda_default.moneda}
              </div>
              <Button
                onClick={() =>
                  handleShare(
                    products.title,
                    products.descripcion,
                    `https://rh-menu.vercel.app/${store.variable}/${store.sitioweb}/products/${product.productId}`
                  )
                }
                size="lg"
                variant="outline"
              >
                <Share className="w-5 h-5" />
              </Button>
            </div>

            <div className="grid gap-2">
              {products.descripcion && (
                <p className="text-gray-500 dark:text-gray-400 mt-4 mb-4">
                  {products.descripcion}
                </p>
              )}
              {/*  <div className="flex items-center gap-4">
                <div className="flex items-center gap-0.5">
                  <StarIcon className="w-5 h-5 fill-gray-900 dark:fill-gray-50" />
                  <StarIcon className="w-5 h-5 fill-gray-900 dark:fill-gray-50" />
                  <StarIcon className="w-5 h-5 fill-gray-900 dark:fill-gray-50" />
                  <StarIcon className="w-5 h-5 fill-gray-100 stroke-gray-500 dark:fill-gray-800 dark:stroke-gray-400" />
                  <StarIcon className="w-5 h-5 fill-gray-100 stroke-gray-500 dark:fill-gray-800 dark:stroke-gray-400" />
                </div>
              </div>*/}
            </div>
            {store.domicilio && !products.agotado ? (
              products.agregados.length > 0 ? (
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
                        {`${products.title} - $${Number(products.price).toFixed(
                          2
                        )}`}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      {products.agregados.map((obj, ind2) => (
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
                                const c = products.agregados.map((obj1) =>
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
                                    ...products,
                                    agregados: c,
                                  }),
                                });
                              }}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Badge variant="outline">{obj.cantidad}</Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              className=" p-1 h-5 w-5 hover:text-foreground"
                              onClick={(e) => {
                                const c = products.agregados.map((obj1) =>
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
                                    ...products,
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
                              ...products,
                              Cant: products.Cant + 1,
                            }),
                          });
                        }}
                      >
                        Sin Agregados
                        <Badge className="ml-3">{products.Cant}</Badge>
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
                        ...products,
                        Cant: products.Cant + 1,
                      }),
                    });
                  }}
                >
                  Add to Cart <Badge className="ml-3">{products.Cant}</Badge>
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
