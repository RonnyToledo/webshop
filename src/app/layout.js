"use client";
import "./globals.css";
import { createContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supa";
import { Toaster } from "@/components/ui/toaster";
import { Store } from "lucide-react";
import Link from "next/link";
import { GoogleAnalytics } from "@next/third-parties/google";
import GoogleAnalytic from "@/components/GA/GA";
import { usePathname } from "next/navigation";

export const ThemeContext = createContext();

import { Oswald } from "next/font/google";

const roboto = Oswald({
  subsets: ["latin"],
  weight: ["700"], // Especifica los pesos aquí
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
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
  function ChangeLoading(value) {
    if (webshop.loading < value) {
      setwebshop((prev) => ({ ...prev, loading: value }));
    }
  }

  useEffect(() => {
    const obtenerDatos = async () => {
      ChangeLoading(10); // Establecer carga inicial
      try {
        const res = await supabase
          .from("Sitios")
          .select(
            "id,sitioweb,UUID,urlPoster,Provincia,name,variable,categoria,municipio,tipo"
          );
        console.log(res.data);
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
  }, [supabase]);
  useEffect(() => {
    setisRootPath(pathname === "/" || /^\/[a-zA-Z]$/.test(pathname));
  }, [pathname]);

  return (
    <html lang="en" className={roboto.className}>
      <GoogleAnalytic />
      <body className="flex flex-col">
        {isRootPath && (
          <header className="sticky top-0 z-[5] bg-background shadow">
            <div className="container px-4 py-4 md:px-6 flex items-center justify-between">
              <Link
                href="/"
                className="flex items-center gap-2"
                prefetch={false}
              >
                <Store className="h-6 w-6" />
                <span className="text-xl font-bold">R&H-Boulevard</span>
              </Link>
            </div>
          </header>
        )}
        <ThemeContext.Provider value={{ webshop, setwebshop }}>
          {children}
        </ThemeContext.Provider>

        <Toaster />
        <footer className="bg-muted py-6 max-w-2xl w-full ">
          <div className="container px-4 md:px-6 flex flex-col md:flex-row items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-2">
                <Store className="h-6 w-6" />
                <span className="text-lg font-bold">R&H-Boulevard</span>
              </div>
            </Link>
          </div>
        </footer>
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
    </html>
  );
}
