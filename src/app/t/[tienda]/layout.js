import Link from "next/link";
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Chadcn-components/Header";
import MyProvider from "@/context/MyContext"; // Asegúrate de que la ruta sea correcta
import { supabase } from "@/lib/supa";

// Extraer la lógica de fecha fuera del componente para optimización
const currentYear = new Date().getFullYear();

export async function generateMetadata({ params }) {
  try {
    const { data: products, error } = await supabase
      .from("Sitios")
      .select("*")
      .eq("sitioweb", params.tienda);

    if (error) {
      throw error;
    }

    const product = products?.[0];
    console.log(product);
    if (!product) {
      return {
        title: "Sitio no encontrado",
        description: "No se encontró el sitio solicitado.",
      };
    }

    const { name, parrafoInfo, urlPoster } = product;

    return {
      title: `${name} || R&H-Boulevard`,
      description: parrafoInfo,
      openGraph: {
        title: `${name} || R&H-Boulevard`,
        description: parrafoInfo,
        images: [
          urlPoster ||
            "https://res.cloudinary.com/dbgnyc842/image/upload/v1721753647/kiphxzqvoa66wisrc1qf.jpg",
        ],
      },
    };
  } catch (error) {
    console.error("Error al obtener los datos del sitio:", error);
    return {
      title: "Error al cargar los metadatos",
      description: "Ocurrió un error al cargar la información del sitio.",
    };
  }
}

export default function RootLayout({ children, params }) {
  return (
    <>
      <main className="min-h-screen flex items-center flex-col">
        <div className="max-w-2xl w-full">
          <MyProvider>
            <Header tienda={params.tienda} />
            {children}
            <Toaster />
          </MyProvider>

          <Footer />
        </div>
      </main>
    </>
  );
}

// Componente Footer separado para modularidad
function Footer() {
  return (
    <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-gray-100 dark:bg-gray-800">
      <p className="text-xs text-gray-500 dark:text-gray-400">
        © {currentYear} R&H. All rights reserved.
      </p>
      <nav className="sm:ml-auto flex gap-4 sm:gap-6">
        <Link
          className="text-xs hover:underline underline-offset-4 dark:text-gray-400 dark:hover:text-gray-50"
          href="#"
        >
          Terms of Service
        </Link>
        <Link
          className="text-xs hover:underline underline-offset-4 dark:text-gray-400 dark:hover:text-gray-50"
          href="#"
        >
          Privacy
        </Link>
      </nav>
    </footer>
  );
}
