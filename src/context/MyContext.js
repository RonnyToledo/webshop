"use client";
import React, { createContext, useEffect, useReducer, useState } from "react";
import { reducerStore } from "@/reducer/reducerGeneral";
import {
  Roboto,
  Oswald,
  Inter,
  Open_Sans,
  Playfair_Display,
  Merriweather,
  Poppins,
  Montserrat,
  Lato,
  Sevillana,
} from "next/font/google";

// Asignación de fuentes en el ámbito del módulo
const roboto = Roboto({ subsets: ["latin"], weight: "400" });
const oswald = Oswald({ subsets: ["latin"], weight: "700" });
const inter = Inter({ subsets: ["latin"], weight: "400" });
const open_Sans = Open_Sans({ subsets: ["latin"], weight: "400" });
const playfair_Display = Playfair_Display({
  subsets: ["latin"],
  weight: "400",
});
const merriweather = Merriweather({ subsets: ["latin"], weight: "400" });
const poppins = Poppins({ subsets: ["latin"], weight: "400" });
const montserrat = Montserrat({ subsets: ["latin"], weight: "400" });
const lato = Lato({ subsets: ["latin"], weight: "400" });
const sevillana = Sevillana({ subsets: ["latin"], weight: "400" });

const fonts = {
  Roboto: roboto.className,
  Oswald: oswald.className,
  Inter: inter.className,
  Open_Sans: open_Sans.className,
  Playfair_Display: playfair_Display.className,
  Merriweather: merriweather.className,
  Poppins: poppins.className,
  Montserrat: montserrat.className,
  Lato: lato.className,
  Sevillana: sevillana.className,
};

export const MyContext = createContext(); // Cambié el nombre a MyContext para mayor claridad

export const initialState = {
  moneda_default: {},
  moneda: [],
  horario: [],
  comentTienda: [],
  categoria: [],
  envios: [],
  insta: "",
  products: [],
  codeDiscount: [],
  loading: 0,
  search: "",
  font: "Inter", // Define la fuente por defecto
  top: "",
  animateCart: false,
};

export default function MyProvider({ children }) {
  const [store, dispatchStore] = useReducer(reducerStore, initialState);
  const [selectedFont, setSelectedFont] = useState(fonts.Inter); // Fuente por defecto
  useEffect(() => {
    // Verificar si hay una fuente en el estado y aplicarla
    const fontClassName = fonts[store.font];
    if (fontClassName) {
      setSelectedFont(fontClassName);
    }
  }, [store]);

  return (
    <MyContext.Provider value={{ store, dispatchStore }}>
      <div className={selectedFont}>{children}</div>
    </MyContext.Provider>
  );
}
