import React, { Suspense } from "react";
import { AboutStoreComponent } from "@/components/VarR/about-store";
import LoadingLazy from "@/components/globalFunctions/loadingLazy";

export default function page({ params }) {
  // Determinar el componente según los parámetros
  const Component = AboutStoreComponent;
  return <LoadingLazy Component={Component} tienda={params.tienda} />;
}
