import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export async function POST(request, { params }) {
  const supabase = createClient();
  const data = await request.formData();
  const comentario = JSON.parse(data.get("comentario"));
  const { data: tienda, error } = await supabase
    .from("comentTienda")
    .insert({ ...comentario, UIStore: data.get("UUID") })
    .select("star");
  if (error) {
    console.log(error);

    return NextResponse.json(
      { message: error },
      {
        status: 401,
      }
    );
  }
  return NextResponse.json({ message: "Producto creado", value: tienda });
}
