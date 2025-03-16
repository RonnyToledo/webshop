import React from "react";
import Head from "next/head";
import Footer from "./Footer";
import { generateSchedule } from "../globalFunctions/function";
import {
  HeaderName,
  CartComponent,
  HeaderRight,
  OpenClose,
} from "./HeaderClient";

export default function Header({ children, storeSSR }) {
  const newHorario = generateSchedule(storeSSR?.horario);
  const open = isOpen(newHorario);

  return (
    <div className=" max-w-lg w-full">
      <Head>
        <title>
          {storeSSR.name} - {storeSSR.tipo} en {storeSSR.municipio}
        </title>
        <meta name="description" content={storeSSR.parrrafo} />
        <meta
          name="keywords"
          content={`${storeSSR.tipo}, ${storeSSR.name}, ${storeSSR.Provincia}, ${storeSSR.municipio},${storeSSR.sitioweb}`}
        />
      </Head>
      <main>
        <header className="max-w-lg flex items-center justify-between gap-4 sticky top-0 p-2 h-12 md:h-16 bg-white  w-full z-[10]">
          <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-50">
            <HeaderName storeSSR={storeSSR} />
            <div>
              <div>{storeSSR.name}</div>
              <div className="flex items-center">
                <div
                  className={
                    open.open
                      ? "rounded-full bg-white  px-1 py-0.5 text-gray-900"
                      : "rounded-full bg-red-700  px-1 py-0.5 text-white"
                  }
                  style={{ fontSize: "8px" }}
                >
                  {open.open ? "ABIERTO" : "CERRADO"}
                </div>
                <OpenClose />
              </div>
            </div>
          </div>
          <HeaderRight />
        </header>

        <div className="min-h-screen">{children}</div>
        <CartComponent />
        <div
          id="sticky-footer"
          className="bg-transparent sticky bottom-0 h-px w-full"
        ></div>
        <Footer />
      </main>
    </div>
  );
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
