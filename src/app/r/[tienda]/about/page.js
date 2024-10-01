import React, { Suspense } from "react";
import { AboutStoreComponent } from "@/components/VarR/about-store";

export default function page({ params }) {
  return <AboutStoreComponent tienda={params.tienda} />;
}
