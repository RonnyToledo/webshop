import { createClient } from "@/lib/supabase";

export async function initializeAnalytics(data) {
  const supabase = createClient();

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag(data);
  const { data, error } = await supabase.from("Events").insert(data).select();
}
