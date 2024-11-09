import { NextResponse } from "next/server";
import { supabase } from "@/lib/supa";

export async function GET() {
  const { data: tienda } = await supabase.from("Sitios").select("*");
  const a = tienda.map((obj) => {
    return {
      ...obj,
      categoria: JSON.parse(obj.categoria),
      moneda: JSON.parse(obj.moneda),
      moneda_default: JSON.parse(obj.moneda_default),
      horario: JSON.parse(obj.horario),
      envios: JSON.parse(obj.envios),
    };
  });
  const response = NextResponse.json(a);

  // Establecer cabeceras para deshabilitar el caché
  response.headers.set("Cache-Control", "no-store");

  return response;
}
