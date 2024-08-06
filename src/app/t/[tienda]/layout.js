"use client";
import Link from "next/link";
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Chadcn-components/Header";
import { createContext, useReducer, useContext } from "react";
import { reducerStore } from "@/reducer/reducerGeneral";
import Loading from "@/components/component/loading";

export const context = createContext();
const products = [];
const store1 = {
  moneda_default: {},
  moneda: [],
  horario: [],
  comentario: [],
  categoria: [],
  envios: [],
  insta: "",
  products: products,
  loading: 0,
};

export default function RootLayout({ children, params }) {
  const [store, dispatchStore] = useReducer(reducerStore, store1);
  const now = new Date();

  return (
    <html lang="en">
      <body className="min-h-screen">
        <context.Provider value={{ store, dispatchStore }}>
          <Header tienda={params.tienda} context={context} />
          {children}
        </context.Provider>

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
      </body>
    </html>
  );
}
