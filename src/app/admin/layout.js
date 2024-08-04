"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SheetTrigger, SheetContent, Sheet } from "@/components/ui/sheet";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const LogOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert(error);
    }
  };
  supabase.auth.onAuthStateChange((event, session) => {
    if (!session) {
      console.log(event);
      router.push("/login");
    }
  });

  return (
    <html lang="en">
      <body>
        <>
          <header
            className="flex items-center justify-between px-4 py-3 bg-gray-100 z-[10]"
            style={{ position: "sticky", top: 0 }}
          >
            <Link
              className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-50"
              href="#"
            >
              <Package2Icon className="h-6 w-6" />
              <span>
                {pathname == "/admin/newProduct"
                  ? "Agregar Producto"
                  : pathname == "/admin/products"
                  ? "Editar Productos"
                  : pathname == "/admin/header"
                  ? "Editar Informacion"
                  : pathname == "/admin/configuracion"
                  ? "Configuracion"
                  : pathname == "/admin/category"
                  ? "Editar Categorias"
                  : "Admin"}
              </span>
            </Link>
            <nav className="hidden lg:flex items-center gap-4">
              <Link
                className={
                  pathname === "/admin"
                    ? "flex  items-center gap-3 rounded-lg px-3 py-2 text-gray-900 text-gray-500 transition-all hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-50  bg-gray-100"
                    : "flex   items-center gap-3 rounded-lg  text-gray-500 px-3 py-2 transition-all hover:text-gray-700  dark:text-gray-50 dark:hover:text-gray-50"
                }
                href="/admin/"
                onClick={() => setIsOpen(false)}
              >
                <HomeIcon className="h-4 w-4" />
                Admin
              </Link>
              <Link
                className={
                  pathname === "/admin/category"
                    ? "flex  items-center gap-3 rounded-lg px-3 py-2 text-gray-900 text-gray-500 transition-all hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-50  bg-gray-100"
                    : "flex   items-center gap-3 rounded-lg  text-gray-500 px-3 py-2 transition-all hover:text-gray-700  dark:text-gray-50 dark:hover:text-gray-50"
                }
                href="/admin/category"
                onClick={() => setIsOpen(false)}
              >
                <CatIcon className="h-4 w-4" />
                Categoria
              </Link>
              <Link
                className={
                  pathname === "/admin/newProduct"
                    ? "flex  items-center gap-3 rounded-lg px-3 py-2 text-gray-900 text-gray-500 transition-all hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-50  bg-gray-100"
                    : "flex   items-center gap-3 rounded-lg  text-gray-500 px-3 py-2 transition-all hover:text-gray-700  dark:text-gray-50 dark:hover:text-gray-50"
                }
                href="/admin/newProduct"
                onClick={() => setIsOpen(false)}
              >
                <PlusIcon className="h-4 w-4" />
                Nuevo Producto
              </Link>
              <Link
                className={
                  pathname === "/admin/products"
                    ? "flex  items-center gap-3 rounded-lg px-3 py-2 text-gray-900 text-gray-500 transition-all hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-50  bg-gray-100"
                    : "flex   items-center gap-3 rounded-lg  text-gray-500 px-3 py-2 transition-all hover:text-gray-700  dark:text-gray-50 dark:hover:text-gray-50"
                }
                href="/admin/products"
                onClick={() => setIsOpen(false)}
              >
                <PackageIcon className="h-4 w-4" />
                Editar Productos
              </Link>
              <Link
                className={
                  pathname === "/admin/header"
                    ? "flex  items-center gap-3 rounded-lg px-3 py-2 text-gray-900 text-gray-500 transition-all hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-50  bg-gray-100"
                    : "flex   items-center gap-3 rounded-lg  text-gray-500 px-3 py-2 transition-all hover:text-gray-700  dark:text-gray-50 dark:hover:text-gray-50"
                }
                href="/admin/header"
                onClick={() => setIsOpen(false)}
              >
                <HeadingIcon className="h-4 w-4" />
                Editar Info
              </Link>
              <Link
                className={
                  pathname === "/admin/configuracion"
                    ? "flex  items-center gap-3 rounded-lg px-3 py-2 text-gray-900 text-gray-500 transition-all hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-50  bg-gray-100"
                    : "flex   items-center gap-3 rounded-lg  text-gray-500 px-3 py-2 transition-all hover:text-gray-700  dark:text-gray-50 dark:hover:text-gray-50"
                }
                href="/admin/configuracion"
                onClick={() => setIsOpen(false)}
              >
                <SettingsIcon className="h-4 w-4" />
                Configuracion
              </Link>

              <Button
                className="text-sm font-medium hover:underline underline-offset-4 dark:text-gray-400 dark:hover:text-gray-50"
                onClick={LogOut}
              >
                Cerrar cesion
              </Button>
            </nav>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  className="lg:hidden"
                  size="icon"
                  variant="outline"
                  onClick={() => setIsOpen(true)}
                >
                  <MenuIcon className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="grid items-start px-4 text-sm font-medium">
                  <Link
                    className="flex items-center gap-2 font-semibold"
                    href="#"
                  >
                    <Package2Icon className="h-6 w-6" />
                    <span className="">Panel de Admin</span>
                  </Link>
                  <Link
                    className={
                      pathname === "/admin"
                        ? "flex mt-5 items-center gap-3 rounded-lg px-3 py-2 text-gray-900 text-gray-500 transition-all hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-50  bg-gray-100"
                        : "flex  mt-5 items-center gap-3 rounded-lg  text-gray-500 px-3 py-2 transition-all hover:text-gray-700  dark:text-gray-50 dark:hover:text-gray-50"
                    }
                    href="/admin/"
                    onClick={() => setIsOpen(false)}
                  >
                    <HomeIcon className="h-4 w-4" />
                    Admin
                  </Link>
                  <Link
                    className={
                      pathname === "/admin/category"
                        ? "flex mt-5 items-center gap-3 rounded-lg px-3 py-2 text-gray-900 text-gray-500 transition-all hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-50  bg-gray-100"
                        : "flex  mt-5 items-center gap-3 rounded-lg  text-gray-500 px-3 py-2 transition-all hover:text-gray-700  dark:text-gray-50 dark:hover:text-gray-50"
                    }
                    href="/admin/category"
                    onClick={() => setIsOpen(false)}
                  >
                    <CatIcon className="h-4 w-4" />
                    Editar Categoria
                  </Link>
                  <Link
                    className={
                      pathname === "/admin/newProduct"
                        ? "flex mt-5 items-center gap-3 rounded-lg px-3 py-2 text-gray-900 text-gray-500 transition-all hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-50  bg-gray-100"
                        : "flex  mt-5 items-center gap-3 rounded-lg  text-gray-500 px-3 py-2 transition-all hover:text-gray-700  dark:text-gray-50 dark:hover:text-gray-50"
                    }
                    href="/admin/newProduct"
                    onClick={() => setIsOpen(false)}
                  >
                    <PlusIcon className="h-4 w-4" />
                    Nuevo Producto
                  </Link>
                  <Link
                    className={
                      pathname === "/admin/products"
                        ? "flex mt-5 items-center gap-3 rounded-lg px-3 py-2 text-gray-900 text-gray-500 transition-all hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-50  bg-gray-100"
                        : "flex  mt-5 items-center gap-3 rounded-lg  text-gray-500 px-3 py-2 transition-all hover:text-gray-700  dark:text-gray-50 dark:hover:text-gray-50"
                    }
                    href="/admin/products"
                    onClick={() => setIsOpen(false)}
                  >
                    <PackageIcon className="h-4 w-4" />
                    Editar Productos
                  </Link>
                  <Link
                    className={
                      pathname === "/admin/header"
                        ? "flex mt-5 items-center gap-3 rounded-lg px-3 py-2 text-gray-900 text-gray-500 transition-all hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-50  bg-gray-100"
                        : "flex  mt-5 items-center gap-3 rounded-lg  text-gray-500 px-3 py-2 transition-all hover:text-gray-700  dark:text-gray-50 dark:hover:text-gray-50"
                    }
                    href="/admin/header"
                    onClick={() => setIsOpen(false)}
                  >
                    <HeadingIcon className="h-4 w-4" />
                    Editar Info
                  </Link>
                  <Link
                    className={
                      pathname === "/admin/configuracion"
                        ? "flex mt-5 items-center gap-3 rounded-lg px-3 py-2 text-gray-900 text-gray-500 transition-all hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-50  bg-gray-100"
                        : "flex  mt-5 items-center gap-3 rounded-lg  text-gray-500 px-3 py-2 transition-all hover:text-gray-700  dark:text-gray-50 dark:hover:text-gray-50"
                    }
                    href="/admin/configuracion"
                    onClick={() => setIsOpen(false)}
                  >
                    <SettingsIcon className="h-4 w-4" />
                    Configuracion
                  </Link>

                  <Button
                    className="text-sm font-medium hover:underline mt-5 underline-offset-4 dark:text-gray-400 dark:hover:text-gray-50"
                    onClick={LogOut}
                  >
                    Cerrar cesion
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </header>
        </>

        {children}
        <Toaster />
      </body>
    </html>
  );
}

function CatIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z" />
      <path d="M8 14v.5" />
      <path d="M16 14v.5" />
      <path d="M11.25 16.25h1.5L12 17l-.75-.75Z" />
    </svg>
  );
}

function HeadingIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 12h12" />
      <path d="M6 20V4" />
      <path d="M18 20V4" />
    </svg>
  );
}

function HomeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function MenuIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function Package2Icon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
      <path d="M12 3v6" />
    </svg>
  );
}

function PackageIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}

function PlusIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function SettingsIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
