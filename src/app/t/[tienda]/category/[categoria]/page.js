import React from "react";
import CategoryShowcase from "@/components/VarR/Category";
import { supabase } from "@/lib/supa";

export async function generateMetadata({ params }) {
  try {
    const tienda = (await params).tienda;
    const categoria = (await params).categoria;
    const { data: product, error } = await supabase
      .from("categorias")
      .select("*")
      .eq("id", categoria)
      .single();

    if (error) {
      throw error;
    }

    if (!product) {
      return {
        title: "Sitio no encontrado",
        description: "No se encontró el sitio solicitado.",
      };
    }
    const { name, image, description } = product;

    return {
      title: `Categoria: ${name} || R&H-Menu`,
      description: description,
      openGraph: {
        type: "website",
        locale: "es_ES", // Ajusta según el idioma de tu sitio
        url: `https://randh-menu.vercel.app/t/${tienda}/category/${categoria}`, // URL de la página
        title: `Categoria: ${name} || R&H-Menu`,
        description: description,
        images: [
          {
            url:
              image ||
              "https://res.cloudinary.com/dbgnyc842/image/upload/v1721753647/kiphxzqvoa66wisrc1qf.jpg",
            width: 1200,
            height: 630,
            alt: `${name} - Imagen de vista previa`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `Categoria: ${name} || RandH-Menu`,
        description: description,
        images: [
          image ||
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

export default async function Page({ params }) {
  const categoria = (await params).categoria;
  // Determinar el componente según los parámetros
  return <CategoryShowcase categoria={categoria} />;
}
