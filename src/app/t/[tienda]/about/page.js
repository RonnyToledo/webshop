import React, { Suspense } from "react";
import AboutPage from "@/components/VarT/AboutPage";

export default function page({ params }) {
  return <AboutPage tienda={params.tienda} />;
}
