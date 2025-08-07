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
