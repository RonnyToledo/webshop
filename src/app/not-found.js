"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-md text-center mt-10 flex flex-col items-center">
        <Image
          src="https://res.cloudinary.com/dbgnyc842/image/upload/v1725047629/Coffe_react/hkusxv4rr56vja2skrwk.png"
          alt="Ilustración representando un error 404"
          width={200}
          height={200}
          className="rounded-md"
        />

        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          404: ¡Error de navegación!
        </h1>
        <p className="mt-4 mb-10 text-muted-foreground">
          Pero no te preocupes, aquí hay un mapa para volver a nuestras mejores
          ofertas...
        </p>
        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
        >
          Explorar ahora
        </Link>
      </div>
    </div>
  );
}
