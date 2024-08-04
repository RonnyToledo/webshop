import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
import cloudinary from "@/lib/cloudinary";
import { extractPublicId } from "cloudinary-build-url";

export async function GET(request, { params }) {
  const supabase = createClient();
  const { data: tienda } = await supabase
    .from(params.tienda)
    .select("*")
    .eq("productId", params.specific);

  return NextResponse.json(...new Set(tienda));
}
export async function PUT(request, { params }) {
  const supabase = createClient();
  const data = await request.formData();
  const Id = data.get("Id");
  const newImage = data.get("newImage");
  const image = data.get("image");
  //Si tenemos imagen nueva
  if (newImage) {
    //Eliminamos la vieja
    if (image) {
      console.log("Acaso estas aqui");

      const publicId = extractPublicId(image);
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
    console.log("salto la eliminacion");

    //Subimos la nueva
    const byte = await newImage.arrayBuffer();
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
    console.log(res.secure_url);

    //Subimos a la BD los datos
    const { data: tienda, error } = await supabase
      .from("Products")
      .update({
        title: data.get("title"),
        descripcion: data.get("descripcion"),
        price: data.get("price"),
        discount: data.get("discount"),
        caja: data.get("caja"),
        favorito: data.get("favorito"),
        agotado: data.get("agotado"),
        visible: data.get("visible"),
        agregados: data.get("agregados"),
        image: res.secure_url,
      })
      .eq("productId", Id)
      .select();
    if (error) {
      console.log("Error");
      console.log(error);

      return NextResponse.json(
        { message: error },
        {
          status: 402,
        }
      );
    }
    return NextResponse.json({ message: "Producto creado" });
  } else {
    console.log("estamos aca");
    //Si no tenemos nueva Imagen solo actualizamos los datos
    const { data: tienda, error } = await supabase
      .from("Products")
      .update({
        title: data.get("title"),
        descripcion: data.get("descripcion"),
        price: data.get("price"),
        discount: data.get("discount"),
        caja: data.get("caja"),
        favorito: data.get("favorito"),
        agotado: data.get("agotado"),
        visible: data.get("visible"),
        agregados: data.get("agregados"),
      })
      .eq("productId", Id)
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
}
export async function DELETE(request, { params }) {
  const supabase = createClient();
  const data = await request.formData();
  const imageOld = data.get("image");
  const Id = data.get("Id");
  console.log(Id);
  if (imageOld) {
    const publicId = extractPublicId(imageOld);
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        console.error("Error eliminando imagen:", error);

        return NextResponse.json(
          { message: error },
          {
            status: 402,
          }
        );
      } else {
        console.log("Imagen eliminada:", result);
      }
    });
  }
  const { data: tienda, error } = await supabase
    .from("Products")
    .delete()
    .eq("productId", Id);
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
