import React from "react";
import CommentsPage from "@/components/VarR/coments-page";

export async function generateMetadata({ params }) {
  try {
    const tienda = (await params).tienda;
    const { data: product, error } = await supabase
      .from("Sitios")
      .select("*")
      .eq("sitioweb", tienda)
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
    const { name, parrrafo, urlPoster } = product;

    return {
      title: `Coments-${name} || R&H-Menu`,
      description: parrrafo,
      openGraph: {
        type: "website",
        locale: "es_ES", // Ajusta según el idioma de tu sitio
        url: `https://randh-menu.vercel.app/t/${tienda}/about`, // URL de la página
        title: `Coments-${name} || R&H-Menu`,
        description: parrrafo,
        images: [
          {
            url:
              urlPoster ||
              "https://res.cloudinary.com/dbgnyc842/image/upload/v1721753647/kiphxzqvoa66wisrc1qf.jpg",
            width: 1200,
            height: 630,
            alt: `${name} - Imagen de vista previa`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `Coments-${name} || RandH-Menu`,
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
export default function page() {
  return <CommentsPage />;
}
