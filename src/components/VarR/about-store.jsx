"use client";

import Image from "next/image";
import {
  Users,
  Truck,
  Mail,
  Phone,
  ShoppingBag,
  Star,
  Clock,
  CreditCard,
  StarIcon,
} from "lucide-react";
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
import { useState, useContext, useRef } from "react";
import { MyContext } from "@/context/MyContext";
import { Button } from "@/components/ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "../ui/textarea";
import axios from "axios";
import YourSliderComponent from "./SliderComponent";

export function AboutStoreComponent() {
  const { store, dispatchStore } = useContext(MyContext);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 mt-16">
      <main className="flex-grow p-4 space-y-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm text-center">
          <Image
            src={
              store.urlPoster ||
              "https://res.cloudinary.com/dbgnyc842/image/upload/v1725399957/xmlctujxukncr5eurliu.png"
            }
            alt={store.name || "Shoes background"}
            width={300}
            height={300}
            className="rounded-full h-72 md:h-48 w-72 md:w-48 object-cover mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold mb-2">{store.name}</h2>
          <p className="text-blue-600 font-semibold mb-4">{store.tipo}</p>
          <p className="text-gray-600 mb-4">{store.parrafo}</p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold mb-2">Sobre nosotros</h3>
          <div className="grid grid-cols-2 gap-4">
            {store.reservas && (
              <div className="flex flex-col items-center p-3 bg-gray-50 rounded-xl">
                <ShoppingBag className="h-8 w-8 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-center">
                  Reservacion
                </span>
              </div>
            )}
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-xl">
              <Users className="h-8 w-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-center">
                Gran alcance
              </span>
            </div>
            {store.act_tf && (
              <div className="flex flex-col items-center p-3 bg-gray-50 rounded-xl">
                <CreditCard className="h-8 w-8 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-center">
                  Pago en transferencia
                </span>
              </div>
            )}
            {store.domicilio && (
              <div className="flex flex-col items-center p-3 bg-gray-50 rounded-xl">
                <Truck className="h-8 w-8 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-center">
                  Domicilio Rapido
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
          {store.email && (
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-blue-600" />
              <span>{store.email}</span>
            </div>
          )}
          {store.cell && (
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-blue-600" />
              <span>+53 {store.cell}</span>
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
          {store.comentTienda && (
            <>
              <YourSliderComponent commentTienda={store.comentTienda} />
            </>
          )}
          <div className="flex justify-center">
            <Testimonio com={store.comentTienda} sitioweb={store.sitioweb} />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold mb-2">Horarios de Trabajo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {store.horario.map((hor, ind) => (
              <div key={ind} className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="font-medium">{hor.dia}</p>
                  <div>
                    <p className="text-sm text-gray-600">
                      {hor.apertura == 0 && hor.cierre == 24
                        ? "Abierto 24 horas"
                        : hor.apertura == hor.cierre
                        ? "Cerrado"
                        : hor.apertura + ":00 - " + hor.cierre + ":00"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function Testimonio({ com, sitioweb }) {
  const { store, dispatchStore } = useContext(MyContext);
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
    formData.append("comentario", JSON.stringify(newcomment));
    formData.append("UUID", store.UUID);
    try {
      const res = await axios.post(
        `/api/tienda/${sitioweb}/comment`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.status == 200) {
        toast({
          title: "Tarea Ejecutada",
          description: "Informacion Actualizada",
          action: (
            <ToastAction altText="Goto schedule to undo">Cerrar</ToastAction>
          ),
        });
        dispatchStore({ type: "AddComent", payload: res?.data?.value });
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
        className="text-white bg-primary my-10 py-4 px-8 rounded-lg flex items-center justify-center"
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
              className={`bg-primary hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded ${
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
