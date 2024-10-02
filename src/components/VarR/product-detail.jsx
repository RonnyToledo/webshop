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
import { Star, ShoppingCart, Share2 } from "lucide-react";
import { ButtonOfCart } from "../globalFunctions/components";
import { Promedio } from "../globalFunctions/function";

export function ProductDetailComponent({ specific }) {
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

  return (
    <>
      {" "}
      {store.products
        .filter((env) => env.productId === specific)
        .map((obj, ind) => (
          <div key={ind} className="flex flex-col bg-gray-100">
            <main className="flex-grow p-4 space-y-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm relative">
                <Image
                  alt={obj.title || "Producto"}
                  className="object-cover border border-gray-200 w-full h-64 rounded-2xl overflow-hidden dark:border-gray-800"
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
                <Badge
                  className={`absolute top-8 right-8 ${
                    true ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {obj.agotado ? "Out of Stock" : "In Stock"}
                </Badge>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">{obj.title}</h2>
                  <div className="flex items-center space-x-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">
                      {Promedio(obj.comment, "star").toFixed(1)}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600">{obj.descripcion}</p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-2 flex flex-col">
                    <h2 className="text-7xl sm:text-8xl flex justify-center items-center font-bold tracking-tighter sm:text-4xl md:text-5xl">
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
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-red-600">
                    ${Number(obj.price).toFixed(2)}
                  </span>
                </div>
              </div>
            </main>
            <footer className="bg-white p-4">
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
          </div>
        ))}
    </>
  );
}
