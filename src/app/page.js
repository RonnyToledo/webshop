import React from "react";
import Inicio from "@/components/Chadcn-components/Inicio";
import { logoApp } from "@/lib/image";

export const metadata = {
  title: "R&H-Menu",
  description: "Boulevard de compras",
  openGraph: {
    title: "R&H-Menu",
    description: "Boulevard de compras",
    images: [logoApp],
  },
};

export default function page() {
  return <Inicio />;
}
