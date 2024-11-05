import React from "react";
import { ShoppingCartComponent } from "@/components/VarR/shopping-cart";
import LoadingLazy from "@/components/globalFunctions/loadingLazy";

export default function page({ params }) {
  // Determinar el componente según los parámetros
  const Component = ShoppingCartComponent;
  return <LoadingLazy Component={Component} tienda={params.tienda} />;
}
