"use client";
import "./globals.css";
import { createContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supa";
import { Toaster } from "@/components/ui/toaster";
import { Store } from "lucide-react";
import Link from "next/link";
import { GoogleAnalytics } from "@next/third-parties/google";
import GoogleAnalytic from "@/components/GA/GA";
import { usePathname, useRouter } from "next/navigation";

export const ThemeContext = createContext();

import { Oswald } from "next/font/google";
import Navbar from "@/components/BoltComponent/Navbar";
import Footer from "@/components/BoltComponent/Footer";

const roboto = Oswald({
  subsets: ["latin"],
  weight: ["700"], // Especifica los pesos aquí
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [webshop, setwebshop] = useState({
    store: [],
    products: [],
    loading: 0,
  });
  const [isRootPath, setisRootPath] = useState("");

  // Función para pausar el proceso por una duración específica
  const pause = (duration) => {
    return new Promise((resolve) => {
      setTimeout(resolve, duration);
    });
  };

  // Función para cambiar el estado de "loading"
  const ChangeLoading = useCallback(
    (value) => {
      if (webshop.loading < value) {
        setwebshop((prev) => ({ ...prev, loading: value }));
      }
    },
    [webshop.loading]
  );

  useEffect(() => {
    const obtenerDatos = async () => {
      ChangeLoading(10); // Establecer carga inicial
      try {
        const res = await supabase
          .from("Sitios")
          .select(
            "id,sitioweb,UUID,urlPoster,Provincia,name,variable,categoria,municipio,tipo"
          );
        const a = res.data.map((obj) => {
          return { ...obj, categoria: JSON.parse(obj.categoria) };
        });
        const respuesta = await supabase
          .from("Products")
          .select("id,title,image,caja,creado,productId,storeId");

        // Pausa de 1 segundo antes de establecer carga completa
        await pause(1000);

        setwebshop({
          loading: 100,
          store: a,
          products: respuesta.data,
        });
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };
    obtenerDatos();
  }, [ChangeLoading]);

  useEffect(() => {
    setisRootPath(pathname === "/" || /^\/[a-zA-Z]$/.test(pathname));
  }, [pathname]);

  return (
    <html lang="es" className={roboto.className}>
      <GoogleAnalytic />
      <body className="min-h-screen flex items-center flex-col">
        <div className="max-w-2xl w-full">
          {isRootPath && <Navbar />}
          <ThemeContext.Provider value={{ webshop, setwebshop }}>
            {children}
          </ThemeContext.Provider>

          <Toaster />
          <Footer />
        </div>
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
    </html>
  );
}
