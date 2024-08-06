"use client";
import "./globals.css";
import { createContext, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { Toaster } from "@/components/ui/toaster";
import { Store } from "lucide-react";
import Link from "next/link";

export const ThemeContext = createContext();

export default function RootLayout({ children }) {
  const supabase = createClient();
  const [webshop, setwebshop] = useState({
    store: [],
    products: [],
    loading: 0,
  });
  const pause = (duration) => {
    return new Promise((resolve) => {
      setTimeout(resolve, duration);
    });
  };

  function ChangeLoading(value) {
    // Asegúrate de que `setwebshop` y `webshop` estén definidos en el contexto adecuado
    if (webshop.loading < value) {
      setwebshop({ ...webshop, loading: value });
    }
  }
  useEffect(() => {
    const obtenerDatos = async () => {
      ChangeLoading(10); // Establecer carga inicial
      try {
        const res = await supabase.from("Sitios").select("*");
        const a = res.data.map((obj) => {
          return { ...obj, categoria: JSON.parse(obj.categoria) };
        });
        const respuesta = await supabase.from("Products").select("*");
        setwebshop({
          ...webshop,
          loading: 50,
          store: a,
          products: respuesta.data,
        });
        // Pausa de 1 segundo antes de establecer carga completa
        await pause(1000);
        setwebshop({
          ...webshop,
          loading: 100,
          store: a,
          products: respuesta.data,
        });
      } catch (error) {
        console.error("Error al obtener datos:", error);
        // Manejo de errores (opcional)
      }
    };
    obtenerDatos();
  }, [supabase]);

  return (
    <html lang="es">
      <body>
        <header className="sticky top-0 z-40 bg-background shadow">
          <div className="container px-4 py-4 md:px-6 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2" prefetch={false}>
              <Store className="h-6 w-6" />
              <span className="text-xl font-bold">R&H-Boulevard</span>
            </Link>
            {/* <div className="relative flex-1 max-w-md">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search the Microsoft Store"
              className="pl-10 pr-4 py-2 rounded-md bg-muted w-full"
            />
          </div> */}
            {/* <div className="hidden md:flex items-center gap-4">
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground"
              prefetch={false}
            >
              Sign in
            </Link>
            <Button variant="outline">
              <div className="w-5 h-5 mr-2" />
              Cart
            </Button>
          </div> */}
          </div>
        </header>
        <ThemeContext.Provider value={{ webshop, setwebshop }}>
          {children}{" "}
        </ThemeContext.Provider>

        <Toaster />
        <footer className="bg-muted py-6">
          <div className="container px-4 md:px-6 flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Store className="h-6 w-6" />
              <span className="text-lg font-bold">R&H-Boulevard</span>
            </div>
            {/* <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground"
              prefetch={false}
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground"
              prefetch={false}
            >
              Terms of Use
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground"
              prefetch={false}
            >
              Trademarks
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground"
              prefetch={false}
            >
              About Our Ads
            </Link>
          </div> */}
          </div>
        </footer>
      </body>
    </html>
  );
}