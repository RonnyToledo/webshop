"use client";
import "./globals.css";
import { createContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supa";
import { Toaster } from "@/components/ui/toaster";
import { GoogleAnalytics } from "@next/third-parties/google";
import GoogleAnalytic from "@/components/GA/GA";
import { usePathname, useRouter } from "next/navigation";
import useSWR from "swr"; // Importando SWR

export const ThemeContext = createContext();

import { Oswald } from "next/font/google";
import Navbar from "@/components/BoltComponent/Navbar";
import Footer from "@/components/BoltComponent/Footer";

// Cargando la fuente
const roboto = Oswald({
  subsets: ["latin"],
  weight: ["700"], // Especifica los pesos aquí
});

// Creamos el fetcher como una función que retorna una promesa
const createFetcher = () => {
  return async () => {
    try {
      const response = await fetch("/api/GA");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      console.log("result ok", result);

      const { data: tiendaData, error } = await supabase
        .from("Sitios")
        .select("*, categorias(*), comentTienda(*)")
        .eq("active", true);
      console.log("tiendaData ok", tiendaData);

      if (error) throw error;
      if (tiendaData) {
        // Transformamos los datos como lo hacía la función original

        const { data: tiendaProducts, error } = await supabase
          .from("Products")
          .select("*, agregados (*), coment (*)")
          .eq("visible", true)
          .in(
            "storeId",
            tiendaData.map((obj) => obj.UUID)
          )
          .in("productId", obtenerProductIdsConLimite(result));
        console.log("tiendaProducts ok", tiendaProducts);

        return {
          loading: 100,
          store: tiendaData,
          products: tiendaProducts,
          api: result,
        };
      } else {
        notFound();
      }
    } catch (error) {
      console.error("Error:", error);
      throw error; // Importante: propagar el error para que SWR lo maneje
    }
  };
};

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isRootPath, setisRootPath] = useState("");
  const [webshop, setwebshop] = useState({
    store: [],
    products: [],
    loading: 0,
  });

  const { data, error, mutate, isValidating } = useSWR(
    [`sitios-R&H`], // Clave única para el caché
    createFetcher(),
    {
      refreshInterval: 10 * 60 * 1000, // 10 minutos
      suspense: true,
      revalidateOnFocus: false, // Evita revalidaciones innecesarias
      shouldRetryOnError: true, // Reintentar en caso de error
      dedupingInterval: 5000, // Evita múltiples llamadas en 5 segundos
      onError: (error) => {
        console.error("Error en SWR:", error);
      },
      onSuccess: (data) => {
        // Opcional: manejar datos exitosos
        console.log(data);
        setwebshop(data);
      },
    }
  );

  // Efecto para manejar los datos
  useEffect(() => {
    if (data) {
      setwebshop(data);
    }
  }, [data]);

  useEffect(() => {
    setisRootPath(pathname === "/" || /^\/[a-zA-Z]$/.test(pathname));
  }, [pathname]);

  return (
    <html lang="es" className={roboto.className}>
      <GoogleAnalytic />
      <body className="min-h-screen flex items-center flex-col">
        <div className="max-w-lg w-full">
          {isRootPath && <Navbar />}
          <ThemeContext.Provider value={{ webshop, setwebshop }}>
            {children}
          </ThemeContext.Provider>
          {isRootPath && <Footer />}
          <Toaster />
        </div>
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
    </html>
  );
}
function obtenerProductIdsConLimite(data, limite = 100) {
  const productIds = [];
  let totalProductos = 0;

  for (const nombre in data) {
    if (data[nombre].products) {
      const ids = Object.keys(data[nombre].products);
      for (const id of ids) {
        if (totalProductos < limite) {
          productIds.push(id);
          totalProductos++;
        } else {
          break; // Salir del bucle si se alcanza el límite
        }
      }
    }
    if (totalProductos >= limite) {
      break; // Salir del bucle principal si se alcanza el límite
    }
  }

  return productIds;
}
