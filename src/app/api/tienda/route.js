import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export async function GET() {
  const supabase = createClient();
  const { data: tienda } = await supabase.from("Sitios").select("*");
  const a = tienda.map((obj) => {
    return {
      ...obj,
      categoria: JSON.parse(obj.categoria),
      moneda: JSON.parse(obj.moneda),
      moneda_default: JSON.parse(obj.moneda_default),
      horario: JSON.parse(obj.horario),
      comentario: JSON.parse(obj.comentario),
      envios: JSON.parse(obj.envios),
    };
  });
  const response = NextResponse.json(a);

  // Establecer cabeceras para deshabilitar el caché
  response.headers.set("Cache-Control", "no-store");

  return response;
}
