import SHome from "@/components/Chadcn-components/sHome";
import React from "react";

export default async function Page({ params }) {
  return (
    <>
      <SHome tienda={params.tienda} />
    </>
  );
}
