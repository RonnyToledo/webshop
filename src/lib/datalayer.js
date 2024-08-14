import { createClient } from "@/lib/supabase";

export async function initializeAnalytics(dato) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("Events")
    .insert({
      created_at: dato.date,
      tienda: dato.tienda,
      events: dato.events,
      desc: dato.desc,
      uid: dato.uid,
    })
    .select();
}
