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
import React, { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import QrCode from "@/components/Chadcn-components/QRcode";

export default function usePage() {
  const supabase = createClient();
  const { toast } = useToast();
  const [shop, setShop] = useState({
    comentario: [],
    categoria: [],
    moneda: [],
  });

  useEffect(() => {
    const Tabla = async () => {
      await supabase.auth.onAuthStateChange((event, session) => {
        supabase
          .from("Sitios")
          .select("*")
          .eq("Editor", session?.user.id || null)
          .then((res) => {
            setShop(...new Set(res.data));
          });
      });
    };
    Tabla();
  }, [supabase]);

  const copyToClipboard = (text) => {
    console.log(text);
    if (navigator?.clipboard) {
      try {
        navigator.clipboard.writeText(text);
        toast({
          title: "Alerta",
          description: "Texto copiado al portpapeles",
          action: (
            <ToastAction altText="Goto schedule to undo">Cerrar</ToastAction>
          ),
        });
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Alerta",
          description: "Error al copiar texto: " + err,
          action: (
            <ToastAction altText="Goto schedule to undo">Cerrar</ToastAction>
          ),
        });
      }
    } else {
      console.log("Error al abrir el clipboard");
    }
  };
  console.log(shop);
  return (
    <div className="grid min-h-screen w-full overflow-hidden ">
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col gap-8 p-6">
          {shop.variable && (
            <>
              <h1 className="text-2xl font-bold">Sitio web</h1>
              <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                <div className="flex items-center space-x-2 justify-center">
                  <Input
                    className="max-w-xs text-sm font-medium"
                    readOnly
                    type="text"
                    value={`https://rh-menu.vercel.app/${shop.variable}/${shop.sitioweb}`}
                  />
                  <Button
                    onClick={() =>
                      copyToClipboard(
                        `https://rh-menu.vercel.app/${shop.variable}/${shop.sitioweb}`
                      )
                    }
                    size="icon"
                    variant="ghost"
                  >
                    <CopyIcon className="h-4 w-4" />
                    <span className="sr-only">Copy URL</span>
                  </Button>
                </div>
                <div className="flex items-center space-x-2 justify-center">
                  <QrCode
                    value={shop.variable}
                    value2={shop.sitioWeb}
                    name={shop.name}
                  />
                </div>
              </div>
            </>
          )}
          <div className="grid gap-6">
            <div className="grid gap-2">
              <h1 className="text-2xl font-bold">Funcionalidades clave</h1>
              <p className="text-gray-500 dark:text-gray-400">
                Descubre cómo funcionan las principales funcionalidades de tu
                panel de administración.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Agregar/Eliminar categorías</CardTitle>
                  <CardDescription>
                    Organiza tus productos en categorías.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <h3 className="text-lg font-semibold">Pasos a seguir</h3>
                      <ul className="list-disc space-y-2 pl-6 text-gray-500 dark:text-gray-400">
                        <li>Crea nuevas categorías</li>
                        <li>Elimina las que no uses</li>
                        <li>Cada categoria dice los productos asignados</li>
                        <li>
                          Organiza el orden de las categorías tocando la
                          categoria, se dezplasa al final de la lista
                        </li>
                        <li>Guarda los cambios hechos antes de salir</li>
                      </ul>
                    </div>
                    <Link href="/admin/category">
                      <Button>Editar categorías</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Crear producto</CardTitle>
                  <CardDescription>
                    Aprende a crear nuevos productos en tu tienda.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <h3 className="text-lg font-semibold">Pasos a seguir</h3>
                      <ul className="list-disc space-y-2 pl-6 text-gray-500 dark:text-gray-400">
                        <li>Selecciona una imagen</li>
                        <li>Ingresa todos los campos q se te piden</li>
                        <li>Selecciona una categoria</li>
                        <li>Indique si es especial de la casa</li>
                        <li>
                          Seleccione si el producto tiene rebaja porcentual
                        </li>
                      </ul>
                    </div>
                    <Link href="/admin/newProduct">
                      <Button>Crear producto</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Editar producto</CardTitle>
                  <CardDescription>
                    Actualiza la información de tus productos existentes.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <h3 className="text-lg font-semibold">Pasos a seguir</h3>
                      <ul className="list-disc space-y-2 pl-6 text-gray-500 dark:text-gray-400">
                        <li>Selecciona el producto a editar</li>
                        <li>
                          El icono de ojo refiere a q el producto sea visible
                          para los clientes
                        </li>
                        <li>
                          El icono de estrella refiere a q el producto es
                          especial de la casa
                        </li>
                        <li>
                          El icono de pantalla refiere a q el producto se
                          encuentra agotado
                        </li>
                        <li>Las imagenes no se editan</li>
                        <li>Actualiza la categoria del producto</li>
                      </ul>
                    </div>
                    <Link href="/admin/products">
                      <Button>Editar producto</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Editar perfil</CardTitle>
                  <CardDescription>
                    Personaliza tu perfil de administrador.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <h3 className="text-lg font-semibold">Pasos a seguir</h3>
                      <ul className="list-disc space-y-2 pl-6 text-gray-500 dark:text-gray-400">
                        <li>Actualiza tu información de negocio</li>
                        <li>Cambia el poster de Bienvenida</li>
                        <li>Selecciona los horarios de trabajo</li>
                      </ul>
                    </div>
                    <Link href="/admin/header">
                      <Button>Editar perfil</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Configurar perfil</CardTitle>
                  <CardDescription>
                    Personaliza tu perfil de administrador.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <h3 className="text-lg font-semibold">Pasos a seguir</h3>
                      <ul className="list-disc space-y-2 pl-6 text-gray-500 dark:text-gray-400">
                        <li>Actualiza tu numero de telefono</li>
                        <li>Rectifica tu email</li>
                        <li>Añade tu instagram de negocio</li>
                        <li>Indica la provincia sede de tu negocio</li>
                        <li>
                          Activa si tienes local de trabajo, si haces domicilio
                          y si aceptas turnos reservados
                        </li>
                        <li>
                          Indetifica que tipo de moneda es la q aceptas y los
                          cambios q tienes
                        </li>
                      </ul>
                    </div>
                    <Link href="/admin/configuracion">
                      <Button>Configurar perfil</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
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
function CopyIcon(props) {
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
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}
