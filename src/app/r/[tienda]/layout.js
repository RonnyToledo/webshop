"use client";
import Link from "next/link";
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Chadcn-components/Header";
import { createContext, useReducer, useContext } from "react";
import MyProvider from "@/context/MyContext"; // Asegúrate de que la ruta sea correcta

export default function RootLayout({ children, params }) {
  const now = new Date();

  return (
    <html lang="en">
      <body className="min-h-screen">
        <>
          <MyProvider>
            <Header tienda={params.tienda} />
            {children}
            <Toaster />
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
        </>
      </body>
    </html>
  );
}
