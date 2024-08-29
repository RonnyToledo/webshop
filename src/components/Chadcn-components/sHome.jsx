"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useContext, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import AllProducts from "./AllProducts";
import Loading from "../component/loading";
import { Search } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { MyContext } from "@/context/MyContext";

export default function SHome({ tienda }) {
  const { toast } = useToast();
  const sectionRefs = useRef([]);
  const stickyElement = useRef(null);
  const { store, dispatchStore } = useContext(MyContext);
  const [visibleSectionId, setVisibleSectionId] = useState("");
  const [api, setApi] = useState();
  const now = new Date();

  async function Load(ShotScroll) {
    const element = document.getElementById(ShotScroll);
    if (element) {
      await pause(500);
      element.scrollIntoView({ behavior: "smooth" });
    }
  }
  // Crear referencias para cada sección
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.map((entry) => {
          if (entry.isIntersecting) {
            setVisibleSectionId(entry.target.parentNode.id); // Actualiza el ID de la sección visible
          }
        });
      },
      {
        threshold: 0, // Cambia este valor según necesites
      }
    );
    const handleScroll = () => {
      sectionRefs.current.forEach((section) => {
        observer.observe(section);
      });
    };

    window.addEventListener("scroll", handleScroll); // Agrega el listener
    return () => {
      // Desconectar el observer al desmontar
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll); // Limpia el listener al desmontar
    };
  }, []);

  useEffect(() => {
    if (api)
      api.scrollTo(
        store.categoria.findIndex(
          (obj) => obj.split(" ").join("_") == visibleSectionId
        ) == -1
          ? store.categoria.length - 1
          : store.categoria.findIndex(
              (obj) => obj.split(" ").join("_") == visibleSectionId
            )
      );
  }, [visibleSectionId, api]);

  return (
    <>
      <div className="bg-gray-100 p-2 md:p-4">
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <Housr horario={store.horario} />
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-bold line-clamp-1 overflow-hidden">
              {store.name}
            </h1>
            <div className="flex items-center space-x-2">
              <ShareIcon
                onClick={handleShare}
                className="w-6 h-6 text-gray-600"
              />
            </div>
          </div>{" "}
          <Image
            src={
              store.urlPoster
                ? store.urlPoster
                : "https://res.cloudinary.com/dbgnyc842/image/upload/v1721753647/kiphxzqvoa66wisrc1qf.jpg"
            }
            alt={store.name ? store.name : "Store"}
            className="w-full h-auto rounded-lg mb-4"
            width={400}
            height={400}
          />
          <div className="flex items-center space-x-2 mb-2">
            <StarIcon className="w-4 h-4 text-grey-500" />
            <p className="text-gray-700">
              {CalcularPromedio(store.comentario)} ({store.comentario.length}{" "}
              reseñas) · {store.moneda_default.moneda}
            </p>
          </div>
          <p className="text-gray-700 mb-2 line-clamp-2 overflow-hidden">
            {store.parrrafo}
          </p>
          <div className="flex items-center space-x-2 mt-2">
            <Badge variant="secondary">
              {store.municipio}, {store.Provincia}
            </Badge>
            {store.domicilio && <Badge variant="success">Domicilio</Badge>}{" "}
          </div>
        </div>
        {visibleSectionId && (
          <section
            className="bg-white rounded-lg shadow-md p-2 mb-4 sticky top-16 z-[5]"
            ref={stickyElement}
          >
            <Carousel
              opts={{ align: "start" }}
              setApi={setApi}
              className="w-full "
            >
              <CarouselContent>
                {ExtraerCategoria(store, store.products).map((obj, ind) => (
                  <CarouselItem
                    key={ind}
                    className={
                      obj.split(" ").join("_") == visibleSectionId
                        ? "basis-1/3 snap-start min-h-full"
                        : "basis-1/3 min-h-full"
                    }
                  >
                    <Badge
                      variant={
                        obj.split(" ").join("_") == visibleSectionId
                          ? "default"
                          : "outline"
                      }
                      className="flex items-center min-h-full  text-center line-clamp-2 overflow-hidden"
                      onClick={() => {
                        Load(`${obj.split(" ").join("_")}`);
                      }}
                    >
                      {obj}
                    </Badge>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </section>
        )}

        <AllProducts sectionRefs={sectionRefs} />
      </div>
    </>
  );
}
function Housr({ horario }) {
  const now = new Date();
  const newHorario = horario.map((obj, index) => {
    const abierto = new Date(); // Obtener la fecha actual
    const cerrado = new Date();
    abierto.setDate(now.getDate() + index - now.getDay());
    abierto.setHours(obj.apertura);
    abierto.setMinutes(0); // Establecer los minutos a 0
    abierto.setSeconds(0); // Establecer los segundos a 0

    cerrado.setDate(now.getDate() + index - now.getDay());
    cerrado.setMinutes(0); // Establecer los minutos a 0
    cerrado.setSeconds(0); // Establecer los segundos a 0
    if (obj.apertura >= obj.cierre) {
      cerrado.setDate(cerrado.getDate() + 1);
      cerrado.setHours(obj.cierre);
    } else {
      cerrado.setHours(obj.cierre);
    }
    return {
      dia: obj.dia,
      apertura: abierto,
      cierre: cerrado,
    };
  });
  function isOpen() {
    if (newHorario[0]?.apertura <= now && newHorario[0]?.cierre > now) {
      return true;
    } else if (newHorario[1]?.apertura <= now && newHorario[1]?.cierre > now) {
      return true;
    } else if (newHorario[2]?.apertura <= now && newHorario[2]?.cierre > now) {
      return true;
    } else if (newHorario[3]?.apertura <= now && newHorario[3]?.cierre > now) {
      return true;
    } else if (newHorario[4]?.apertura <= now && newHorario[4]?.cierre > now) {
      return true;
    } else if (newHorario[5]?.apertura <= now && newHorario[5]?.cierre > now) {
      return true;
    } else if (newHorario[6]?.apertura <= now && newHorario[6]?.cierre > now) {
      return true;
    } else {
      return false; // Está cerrado
    }
  }
  const valor1 = isOpen()
    ? newHorario[now.getDay()]?.cierre.getHours() >= 0
      ? newHorario[now.getDay()]?.cierre.getHours() + 24 - now.getHours() - 1
      : newHorario[now.getDay()]?.cierre.getHours() - now.getHours() - 1
    : newHorario[now.getDay()]?.apertura.getHours() - now.getHours() - 1;
  const valor2 = 60 - now.getMinutes();
  return (
    <div className="flex items-center space-x-2 mb-2">
      <Badge variant={!isOpen() && "destructive"}>
        {isOpen() ? "ABIERTO" : "CERRADO"}
      </Badge>
      <p className="text-gray-500">
        {isOpen()
          ? `Cierra en ${valor1 != 0 ? `${valor1}h y` : ""} ${valor2}m`
          : `Abre en ${valor1 != 0 ? `${valor1}h y` : ""} ${valor2}m`}
      </p>
    </div>
  );
}
function CalcularPromedio(arr) {
  const suma = arr.reduce((acc, item) => acc + item.star, 0); // Sumar los valores de star
  const a = suma / arr.length; // Calcular el promedio
  return a;
}
function ExtraerCategoria(data, products) {
  const categoriaProducts = [...new Set(products.map((prod) => prod.caja))];

  const newCat = data.categoria.filter((prod) =>
    categoriaProducts.includes(prod)
  );
  return newCat;
}
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
      description: "La API de compartir no está disponible en este navegador.",
      action: <ToastAction altText="Goto schedule to undo">Cerrar</ToastAction>,
    });
  }
};
const pause = (duration) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

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
