import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export async function POST(request, { params }) {
  const supabase = createClient();
  const data = await request.formData();
  console.log(data.get("categoria"));
  const { data: tienda, error } = await supabase
    .from("Sitios")
    .update([
      {
        categoria: data.get("categoria"),
      },
    ])
    .select()
    .eq("sitioweb", params.tienda);
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
