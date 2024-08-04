import THome from "@/components/Chadcn-components/tHome";
import React from "react";
import { createClient } from "@/lib/supabase";

export async function generateMetadata({ params }) {
  const supabase = createClient();
  try {
    const { data: product, error } = await supabase
      .from("Sitios")
      .select("*")
      .eq("sitioweb", params.tienda);
    if (error) {
      throw error;
    }
    return {
      title: product[0].name,
      description: product[0].parrafoInfo,
      openGraph: {
        title: product[0].name,
        description: product[0].parrafoInfo,
        images: [
          product[0].urlPoster
            ? product[0].urlPoster
            : "https://res.cloudinary.com/dbgnyc842/image/upload/v1721753647/kiphxzqvoa66wisrc1qf.jpg",
        ],
      },
    };
  } catch (error) {
    alert("Error al obtener los datos del producto:", error);
    return {
      title: "Error al cargar los metadatos",
    };
  }
}

export default function page({ params }) {
  return (
    <>
      <THome tienda={params.tienda} />
    </>
  );
}
