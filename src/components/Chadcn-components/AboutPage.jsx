"use client";
import React, { useContext } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Share, Save, Loader2 } from "lucide-react";
import axios from "axios";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Card, CardContent } from "@/components/ui/card";
import { MyContext } from "@/context/MyContext";

export default function AboutPage({ tienda }) {
  const { store, dispatchStore } = useContext(MyContext);

  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleShare = async (title, descripcion, url) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: descripcion,
          url: url,
        });
      } catch (error) {
        toast({
          title: "Informacion",
          description: `Error al compartir: ${error}`,
          action: (
            <ToastAction altText="Goto schedule to undo">Cerrar</ToastAction>
          ),
        });
      }
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

  return (
    <>
      <div className="w-full">
        <Image
          alt={store.name ? store.name : "Store"}
          className="w-full h-[400px] object-cover"
          height={400}
          src={
            store.urlPoster
              ? store.urlPoster
              : process.env.NEXT_PUBLIC_IMAGE_USER
          }
          style={{
            aspectRatio: "1920/400",
            objectFit: "cover",
          }}
          width={1920}
        />
      </div>
      <main className="w-full p-4 bg-gray-100">
        <section className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <div className="flex justify-between">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Sobre Nosotros
                  </h2>
                  <Button
                    onClick={() =>
                      handleShare(
                        store.name,
                        store.parrafoInfo,
                        `https://rh-menu.vercel.app/${store.variable}/${store.sitioweb}/`
                      )
                    }
                    size="lg"
                    variant="outline"
                  >
                    <Share className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                {store.parrrafo ? (
                  <p className="mt-4 text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                    {store.parrrafo}
                  </p>
                ) : (
                  <p className="mt-4 text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                    Nos especializamos en ofrecer productos de alta calidad a
                    precios competitivos. Cada artículo en nuestra tienda ha
                    sido elegido con atención al detalle y con el objetivo de
                    superar tus expectativas. Fundado en 2024, nuestro negocio
                    ha crecido gracias a la confianza y lealtad de nuestros
                    clientes. Nos enorgullece no solo ofrecer productos
                    excepcionales, sino también un servicio al cliente
                    personalizado que te hará sentir como en casa. ¡Visítanos y
                    descubre todo lo que tenemos para ti!
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
        <section className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Calificacion de los clientes
            </h2>
            <CalcularPromedio arr={store.comentario} />
          </div>
        </section>
        <section className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <h3 className="text-2xl font-bold tracking-tighter">
                  Horario de Trabajo
                </h3>
                {store.horario.map((hor, ind) => (
                  <div
                    className="mt-4 grid gap-2 text-gray-500 dark:text-gray-400"
                    key={ind}
                  >
                    <div className="flex justify-between">
                      <span>{hor.dia}</span>
                      <span>
                        {hor.apertura == 0 && hor.cierre == 24
                          ? "Abierto 24 horas"
                          : hor.apertura == hor.cierre
                          ? "Cerrado"
                          : hor.apertura + ":00 - " + hor.cierre + ":00"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        {store.comentario.length >= 1 && (
          <section className="py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
            <div className="container px-4 md:px-6">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Testimonios
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {store.comentario.map(
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
                                <div className="font-medium">{comm.name}</div>
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
          <Testimonio com={store.comentario} sitioweb={store.sitioweb} />
        </div>
        {store.insta && (
          <section className="py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
            <div className="container px-4 md:px-6">
              <div className="space-y-4">
                <Link
                  className="text-sm font-medium hover:underline underline-offset-4"
                  href={store.insta}
                >
                  <div className="flex justify-center">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                      Síguenos en Instagram
                    </h2>
                  </div>
                </Link>
                <div className="flex justify-center"></div>
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}

function Testimonio({ com, sitioweb }) {
  const [downloading, setDownloading] = useState(false);
  const { toast } = useToast();
  const form = useRef(null);
  const [newcomment, setNewComment] = useState({
    cmt: "",
    title: "",
    star: 1,
    name: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDownloading(true);
    const formData = new FormData();
    formData.append("comentario", JSON.stringify([...com, newcomment]));
    try {
      const res = await axios.put(`/api/tienda/${sitioweb}/comment`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.status == 200) {
        toast({
          title: "Tarea Ejecutada",
          description: "Informacion Actualizada",
          action: (
            <ToastAction altText="Goto schedule to undo">Cerrar</ToastAction>
          ),
        });
      }
    } catch (error) {
      console.error("Error al enviar el comentario:", error);
      toast({
        title: "Error",
        variant: "destructive",
        description: "No se pudo editar las categorias.",
      });
    } finally {
      setDownloading(false);
    }
  };
  return (
    <Drawer>
      <DrawerTrigger
        id="tester"
        className="text-white bg-gray-900 my-10 py-4 px-8 rounded-lg flex items-center justify-center"
      >
        Dejar Testimonio
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Deja tu reseña</DrawerTitle>
          <DrawerDescription>
            Comparte tu experiencia con otros clientes
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <form className="grid gap-4" onSubmit={handleSubmit} ref={form}>
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                required
                placeholder="Ingresa tu nombre"
                onChange={(e) =>
                  setNewComment({ ...newcomment, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="title">Titulo</Label>
              <Input
                required
                id="title"
                type="text"
                placeholder="Ponle un encabezado a tu comentario"
                onChange={(e) =>
                  setNewComment({ ...newcomment, title: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rating">Calificación</Label>
              <div className="flex items-center gap-2">
                <StarIcon
                  onClick={(e) => {
                    e.preventDefault();
                    setNewComment({ ...newcomment, star: 1 });
                  }}
                  className={
                    newcomment.star >= 1
                      ? "w-6 h-6 fill-primary"
                      : "w-6 h-6 fill-muted stroke-muted-foreground"
                  }
                />
                <StarIcon
                  onClick={(e) => {
                    setNewComment({ ...newcomment, star: 2 });
                  }}
                  className={
                    newcomment.star >= 2
                      ? "w-6 h-6 fill-primary"
                      : "w-6 h-6 fill-muted stroke-muted-foreground"
                  }
                />
                <StarIcon
                  onClick={(e) => {
                    setNewComment({ ...newcomment, star: 3 });
                  }}
                  className={
                    newcomment.star >= 3
                      ? "w-6 h-6 fill-primary"
                      : "w-6 h-6 fill-muted stroke-muted-foreground"
                  }
                />
                <StarIcon
                  onClick={(e) => {
                    e.preventDefault();
                    setNewComment({ ...newcomment, star: 4 });
                  }}
                  className={
                    newcomment.star >= 4
                      ? "w-6 h-6 fill-primary"
                      : "w-6 h-6 fill-muted stroke-muted-foreground"
                  }
                />
                <StarIcon
                  onClick={(e) => {
                    e.preventDefault();
                    setNewComment({ ...newcomment, star: 5 });
                  }}
                  className={
                    newcomment.star >= 5
                      ? "w-6 h-6 fill-primary"
                      : "w-6 h-6 fill-muted stroke-muted-foreground"
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="review">Reseña</Label>
              <Textarea
                required
                id="review"
                placeholder="Escribe tu reseña"
                rows={4}
                onChange={(e) =>
                  setNewComment({ ...newcomment, cmt: e.target.value })
                }
              />
            </div>
            <Button
              className={`bg-black hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded ${
                downloading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={downloading}
            >
              {downloading ? "Guardando..." : "Guardar"}
            </Button>
          </form>

          <DrawerClose>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
function CalcularPromedio({ arr }) {
  const suma = arr.reduce((acc, item) => acc + item.star, 0); // Sumar los valores de star
  const a = suma / arr.length;
  const elementos = new Array(5).fill("Hola");
  return (
    <div className="flex items-center justify-center gap-2 p-5">
      {elementos.map((_, index) => (
        <StarIcon
          key={index}
          className={
            index < a
              ? "w-6 h-6 fill-primary"
              : "w-6 h-6 fill-muted stroke-muted-foreground"
          }
        />
      ))}
    </div>
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
