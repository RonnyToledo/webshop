import SHome from "@/components/Chadcn-components/sHome";
import React from "react";
import { createClient } from "@/lib/supabase";

export default async function Page({ params }) {
  return (
    <>
      <SHome tienda={params.tienda} />
    </>
  );
}
