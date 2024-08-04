"use client";
import React from "react";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectGroup,
  SelectContent,
  Select,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { createClient } from "@/lib/supabase";
import { Save, GitMerge, Loader2 } from "lucide-react";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect, useRef } from "react";
import { provincias } from "@/components/json/Site.json";

export default function usePage() {
  const [downloading, setDownloading] = useState(false);
  const { toast } = useToast();
  const form = useRef(null);
  const supabase = createClient();
  const [store, setStore] = useState({
    comentario: [],
    categoria: [],
    moneda: [],
    moneda_default: {},
    horario: [],
    envios: [],
  });

  useEffect(() => {
    const Tabla = async () => {
      await supabase.auth.onAuthStateChange((event, session) => {
        supabase
          .from("Sitios")
          .select("*")
          .eq("Editor", session?.user.id || null)
          .then((res) => {
            const [a] = res.data;
            setStore({
              ...a,
              moneda: JSON.parse(a.moneda),
              moneda_default: JSON.parse(a.moneda_default),
              envios: JSON.parse(a.envios),
            });
          });
      });
    };
    Tabla();
  }, [supabase]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDownloading(true);
    const formData = new FormData();
    formData.append("tarjeta", store.tarjeta);
    formData.append("act_tf", store.act_tf);
    formData.append("cell", store.cell);
    formData.append("email", store.email);
    formData.append("insta", store.insta);
    formData.append("Provincia", store.Provincia);
    formData.append("local", store.local);
    formData.append("domicilio", store.domicilio);
    formData.append("reservas", store.reservas);
    formData.append("moneda_default", JSON.stringify(store.moneda_default));
    formData.append("moneda", JSON.stringify(store.moneda));
    formData.append("envios", JSON.stringify(store.envios));

    const res = await axios.put(`/api/tienda/${store.sitioweb}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (res.status == 200) {
      toast({
        title: "Tarea Ejecutada",
        description: "Informacion Actualizada",
        action: (
          <ToastAction altText="Goto schedule to undo">Cerrar</ToastAction>
        ),
      });
    }
    form.current.reset();
    setDownloading(false);
  };
  return (
    <main className="container mx-auto my-8 px-4 sm:px-6 lg:px-8">
      <form ref={form}>
        <div className="mb-5">
          {store.envios.map((obj, ind) => (
            <div
              key={ind}
              className="w-full bg-background rounded-lg shadow-lg p-6 space-y-6 p-3 border rounded-2x"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{obj.nombre}</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={(e) => {
                    e.preventDefault();

                    setStore({
                      ...store,
                      envios: store.envios.filter(
                        (fil) => fil.nombre != obj.nombre
                      ),
                    });
                  }}
                >
                  <TrashIcon className="h-5 w-5" />
                  <span className="sr-only">Eliminar </span>
                </Button>
              </div>
              <div className="space-y-4 border rounded-2x p-3">
                {obj.municipios.map((obj1, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between "
                  >
                    <div className="flex items-center gap-2">
                      <GitMerge className="h-5 w-5 text-primary" />
                      <p className="text-base font-medium">{obj1}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-foreground"
                      onClick={(e) => {
                        e.preventDefault();
                        const a = store.envios[ind].municipios.filter(
                          (fil) => fil != obj1
                        );

                        setStore({
                          ...store,
                          envios: store.envios.map((env) =>
                            env.nombre === obj.nombre
                              ? { ...env, municipios: a }
                              : env
                          ),
                        });
                      }}
                    >
                      <TrashIcon className="h-5 w-5" />
                      <span className="sr-only">Eliminar</span>
                    </Button>
                  </div>
                ))}
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="new-subcategory"
                    className="text-base font-medium"
                  >
                    Agregar municipio
                  </Label>
                  <Select
                    onValueChange={(value) => {
                      const a = [...obj.municipios, value];
                      setStore({
                        ...store,
                        envios: store.envios.map((env) =>
                          env.nombre === obj.nombre
                            ? { ...env, municipios: a }
                            : env
                        ),
                      });
                    }}
                  >
                    <SelectTrigger
                      size="icon"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <span className="sr-only">Agregar municipio</span>
                    </SelectTrigger>
                    <SelectContent>
                      {provincias
                        .filter((env) => env.nombre == obj.nombre)[0]
                        .municipios.filter(
                          (elemento) => !obj.municipios.includes(elemento)
                        )
                        .map((mun, index2) => (
                          <SelectItem value={mun} key={index2}>
                            {mun}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline m-2" className="w-16">
                    <PlusIcon className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {store.domicilio && (
            <div className="flex items-center justify-between mt-2">
              <Select
                onValueChange={(value) => {
                  const [a] = provincias.filter((aaa) => value == aaa.nombre);
                  setStore({
                    ...store,
                    envios: [...store.envios, a],
                  });
                }}
              >
                <SelectTrigger
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <PlusIcon className="h-5 w-5" />
                  <span className="sr-only">Agregar Provincia</span>
                  <SelectValue placeholder="Agregar una provincia" />
                </SelectTrigger>
                <SelectContent>
                  {provincias
                    .filter(
                      (bbb) =>
                        !store.envios
                          .map((ccc) => ccc.nombre)
                          .includes(bbb.nombre)
                    )
                    .map((ddd, index3) => (
                      <SelectItem key={index3} value={ddd.nombre}>
                        {ddd.nombre}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button variant="outline" className="w-48 ml-5">
                Agregar Provincia
              </Button>
            </div>
          )}
        </div>

        <div className="bg-white p-2 flex justify-end sticky bottom-0">
          {!downloading ? (
            <Button
              onClick={handleSubmit}
              className="bg-black hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded"
            >
              <Save className="mr-2 h-4 w-4 " />
              Guardar
            </Button>
          ) : (
            <Button
              disabled
              className="bg-black hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded"
            >
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando
            </Button>
          )}
        </div>
      </form>
    </main>
  );
}

function ArrowLeftIcon(props) {
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
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
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

function TrashIcon(props) {
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
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

function XIcon(props) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
