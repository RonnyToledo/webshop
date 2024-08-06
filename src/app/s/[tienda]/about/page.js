import React, { Suspense } from "react";
import AboutPage from "@/components/Chadcn-components/AboutPage";
import { context } from "@/app/s/[tienda]/layout";

export default function page({ params }) {
  return <AboutPage tienda={params.tienda} context={context} />;
}
