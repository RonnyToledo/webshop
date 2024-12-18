"use client";
import React from "react";
import { ShoppingBag } from "lucide-react";
import { createContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supa";
import { Toaster } from "@/components/ui/toaster";
import { GoogleAnalytics } from "@next/third-parties/google";
import GoogleAnalytic from "@/components/GA/GA";
import { usePathname, useRouter } from "next/navigation";
import useSWR from "swr"; // Importando SWR
import Footer from "@/components/BoltComponent/Footer";

export const ThemeContext = createContext();

// Creamos el fetcher como una función que retorna una promesa
const createFetcher = () => {
  return async () => {
    try {
      const response = await fetch("/api/GA");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();

      const { data: tiendaData, error } = await supabase
        .from("Sitios")
        .select(
          `*,categorias(*), Products (*, agregados (*), coment (*)),codeDiscount (*),comentTienda(*)`
        )
        .eq("active", true);

      const newArray = tiendaData.map((obj) => {
        const moneda = obj.moneda ? JSON.parse(obj.moneda) : null;
        const moneda_default = obj.moneda_default
          ? JSON.parse(obj.moneda_default)
          : null;
        const horario = obj.horario ? JSON.parse(obj.horario) : null;
        const envios = obj.envios ? JSON.parse(obj.envios) : null;
        const categoria =
          Array.isArray(obj.categorias) && obj.categorias.length > 0
            ? obj.categorias.sort((a, b) => a.order - b.order)
            : [];

        // Clona el objeto sin modificar el original
        const transformedObj = {
          ...obj,
          moneda,
          moneda_default,
          horario,
          categoria,
          envios,
          products: obj.Products, // Si es necesario incluir `Products`
          top: obj.name,
        };

        return transformedObj;
      });

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

        if (newArray) {
          return {
            loading: 100,
            store: newArray,
            products: tiendaProducts,
            api: result,
          };
        }
      } else {
        notFound();
      }
    } catch (error) {
      console.error("Error:", error);
      throw error; // Importante: propagar el error para que SWR lo maneje
    }
  };
};

export default function Navbar({ children }) {
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
      revalidateOnFocus: false, // Evita revalidaciones innecesarias
      shouldRetryOnError: true, // Reintentar en caso de error
      dedupingInterval: 5000, // Evita múltiples llamadas en 5 segundos
      suspense: false, // Desactiva Suspense
      fallbackData: {
        store: [], // Datos iniciales de reserva
        products: [],
        loading: 0,
      },
      onError: (error) => {
        console.error("Error en SWR:", error);
      },
      onSuccess: (data) => {
        setwebshop(data);
      },
    }
  );

  // Efecto para manejar los datos
  useEffect(() => {
    if (data) {
      setwebshop(data);
    }
  }, [data, setwebshop]);

  useEffect(() => {
    setisRootPath(pathname === "/");
  }, [pathname]);

  return (
    <main>
      <GoogleAnalytic />

      {isRootPath && (
        <nav className="backdrop-blur-xl shadow-lg sticky top-0  z-50">
          <div className=" mx-auto px-4">
            <div className="flex justify-between items-center h-14">
              <div className="flex items-center space-x-8">
                <div className="flex items-center">
                  <ShoppingBag className="h-8 w-8 text-gray-600" />
                  <span className="ml-2 text-xl font-bold text-gray-800">
                    R&H || Boulevard
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4"></div>
            </div>
          </div>
        </nav>
      )}
      <ThemeContext.Provider value={{ webshop, setwebshop }}>
        {children}
      </ThemeContext.Provider>
      {isRootPath && <Footer />}
      <Toaster />

      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
    </main>
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
