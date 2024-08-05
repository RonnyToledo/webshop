"use client";
import { createContext, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const supabase = createClient();
  const [webshop, setwebshop] = useState([]);

  useEffect(() => {
    const obtenerDatos = async () => {
      await supabase
        .from("Sitios")
        .select("*")
        .then((res) => {
          const a = res.data.map((obj) => {
            return { ...obj, categoria: JSON.parse(obj.categoria) };
          });
          setwebshop(a);
        });
    };
    obtenerDatos();
  }, []);

  return (
    <ThemeContext.Provider value={{ webshop, setwebshop }}>
      {children}
    </ThemeContext.Provider>
  );
}
