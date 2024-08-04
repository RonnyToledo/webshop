"use client";
import "./globals.css";
import { createContext, useReducer } from "react";
import { reducerStore } from "@/reducer/reducerGeneral";
import { createClient } from "@/lib/supabase";
import { ThemeProvider } from "@/context/createContext";
import { ThemeContext } from "@/context/createContext";
import { Toaster } from "@/components/ui/toaster";

export const context = createContext();
const products = [];
const store1 = {
  moneda_default: {},
  moneda: [],
  horario: [],
  comentario: [],
  categoria: [],
  envios: [],
  insta: "",
  products: products,
};

export default function RootLayout({ children }) {
  const [store, dispatchStore] = useReducer(reducerStore, store1);

  return (
    <html lang="es">
      <body>
        <ThemeProvider>
          <context.Provider value={{ store, dispatchStore }}>
            {children}
          </context.Provider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
