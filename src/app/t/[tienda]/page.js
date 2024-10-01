import SHome from "@/components/VarT/sHome";
import React from "react";

export default async function Page({ params }) {
  return (
    <>
      <SHome tienda={params.tienda} />
    </>
  );
}
