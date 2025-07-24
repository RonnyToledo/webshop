import Link from "next/link";
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/VarR/Header";
import MyProvider from "@/context/MyContext"; // Asegúrate de que la ruta sea correcta
import { supabase } from "@/lib/supa";
import { Promedio } from "@/components/globalFunctions/function";

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
      title: `${name} || R&H-Menu`,
      description: parrrafo,
      openGraph: {
        type: "website",
        locale: "es_ES", // Ajusta según el idioma de tu sitio
        url: `https://randh-menu.vercel.app/t/${tienda}`, // URL de la página
        title: `${name} || R&H-Menu`,
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

export default async function RootLayout({ children, params }) {
  const now = new Date();
  const tienda = (await params).tienda;
  const { data: store, error } = await supabase
    .from("Sitios")
    .select(
      `*,categorias(*), Products (*, coment (star)),codeDiscount (*),comentTienda(star)`
    )
    .eq("sitioweb", tienda)
    .eq("Products.visible", true)
    .single();

  if (error) {
    throw error;
  }

  return (
    <main className="min-h-screen flex items-center flex-col">
      <div className="max-w-lg w-full">
        <MyProvider>
          <Header tienda={tienda} storeSSR={transformObject(store)}>
            {children}
          </Header>
          <Toaster />
        </MyProvider>

        <footer className="max-w-lg flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-gray-100 dark:bg-gray-800">
          <Link
            className="w-full  text-xs hover:underline underline-offset-4 dark:text-gray-400 dark:hover:text-gray-50"
            href="/"
          >
            <p className="flex flex-col justify-center align-center text-base w-fit text-gray-800 dark:text-gray-400">
              {`R&H || Boulevard`}
            </p>
            <p className="flex flex-col justify-center align-center text-xs w-fit text-gray-500 dark:text-gray-400">
              {`© ${now.getFullYear()} R&H. All rights reserved.`}
            </p>
          </Link>
        </footer>
      </div>
    </main>
  );
}
function transformObject({ Products, ...obj }) {
  const useCategories =
    Array.isArray(obj.categorias) && obj.categorias.length > 0
      ? obj.categorias.sort((a, b) => a.order - b.order)
      : [];

  // Crear mapa de órdenes de categorías
  const categoriasMap = {};
  useCategories.forEach((categoria) => {
    categoriasMap[categoria.id] = categoria.order;
  });

  // Ordenar los productos
  const p = Products.map((prod) => ({
    ...prod,
    coment: {
      promedio: Promedio(prod.coment, "star") || 0,
      total: prod.coment.length || 0,
    },
  })).sort((a, b) => {
    // Comparar por orden de categoría primero
    const ordenCategoriaA = categoriasMap[a.caja];
    const ordenCategoriaB = categoriasMap[b.caja];

    if (ordenCategoriaA !== ordenCategoriaB) {
      return ordenCategoriaA - ordenCategoriaB;
    }

    // Si son de la misma categoría, comparar por su orden individual
    return a.order - b.order;
  });
  return {
    ...obj,
    moneda: obj.moneda ? JSON.parse(obj.moneda) : null,
    moneda_default: obj.moneda_default ? JSON.parse(obj.moneda_default) : null,
    horario: obj.horario ? JSON.parse(obj.horario) : null,
    envios: obj.envios ? JSON.parse(obj.envios) : null,
    categorias: useCategories,
    top: obj.name,
    products: p,
    comentTienda: {
      promedio: Promedio(obj.comentTienda, "star") || 0,
      total: obj.comentTienda.length || 0,
      data: obj.comentTienda,
    },
  };
}
