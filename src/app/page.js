import React from "react";
import dynamic from "next/dynamic";

const LazyComponent = dynamic(
  () => import("@/components/Chadcn-components/Inicio"),
  {
    ssr: false, // Cambiar a 'true' si no necesitas específicamente renderizar en el cliente
  }
);

export const metadata = {
  title: "R&H-Boulevard",
  description: "Boulevard de compras",
  openGraph: {
    title: "R&H-Boulevard",
    description: "Boulevard de compras",
    images: [
      "https://res.cloudinary.com/dbgnyc842/image/upload/v1725399957/xmlctujxukncr5eurliu.png",
    ],
  },
};

export default function page() {
  return <LazyComponent />;
}
