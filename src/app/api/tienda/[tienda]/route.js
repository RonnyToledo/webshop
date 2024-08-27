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
    return NextResponse.json({
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
    }); // Devuelve la respuesta JSON
  } catch (error) {
    console.log("Data not received:", error);
    return NextResponse.json({ error: error.message }, { status: 500 }); // Devuelve un error JSON
  }
}

export async function POST(request, { params }) {
  const supabase = createClient();
  const data = await request.formData();
  const image = data.get("urlPosterNew");

  if (image) {
    // Con imagen nueva
    // Eliminando Imagen antigua
    const imageOld = data.get("urlPoster");
    if (imageOld) {
      const publicId = extractPublicId(imageOld);
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          console.error("Error eliminando imagen:", error);

          return NextResponse.json(
            { message: error },
            {
              status: 401,
            }
          );
        } else {
          console.log("Imagen eliminada:", result);
        }
      });
    }
    const byte = await image.arrayBuffer();
    const buffer = Buffer.from(byte);
    const res = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type: "image" }, (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        })
        .end(buffer);
    });
    //Preparando nueva Imagen
    const { data: tienda, error } = await supabase
      .from("Sitios")
      .update([
        {
          name: data.get("name"),
          parrrafo: data.get("parrrafo"),
          parrafoInfo: data.get("parrafoInfo"),
          horario: data.get("horario"),
          urlPoster: res.secure_url,
        },
      ])
      .eq("sitioweb", params.tienda)
      .select();
    if (error) {
      console.log(error);

      return NextResponse.json(
        { message: error },
        {
          status: 401,
        }
      );
    }
  } else {
    // Actualizacion sin Imagen

    const { data: tienda, error } = await supabase
      .from("Sitios")
      .update([
        {
          name: data.get("name"),
          parrrafo: data.get("parrrafo"),
          parrafoInfo: data.get("parrafoInfo"),
          horario: data.get("horario"),
        },
      ])
      .eq("sitioweb", params.tienda)
      .select();
    if (error) {
      console.log(error);

      return NextResponse.json(
        { message: error },
        {
          status: 401,
        }
      );
    }
  }

  return NextResponse.json({ message: "Producto creado" });
}
export async function PUT(request, { params }) {
  const supabase = createClient();
  const data = await request.formData();

  const { data: tienda, error } = await supabase
    .from("Sitios")
    .update([
      {
        tarjeta: data.get("tarjeta"),
        act_tf: data.get("act_tf"),
        cell: data.get("cell"),
        email: data.get("email"),
        insta: data.get("insta"),
        Provincia: data.get("Provincia"),
        municipio: data.get("municipio"),
        local: data.get("local"),
        domicilio: data.get("domicilio"),
        reservas: data.get("reservas"),
        moneda_default: data.get("moneda_default"),
        moneda: data.get("moneda"),
        envios: data.get("envios"),
      },
    ])
    .eq("sitioweb", params.tienda)
    .select();
  if (error) {
    console.log(error);

    return NextResponse.json(
      { message: error },
      {
        status: 401,
      }
    );
  }

  return NextResponse.json({ message: "Producto creado" });
}
