import React, { Suspense } from "react";
import { ProductSearchComponent } from "@/components/VarR/product-search";
import LoadingLazy from "@/components/globalFunctions/loadingLazy";

export default function Page({ params }) {
  // Determinar el componente según los parámetros
  const Component = ProductSearchComponent;
  return <LoadingLazy Component={Component} tienda={params.tienda} />;
}
