import Link from "next/link";
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/VarT/Header";
import MyProvider from "@/context/MyContext"; // Asegúrate de que la ruta sea correcta
import { supabase } from "@/lib/supa";
import Footer from "@/components/VarT/Footer";

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

    const { name, parrafoInfo, urlPoster } = product;

    return {
      title: `${name} || RandH-Menu`,
      description: parrafoInfo,
      openGraph: {
        title: `${name} || RandH-Menu`,
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
            <Footer />
          </MyProvider>
        </div>
      </main>
    </>
  );
}
