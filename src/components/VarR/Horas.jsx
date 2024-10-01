import React from "react";
import { format, addDays, startOfWeek, getDay } from "date-fns";
import { es } from "date-fns/locale";
import { Star, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { MyContext } from "@/context/MyContext";
import { useContext } from "react";

export default function Housr({ horario }) {
  const { store, dispatchStore } = useContext(MyContext);

  const now = new Date();
  const newHorario = generateSchedule(store.horario);
  const open = isOpen(newHorario);

  return (
    <div className="relative w-full p-2 rounded-2xl overflow-hidden">
      <div className="relative">
        <Image
          src={
            store.urlPoster ||
            "https://res.cloudinary.com/dbgnyc842/image/upload/v1725399957/xmlctujxukncr5eurliu.png"
          }
          alt={store.name || "Shoes background"}
          className="inset-0 w-full h-auto block object-cover rounded-2xl "
          width={500}
          height={500}
        />
        <div className="absolute inset-0 flex flex-col justify-end text-white rounded-2xl  w-full h-full top-0 z-[1] p-4 bg-gradient-to-t from-black/80 to-transparent">
          <h2 className="text-2xl font-bold mb-2">{store.name}</h2>
          <p className="text-sm mb-3 line-clamp-2 overflow-hidden">
            {store.parrrafo}
          </p>
          <div className="flex items-center mb-2">
            <div className="flex mr-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="h-4 w-4 text-yellow-400 fill-current"
                />
              ))}
            </div>
            <span className="text-sm">
              {CalcularPromedio(store.comentario).toFixed(1)} · (
              {store.comentario.length} reviews) · {store.moneda_default.moneda}
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
const generateSchedule = (inputArray) => {
  const today = new Date();
  const currentDay = today.getDay(); // Día de la semana (0: domingo, 6: sábado)

  // Genera los horarios comenzando desde el día actual
  const horarios = inputArray.map((item, index) => {
    const dayOffset = (index + 7 - currentDay) % 7; // Offset desde el día actual
    const day = new Date(today);
    day.setDate(today.getDate() + dayOffset); // Ajuste al día correcto

    const apertura = new Date(day);
    const cierre = new Date(day);

    // Configura la hora de apertura
    if (item.apertura === 24) {
      apertura.setHours(0, 0, 0, 0); // Medianoche
    } else {
      apertura.setHours(item.apertura, 0, 0, 0);
    }

    // Configura la hora de cierre
    if (item.cierre === 24) {
      cierre.setHours(0, 0, 0, 0);
      cierre.setDate(cierre.getDate() + 1); // Cierra al día siguiente
    } else if (item.cierre < item.apertura) {
      cierre.setHours(item.cierre, 0, 0, 0);
      cierre.setDate(cierre.getDate() + 1); // Cierra al día siguiente si el cierre es más temprano
    } else {
      cierre.setHours(item.cierre, 0, 0, 0);
    }

    return {
      dia: item.dia, // Mantén el nombre del día según el input
      apertura: apertura,
      cierre: cierre,
    };
  });

  // Devuelve los horarios organizados a partir de hoy
  return horarios;
};
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
function CalcularPromedio(arr) {
  const suma = arr.reduce((acc, item) => acc + item.star, 0);
  return suma / arr.length || 0;
}
