"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Image from "next/image";

export default function Plan() {
  const Solicitud = (plan) => {
    let mensaje = `Hola, Quiero solicitar un catalogo para mi negocio\n`;
    mensaje += `Voy a solicitar el plan ${plan}\n`;
    const mensajeCodificado = encodeURIComponent(mensaje);
    const urlWhatsApp = `https://wa.me/5352489105?text=${mensajeCodificado}`;

    window.open(urlWhatsApp, "_blank");
  };
  return (
    <div className="bg-background text-foreground">
      <main>
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Planes de hosting para tu tienda online
                </h1>
                <p className="mt-4 text-muted-foreground">
                  Elige el plan perfecto para hacer crecer tu negocio.
                </p>
                <div className="mt-6">
                  <Link href="#planes">
                    <Button className="px-8 py-3">Comprar ahora</Button>
                  </Link>
                </div>
              </div>
              <div>
                <Image
                  src="https://res.cloudinary.com/dbgnyc842/image/upload/v1725399957/xmlctujxukncr5eurliu.png"
                  width={600}
                  height={400}
                  alt="Hosting plans"
                  className="rounded-lg"
                  style={{ aspectRatio: "600/400", objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
        </section>
        <section className="bg-muted py-12 md:py-20" id="planes">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-center">
              Planes de hosting
            </h2>
            <p className="mt-4 text-muted-foreground text-center">
              Encuentra el plan perfecto para tu tienda online.
            </p>
            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-background shadow-lg">
                <CardHeader className="bg-muted/20 px-6 py-4">
                  <h3 className="text-xl font-bold">Básico</h3>
                  <p className="text-muted-foreground">
                    Ideal para emprendedores y pequeñas tiendas.
                  </p>
                </CardHeader>
                <CardContent className="px-6 py-8">
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <span>Productos</span>
                      <span className="font-medium">75</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Carrito</span>
                      <span className="font-medium">Incluido</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Reservaciones</span>
                      <span className="font-medium">Incluido</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Prueba gratuita</span>
                      <span className="font-medium">14 días</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/20 px-6 py-4">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-2xl font-bold">$749/mes</span>
                    <Button
                      onClick={() => Solicitud("basico")}
                      className="px-6 py-2"
                    >
                      Comprar
                    </Button>
                  </div>
                </CardFooter>
              </Card>
              <Card className="bg-background shadow-lg">
                <CardHeader className="bg-muted/20 px-6 py-4">
                  <h3 className="text-xl font-bold">Anual</h3>
                  <p className="text-muted-foreground">
                    Perfecto para negocios en crecimiento que buscan expandir su
                    alcance.
                  </p>
                </CardHeader>
                <CardContent className="px-6 py-8">
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <span>Productos</span>
                      <span className="font-medium">150</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Carrito</span>
                      <span className="font-medium">Incluido</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Reservaciones</span>
                      <span className="font-medium">Incluido</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Prueba gratuita</span>
                      <span className="font-medium">1 mes</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Descuentos por referidos</span>
                      <span className="font-medium">10%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Análisis básico de rendimiento</span>
                      <span className="font-medium">Incluido</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/20 px-6 py-4">
                  <div className="flex items-center justify-between  w-full">
                    <span className="text-2xl font-bold">$599/mes</span>
                    <Button
                      onClick={() => Solicitud("estandar")}
                      className="px-6 py-2"
                    >
                      Comprar
                    </Button>
                  </div>
                </CardFooter>
              </Card>
              <Card className="bg-background shadow-lg">
                <CardHeader className="bg-muted/20 px-6 py-4 ">
                  <h3 className="text-xl font-bold">Personalizado</h3>
                  <p className="text-muted-foreground">
                    Totalmente adaptable a las necesidades específicas de tu
                    negocio{" "}
                  </p>
                </CardHeader>
                <CardContent className="px-6 py-8">
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <span>Productos</span>
                      <span className="font-medium">200</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Carrito</span>
                      <span className="font-medium">Incluido</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Reservaciones</span>
                      <span className="font-medium">Incluido</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Prueba gratuita</span>
                      <span className="font-medium">1 mes</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Descuentos por modulos</span>
                      <span className="font-medium">5%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Modulos</span>
                      <span className="font-medium">Personalizables</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/20 px-6 py-4">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-2xl font-bold">$999/mes</span>
                    <Button
                      onClick={() => Solicitud("personalizado")}
                      className="px-6 py-2"
                    >
                      Comprar
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function LogInIcon(props) {
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
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" x2="3" y1="12" y2="12" />
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
