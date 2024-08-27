import Link from "next/link";
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Chadcn-components/Header";
import MyProvider from "@/context/MyContext"; // Asegúrate de que la ruta sea correcta

async function FetchData(tienda) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/tienda/${tienda}`
  ); // Usa la URL absoluta
  if (!res.ok) {
    throw new Error("Error al obtener los datos");
  }
  const initialData = await res.json();
  return initialData;
}

export default async function RootLayout({ children, params }) {
  const now = new Date();
  const store = await FetchData(params.tienda);
  return (
    <html lang="en">
      <body className="min-h-screen">
        <>
          <MyProvider>
            <Header tienda={params.tienda} store1={store} />
            {children}
            <Toaster /> {/* Asegúrate de incluir el Toaster si es necesario */}
          </MyProvider>

          <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-gray-100 dark:bg-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              © {now.getFullYear()} R&H. All rights reserved.
            </p>
            <nav className="sm:ml-auto flex gap-4 sm:gap-6">
              <Link
                className="text-xs hover:underline underline-offset-4 dark:text-gray-400 dark:hover:text-gray-50"
                href="#"
              >
                Terms of Service
              </Link>
              <Link
                className="text-xs hover:underline underline-offset-4 dark:text-gray-400 dark:hover:text-gray-50"
                href="#"
              >
                Privacy
              </Link>
            </nav>
          </footer>
          <Toaster />
        </>
      </body>
    </html>
  );
}
