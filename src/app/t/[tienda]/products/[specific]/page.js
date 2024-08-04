import React, { Suspense } from "react";
import { createClient } from "@/lib/supabase";
import Prod from "@/components/Chadcn-components/Product";

export async function generateMetadata({ params }) {
  const supabase = createClient();
  try {
    const { data: product, error } = await supabase
      .from("Products")
      .select("*")
      .eq("productId", params.specific);
    if (error) {
      throw error;
    }
    return {
      title: product[0].title,
      description: product[0].descripcion,
      openGraph: {
        images: [product[0].image],
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
  return <Prod tienda={params.tienda} specific={params.specific} />;
}
