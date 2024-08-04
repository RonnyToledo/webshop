import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export async function GET(request, { params }) {
  const supabase = createClient();
  const { data: tienda } = await supabase.from("Sitios").select();

  return NextResponse.json(tienda);
}
