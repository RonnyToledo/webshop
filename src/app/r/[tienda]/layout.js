import Link from "next/link";
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/VarR/Header";
import MyProvider from "@/context/MyContext"; // Asegúrate de que la ruta sea correcta
import { supabase } from "@/lib/supa";

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
    if (!product) {
      return {
        title: "Sitio no encontrado",
        description: "No se encontró el sitio solicitado.",
      };
    }
    const { name, parrrafo, urlPoster } = product;

    return {
      title: `${name} || RandH-Menu`,
      description: parrrafo,
      openGraph: {
        title: `${name} || RandH-Menu`,
        description: parrrafo,
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
  const now = new Date();

  return (
    <main className="min-h-screen flex items-center flex-col">
      <div className="max-w-2xl w-full">
        <MyProvider>
          <Header tienda={params.tienda}>{children}</Header>
          <Toaster />
        </MyProvider>

        <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-gray-100 dark:bg-gray-800">
          <Link
            className="text-xs hover:underline underline-offset-4 dark:text-gray-400 dark:hover:text-gray-50"
            href="/"
          >
            <p className="text-xs text-gray-500 dark:text-gray-400">
              © {now.getFullYear()} R&H. All rights reserved.
            </p>
          </Link>
        </footer>
      </div>
    </main>
  );
}
