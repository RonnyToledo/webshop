"use client";
import { createContext, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const supabase = createClient();
  const [webshop, setwebshop] = useState({ store: [], products: [] });

  useEffect(() => {
    const obtenerDatos = async () => {
      await supabase
        .from("Sitios")
        .select("*")
        .then((res) => {
          const a = res.data.map((obj) => {
            return { ...obj, categoria: JSON.parse(obj.categoria) };
          });
          supabase
            .from("Products")
            .select("*")
            .then((respuesta) => {
              setwebshop({ store: a, products: respuesta.data });
            });
        });
    };
    obtenerDatos();
  }, [supabase]);

  return (
    <ThemeContext.Provider value={{ webshop, setwebshop }}>
      {children}
    </ThemeContext.Provider>
  );
}
