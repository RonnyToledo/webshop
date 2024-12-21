import React from "react";
import Inicio from "@/components/Chadcn-components/Inicio";

export const metadata = {
  title: "R&H-Menu",
  description: "Boulevard de compras",
  openGraph: {
    title: "R&H-Menu",
    description: "Boulevard de compras",
    images: [
      "https://res.cloudinary.com/dbgnyc842/image/upload/v1725399957/xmlctujxukncr5eurliu.png",
    ],
  },
};

export default function page() {
  return <Inicio />;
}
