import React from "react";
import { format, addDays, startOfWeek, getDay } from "date-fns";
import { es } from "date-fns/locale";
import { Star, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { MyContext } from "@/context/MyContext";
import { useContext } from "react";
import { StarCount } from "../globalFunctions/components";
import { Promedio } from "../globalFunctions/function";
import { generateSchedule } from "../globalFunctions/function";

export default function Housr() {
  const { store, dispatchStore } = useContext(MyContext);

  const now = new Date();
  const newHorario = generateSchedule(store.horario);
  const open = isOpen(newHorario);

  return (
    <div className="relative">
      <Image
        src={
          store.urlPoster ||
          "https://res.cloudinary.com/dbgnyc842/image/upload/v1725399957/xmlctujxukncr5eurliu.png"
        }
        alt={store.name || "Shoes background"}
        className="inset-0 w-full h-auto block object-cover object-center "
        width={500}
        height={500}
        style={{ height: "60vh" }}
      />
      <div className="absolute inset-0 flex flex-col justify-end text-white w-full h-full top-0 z-[1]  bg-gradient-to-t from-black/80 to-transparent">
        <div className="p-4 ">
          <h2 className="text-2xl font-bold mb-2">{store.name}</h2>
          <p className="text-sm mb-3 line-clamp-2 overflow-hidden">
            {store.parrrafo}
          </p>
          <div className="flex items-center mb-2">
            <div className="flex mr-2">
              <StarCount array={store.comentTienda} campo={"star"} />
            </div>
            <span className="text-sm">
              {Promedio(store.comentTienda, "star").toFixed(1)} · (
              {store.comentTienda.length} reviews) ·{" "}
              {store.moneda_default.moneda}
            </span>
          </div>
          <div className="flex items-center">
            <Badge
              variant={open.open ? "success" : "destructive"}
              className="mr-2"
            >
              {open.open ? "ABIERTO" : "CERRADO"}
            </Badge>
            <Clock className="h-4 w-4 mr-1" />
            {open.open ? (
              <p className="text-gray-500">
                {estadoCierre(newHorario) ? (
                  <>
                    Cierra{" "}
                    <relative-time
                      lang="es"
                      datetime={estadoCierre(newHorario)}
                      no-title
                    ></relative-time>{" "}
                  </>
                ) : (
                  "24 horas"
                )}
              </p>
            ) : (
              <p className="text-gray-500">
                {estadoApertura(newHorario) ? (
                  <>
                    Abre{" "}
                    <relative-time
                      lang="es"
                      datetime={estadoApertura(newHorario)}
                      no-title
                    ></relative-time>
                  </>
                ) : (
                  "24 horas"
                )}
              </p>
            )}{" "}
          </div>
        </div>
        <div className="bg-gray-100 h-8 rounded-t-2xl bottom-0 translate-y-px"></div>
      </div>
    </div>
  );
}

function estadoApertura(fechas) {
  const ahora = new Date();
  let resultados = [];

  fechas.forEach(({ apertura, cierre }) => {
    const abierto = ahora >= apertura && ahora < cierre;

    let tiempoRestante = null;
    if (abierto) {
      tiempoRestante = new Date(cierre - ahora);
    } else {
      // Si está cerrado, se calcula el tiempo hasta la próxima apertura
      tiempoRestante = new Date(apertura - ahora);
    }

    resultados.push({
      apertura,
      cierre,
      abierto,
      tiempoRestante: {
        horas: Math.floor(tiempoRestante / (1000 * 60 * 60)),
        minutos: Math.floor((tiempoRestante % (1000 * 60 * 60)) / (1000 * 60)),
        segundos: Math.floor((tiempoRestante % (1000 * 60)) / 1000),
      },
    });
  });
  let proximaApertura = null;

  for (let i = 0; i < resultados.length; i++) {
    const tiempo = resultados[i % 7].tiempoRestante;
    const apertura = resultados[i % 7].apertura;
    const cierre = resultados[(i + 6) % 7].cierre;
    const cierreHoy = resultados[i % 7].cierre;

    // Verifica si hay horas, minutos o segundos positivos
    if (tiempo.horas > 0 || tiempo.minutos > 0 || tiempo.segundos > 0) {
      //Si no abre hoy
      if (!(apertura.toISOString() == cierreHoy.toISOString())) {
        //cierre despues de la apertura siguiente
        if (apertura > cierre) {
          //Si no es 24 horas
          if (!(apertura.toISOString() == cierre.toISOString())) {
            // no ha pasado la apertura
            if (apertura > ahora) {
              proximaApertura = resultados[i % 7].apertura; // Guarda la apertura
              break; // Rompe el ciclo al encontrar el primer tiempo positivo
            }
          }
        }
      }
    }
  }
  return proximaApertura;
}
function estadoCierre(fechas) {
  const ahora = new Date();
  let estado = [];

  for (let i = 0; i < fechas.length; i++) {
    const cerrado =
      ahora >= fechas[i]?.cierre && ahora < fechas[(i + 1) % 7]?.apertura;

    let tiempoRestante = null;

    tiempoRestante = new Date(fechas[(i + 1) % 7]?.apertura - ahora);

    estado.push({
      apertura: fechas[i % 7]?.apertura,
      cierre: fechas[i % 7]?.cierre,
      cerrado,
      tiempoRestante: {
        horas: Math.floor(tiempoRestante / (1000 * 60 * 60)),
        minutos: Math.floor((tiempoRestante % (1000 * 60 * 60)) / (1000 * 60)),
        segundos: Math.floor((tiempoRestante % (1000 * 60)) / 1000),
      },
    });
  }

  let proximoCierre = null;

  for (let i = 0; i < estado.length; i++) {
    const tiempo = estado[i % 7].tiempoRestante;
    const apertura = estado[(i + 1) % 7].apertura;
    const aperturahoy = estado[i % 7].apertura;
    const cierre = estado[i % 7].cierre;

    if (cierre > ahora) {
      if (!(apertura.toISOString() == cierre.toISOString())) {
        if (aperturahoy.toISOString() == cierre.toISOString()) {
          // Verifica si hay horas, minutos o segundos positivos
          proximoCierre = cierre; // Guarda la apertura
          break; // Rompe el ciclo al encontrar el primer tiempo positivo
        }
      }
    }
  }
  return proximoCierre;
}

function isOpen(newHorario) {
  const now = new Date();

  let element;
  for (let index = 0; index < newHorario.length; index++) {
    if (
      !(
        newHorario[index]?.apertura.toISOString() ==
        newHorario[index]?.cierre.toISOString()
      )
    ) {
      if (
        newHorario[index]?.apertura <= now &&
        newHorario[index]?.cierre > now
      ) {
        element = {
          week: newHorario[index]?.apertura.getDay() % 7,
          open: true,
        };
      }
    }
  }
  if (element) {
    return element;
  } else {
    return { week: 7, open: false }; // Está cerrado
  }
}
