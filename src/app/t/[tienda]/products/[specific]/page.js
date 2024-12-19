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
      title: `${product[0].title} || R&H-Menu`,
      description: product[0].descripcion,
      openGraph: {
        type: "website",
        locale: "es_ES", // Ajusta según el idioma de tu sitio
        url: `https://randh-menu.vercel.app/t/${params.tienda}`, // URL de la página
        title: `${product[0].title} || R&H-Menu`,
        description: product[0].descripcion,
        images: [
          {
            url:
              product[0].image ||
              "https://res.cloudinary.com/dbgnyc842/image/upload/v1721753647/kiphxzqvoa66wisrc1qf.jpg",
            width: 1200,
            height: 630,
            alt: `${product[0].title} - Imagen de vista previa`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${product[0].title} || R&H-Menu`,
        description: product[0].descripcion,
        images: [
          product[0].image ||
            "https://res.cloudinary.com/dbgnyc842/image/upload/v1721753647/kiphxzqvoa66wisrc1qf.jpg",
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

export default function page({ params }) {
  return (
    <ProductDetailComponent tienda={params.tienda} specific={params.specific} />
  );
}
