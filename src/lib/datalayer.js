import { createClient } from "@/lib/supabase";

export async function initializeAnalytics(dato) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("Events")
    .insert({
      uid: dato.UUID_Shop,
      events: dato.events,
      created_at: dato.date,
      desc: dato.desc,
      UID_Venta: dato.uid,
      nombre: dato.nombre,
    })
    .select();
  if (error) console.error(error);
}
