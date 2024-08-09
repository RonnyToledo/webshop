"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useContext } from "react";
import { Badge } from "@/components/ui/badge";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import AllProducts from "./AllProducts";
import Loading from "../component/loading";

export default function RHome({ context, tienda }) {
  const { toast } = useToast();
  const { store, dispatchStore } = useContext(context);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const now = new Date();

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
  useEffect(() => {
    const CambiarDatos = () => {
      setProducts(store.products);
    };
    CambiarDatos();
  }, [store]);

  return (
    <>
      <div className="bg-gray-100 p-4">
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">{store.name}</h1>
            <div className="flex items-center space-x-2">
              <ShareIcon
                onClick={handleShare}
                className="w-6 h-6 text-gray-600"
              />
            </div>
          </div>
          <Link href="https://r-and-h.vercel.app">
            <p className="text-gray-500">r-and-h.vercel.app</p>
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <Housr horario={store.horario} />
          <h2 className="text-2xl font-bold mb-2">{store.name}</h2>
          <Image
            src={
              store.urlPoster
                ? store.urlPoster
                : "https://res.cloudinary.com/dbgnyc842/image/upload/v1721753647/kiphxzqvoa66wisrc1qf.jpg"
            }
            alt={store.name}
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
        <AllProducts context={context} />
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

function ChevronDownIcon(props) {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function MenuIcon(props) {
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
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function Package2Icon(props) {
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
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
      <path d="M12 3v6" />
    </svg>
  );
}

function BookmarkIcon(props) {
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
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
  );
}

function ExpandIcon(props) {
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
      <path d="m21 21-6-6m6 6v-4.8m0 4.8h-4.8" />
      <path d="M3 16.2V21m0 0h4.8M3 21l6-6" />
      <path d="M21 7.8V3m0 0h-4.8M21 3l-6 6" />
      <path d="M3 7.8V3m0 0h4.8M3 3l6 6" />
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

function XIcon(props) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
