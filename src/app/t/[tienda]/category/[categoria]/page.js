import React from "react";
import CategoryShowcase from "@/components/VarR/Category";

export default async function Page({ params }) {
  const categoria = (await params).categoria;

  // Determinar el componente según los parámetros
  return <CategoryShowcase categoria={categoria} />;
}
