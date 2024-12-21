import React from "react";
import { Home } from "@/components/VarR/home";
import LoadingLazy from "@/components/globalFunctions/loadingLazy";

export default async function Page({ params }) {
  const tienda = (await params).tienda;

  // Determinar el componente según los parámetros
  const Component = Home;
  return <LoadingLazy Component={Component} tienda={tienda} />;
}
