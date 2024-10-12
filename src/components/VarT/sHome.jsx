"use client";
import React, { useState, useEffect, useContext, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import AllProducts from "./AllProducts";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { MyContext } from "@/context/MyContext";
import Housr from "./Horas";
import "@github/relative-time-element";

export default function SHome({ tienda }) {
  const { toast } = useToast();
  const sectionRefs = useRef([]);
  const ref = useRef();
  const stickyElement = useRef(null);
  const { store, dispatchStore } = useContext(MyContext);
  const [visibleSectionId, setVisibleSectionId] = useState("");
  const [api, setApi] = useState(null);

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
            // Actualiza el ID de la sección visible
            dispatchStore({
              type: "Top",
              payload: entry.target.parentNode.id.split("_").join(" "),
            });
          }
        });
      },
      {
        threshold: 0, // Cambia este valor según necesites
      }
    );
    const handleScroll = () => {
      [ref.current, ...sectionRefs.current].forEach((section) => {
        observer.observe(section);
      });
    };

    window.addEventListener("scroll", handleScroll); // Agrega el listener
    return () => {
      // Desconectar el observer al desmontar
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll); // Limpia el listener al desmontar
    };
  }, [dispatchStore]);

  return (
    <div className="bg-gray-100 p-2 md:p-4">
      <div className="bg-white rounded-lg shadow-md p-4 mb-4" id={store.name}>
        <Housr horario={store.horario} />
        <div className="flex items-center justify-between mb-2" ref={ref}>
          <h1 className="text-xl font-bold line-clamp-1">{store.name}</h1>
          <div className="flex items-center space-x-2">
            <ShareIcon
              onClick={() =>
                handleShare(
                  store.name,
                  store.parrrafo,
                  `/${store.variable}/${store.sitioweb}`
                )
              }
              className="w-6 h-6 text-gray-600"
            />
          </div>
        </div>
        <Image
          src={
            store.urlPoster ||
            "https://res.cloudinary.com/dbgnyc842/image/upload/v1725399957/xmlctujxukncr5eurliu.png"
          }
          alt={store.name || "Store"}
          className="w-full h-auto rounded-lg mb-4"
          width={500}
          height={500}
        />
        <div className="flex items-center space-x-2 mb-2">
          <StarIcon className="w-4 h-4 text-grey-500" />
          <p className="text-gray-700">
            {CalcularPromedio(store.comentTienda).toFixed(1)} (
            {store.comentTienda.length} reseñas) · {store.moneda_default.moneda}
          </p>
        </div>
        <p className="text-gray-700 mb-2 line-clamp-2">{store.parrrafo}</p>
        <div className="flex items-center space-x-2 mt-2">
          <Badge variant="secondary">
            {store.municipio}, {store.Provincia}
          </Badge>
          {store.domicilio && <Badge variant="success">Domicilio</Badge>}
        </div>
      </div>

      <AllProducts sectionRefs={sectionRefs} />
    </div>
  );
}

function CalcularPromedio(arr) {
  const suma = arr.reduce((acc, item) => acc + item.star, 0);
  return suma / arr.length || 0;
}

const handleShare = async (title, descripcion, url) => {
  if (navigator.share) {
    try {
      await navigator.share({ title, text: descripcion, url });
    } catch (error) {
      toast({
        title: "Información",
        description: `Error al compartir: ${error.message}`,
        action: <ToastAction altText="Cerrar">Cerrar</ToastAction>,
      });
    }
  } else {
    toast({
      title: "Información",
      description: "La API de compartir no está disponible en este navegador.",
      action: <ToastAction altText="Cerrar">Cerrar</ToastAction>,
    });
  }
};

const pause = (duration) =>
  new Promise((resolve) => setTimeout(resolve, duration));

function ShareIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
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
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
