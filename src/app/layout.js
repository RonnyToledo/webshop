"use client";
import "./globals.css";
import { createContext, useReducer, useContext } from "react";
import { reducerStore } from "@/reducer/reducerGeneral";
import { createClient } from "@/lib/supabase";
import { ThemeProvider } from "@/context/createContext";
import { ThemeContext } from "@/context/createContext";
import { Toaster } from "@/components/ui/toaster";
import { Store } from "lucide-react";
import Link from "next/link";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
};

export default function RootLayout({ children }) {
  const [store, dispatchStore] = useReducer(reducerStore, store1);
  const supabase = createClient();

  return (
    <html lang="es">
      <body>
        <header className="sticky top-0 z-40 bg-background shadow">
          <div className="container px-4 py-4 md:px-6 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2" prefetch={false}>
              <Store className="h-6 w-6" />
              <span className="text-xl font-bold">R&H-Boulevard</span>
            </Link>
            {/* <div className="relative flex-1 max-w-md">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search the Microsoft Store"
              className="pl-10 pr-4 py-2 rounded-md bg-muted w-full"
            />
          </div> */}
            {/* <div className="hidden md:flex items-center gap-4">
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground"
              prefetch={false}
            >
              Sign in
            </Link>
            <Button variant="outline">
              <div className="w-5 h-5 mr-2" />
              Cart
            </Button>
          </div> */}
          </div>
        </header>
        <ThemeProvider>
          <context.Provider value={{ store, dispatchStore }}>
            {children}
            <SpeedInsights />
          </context.Provider>
        </ThemeProvider>
        <Toaster />
        <footer className="bg-muted py-6">
          <div className="container px-4 md:px-6 flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Store className="h-6 w-6" />
              <span className="text-lg font-bold">R&H-Boulevard</span>
            </div>
            {/* <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground"
              prefetch={false}
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground"
              prefetch={false}
            >
              Terms of Use
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground"
              prefetch={false}
            >
              Trademarks
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground"
              prefetch={false}
            >
              About Our Ads
            </Link>
          </div> */}
          </div>
        </footer>
      </body>
    </html>
  );
}
