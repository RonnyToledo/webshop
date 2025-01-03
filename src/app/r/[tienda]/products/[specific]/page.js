import React, { Suspense } from "react";
import { supabase } from "@/lib/supa";
import { ProductDetailComponent } from "@/components/VarR/product-detail";

export async function generateMetadata({ params }) {
  try {
    const { data: product, error } = await supabase
      .from("Products")
      .select()
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
    console.error("Error al obtener los datos del producto:", error);
    return {
      title: "Error al cargar los metadatos",
    };
  }
}

export default function page({ params }) {
  return (
    <ProductDetailComponent tienda={params.tienda} specific={params.specific} />
  );
}
