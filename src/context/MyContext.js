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

const roboto = Roboto({ subsets: ["latin"], weight: "400" });
const oswald = Oswald({ subsets: ["latin"], weight: "700" });
const open_Sans = Open_Sans({ subsets: ["latin"], weight: "400" });
const playfair_Display = Playfair_Display({
  subsets: ["latin"],
  weight: "400",
});
const merriweather = Merriweather({ subsets: ["latin"], weight: "400" });
const inter = Inter({ subsets: ["latin"], weight: "400" });
const poppins = Poppins({ subsets: ["latin"], weight: "400" });
const montserrat = Montserrat({ subsets: ["latin"], weight: "400" });
const lato = Lato({ subsets: ["latin"], weight: "400" });
const sevillana = Sevillana({ subsets: ["latin"], weight: "400" });

const fonts = [
  { name: "Roboto", clase: roboto.className },
  { name: "Oswald", clase: oswald.className },
  { name: "Inter", clase: inter.className },
  { name: "Open_Sans", clase: open_Sans.className },
  { name: "Playfair_Display", clase: playfair_Display.className },
  { name: "Merriweather", clase: merriweather.className },
  { name: "Poppins", clase: poppins.className },
  { name: "Montserrat", clase: montserrat.className },
  { name: "Lato", clase: lato.className },
  { name: "Sevillana", clase: sevillana.className },
];

export const MyContext = createContext(); // Cambié el nombre a MyContext para mayor claridad
const initialState = {
  moneda_default: {},
  moneda: [],
  horario: [],
  comentario: [],
  categoria: [],
  envios: [],
  insta: "",
  products: [],
  loading: 0,
  search: "",
};

export default function MyProvider({ children }) {
  const [store, dispatchStore] = useReducer(reducerStore, initialState);
  const [selectedFont, setSelectedFont] = useState(inter.className);

  useEffect(() => {
    const [result] = fonts.filter((obj) => obj.name == store.font);
    setSelectedFont(result?.clase);
    if (store.color) {
      document.documentElement.style.setProperty(
        "--color-primary",
        store.color
      );
    }
  }, [store]);

  return (
    <MyContext.Provider value={{ store, dispatchStore }}>
      <div className={selectedFont}>{children}</div>
    </MyContext.Provider>
  );
}
