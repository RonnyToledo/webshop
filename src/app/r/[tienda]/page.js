import SHome from "@/components/VarT/sHome";
import React from "react";
import { Home } from "@/components/VarR/home";

export default function page({ params }) {
  return (
    <>
      <Home tienda={params.tienda} />
    </>
  );
}
