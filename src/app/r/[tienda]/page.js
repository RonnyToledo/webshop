import React from "react";
import dynamic from "next/dynamic";
import { Home } from "@/components/VarR/home";
import LoadingLazy from "@/components/globalFunctions/loadingLazy";

export default function Page({ params }) {
  // Determinar el componente según los parámetros
  const Component = Home;
  return <LoadingLazy Component={Component} tienda={params.tienda} />;
}
