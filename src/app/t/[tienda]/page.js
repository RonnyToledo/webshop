import SHome from "@/components/Chadcn-components/sHome";
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
    console.error("Error al obtener los datos del producto:", error);
    return {
      title: "Error al cargar los metadatos",
    };
  }
}
async function FetchData(tienda) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/tienda/${tienda}`
  ); // Reemplaza con la URL real
  if (!res.ok) {
    throw new Error("Error al obtener los datos");
  }
  const initialData = await res.json();
  return initialData;
}

export default async function page({ params }) {
  const store = await FetchData(params.tienda);
  console.log(store);
  console.log(params.tienda);
  return (
    <>
      <SHome tienda={params.tienda} store1={store} />
    </>
  );
}
