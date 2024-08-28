import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
import { extractPublicId } from "cloudinary-build-url";
import cloudinary from "@/lib/cloudinary";

export async function GET(request, { params }) {
  async function fetchData(url) {
    try {
      const response = await fetch(url, {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          Authorization: "Bearer " + process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        },
        cache: "no-store",
      });
      // Verifica si la respuesta fue exitosa (código de estado 2xx)
      if (!response.ok) {
        // Si no fue exitosa, lanza un error con el código de estado
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Si la respuesta es exitosa, procesa los datos
      const data = await response.json();
      return data;
    } catch (error) {
      // Maneja cualquier error que ocurra durante la solicitud o el procesamiento
      console.error("Error fetching data:", error.message);
      throw error; // Lanza el error para manejarlo más arriba
    }
  }

  try {
    // Uso de la función y espera el resultado
    const data = await fetchData(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Sitios?select=*&sitioweb=eq.${params.tienda}`
    );
    const [a] = data;
    const products = await fetchData(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Products?select=*&storeId=eq.${a.UUID}`
    );
    const tienda = {
      ...a,
      categoria: JSON.parse(a.categoria),
      moneda: JSON.parse(a.moneda),
      moneda_default: JSON.parse(a.moneda_default),
      horario: JSON.parse(a.horario),
      comentario: JSON.parse(a.comentario),
      envios: JSON.parse(a.envios),
      products: products.map((obj) => ({
        ...obj,
        agregados: JSON.parse(obj.agregados),
        coment: JSON.parse(obj.coment),
      })),
    }; // Devuelve la respuesta JSON
    const link = tienda.products.map((obj) => {
      return {
        name: obj.title,
        link: `https://rh-menu.vercel.app/${tienda.variable}/${tienda.sitioweb}/products/${obj.productId}`,
      };
    });
    return NextResponse.json(link);
  } catch (error) {
    console.log("Data not received:", error);
    return NextResponse.json({ error: error.message }, { status: 500 }); // Devuelve un error JSON
  }
}
