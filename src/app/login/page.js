"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

export default function usePage() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (data.session) {
      router.push("/admin");
    }
    if (error) {
      toast({
        variant: "destructive",
        title: "Alerta",
        description: "Error: " + error.message,
        action: (
          <ToastAction altText="Goto schedule to undo">Cerrar</ToastAction>
        ),
      });
    }
  };
  return (
    <div
      className="flex "
      style={{ justifyContent: "center", alignItems: "center" }}
    >
      <div className="pt-20 pr-10 pb-20 pl-10" style={{ maxWidth: "600px" }}>
        <div className="mx-auto max-w-sm space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Iniciar sesión</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Ingresa tu correo electrónico para acceder a tu cuenta
            </p>
          </div>
          <div className="space-y-4">
            <form onSubmit={handleSubmit}>
              <div className="space-y-2 mt-5">
                <Label htmlFor="email" className="mt-5">
                  Correo electrónico
                </Label>
                <Input
                  id="email"
                  placeholder="ejemplo@dominio.com"
                  required
                  type="email"
                  onChange={(e) => setemail(e.target.value)}
                />
              </div>
              <div className="space-y-2 mt-5">
                <Label htmlFor="password" className="mt-5">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  required
                  type="password"
                  onChange={(e) => setpassword(e.target.value)}
                />
              </div>
              <Button className="w-full mt-5" type="submit">
                Iniciar sesión
              </Button>
            </form>
            <Button className="w-full" variant="outline">
              <ChromeIcon className="mr-2 h-4 w-4" />
              Iniciar sesión con Google
            </Button>
            <div className="flex justify-end">
              <Link className="text-sm underline" href="#">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChromeIcon(props) {
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
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="21.17" x2="12" y1="8" y2="8" />
      <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
      <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
    </svg>
  );
}
