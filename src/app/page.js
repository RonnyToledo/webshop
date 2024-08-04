import Inicio from "@/components/Chadcn-components/Inicio";
import React from "react";

export const metadata = {
  title: "R&H-Boulevard",
  description: "Boulevard de compras",
  openGraph: {
    title: "R&H-Boulevard",
    description: "Boulevard de compras",
    images: [
      "https://res.cloudinary.com/dbgnyc842/image/upload/v1721753647/kiphxzqvoa66wisrc1qf.jpg",
    ],
  },
};

export default function page() {
  return <Inicio />;
}
