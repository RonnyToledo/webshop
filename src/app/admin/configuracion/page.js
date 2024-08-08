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
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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
    formData.append("municipio", store.municipio);
    formData.append("local", store.local);
    formData.append("domicilio", store.domicilio);
    formData.append("reservas", store.reservas);
    formData.append("moneda_default", JSON.stringify(store.moneda_default));
    formData.append("moneda", JSON.stringify(store.moneda));
    formData.append("envios", JSON.stringify(store.envios));
    try {
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
    } catch (error) {
      console.error("Error al enviar el comentario:", error);
      toast({
        title: "Error",
        description: "No se pudo enviar el comentario.",
      });
    } finally {
      form.current.reset();
      setDownloading(false);
    }
  };
  return (
    <main className="container mx-auto my-8 px-4 sm:px-6 lg:px-8">
      <form ref={form} className="grid gap-6" onSubmit={handleSubmit}>
        <div className="border rounded-2x p-5">
          <div className="space-y-2 mb-2">
            <Label htmlFor="transfers" className="mr-2">
              Transfers
            </Label>
            <Switch
              id="transfers"
              checked={store.act_tf}
              onCheckedChange={(value) =>
                setStore({
                  ...store,
                  act_tf: value,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bank-card">Tarjeta Bancaria</Label>
            <Input
              id="bank-card"
              value={store.tarjeta}
              type="text"
              onChange={(e) =>
                setStore({
                  ...store,
                  tarjeta: e.target.value,
                })
              }
            />
          </div>

          <p className="text-xs text-muted-foreground mt-1">
            *Comercio Electronico y pagos por transferenica Bancaria
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            placeholder="Enter your phone number"
            type="number"
            value={store.cell}
            onChange={(e) =>
              setStore({
                ...store,
                cell: e.target.value,
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="Enter your email"
            type="email"
            value={store.email}
            onChange={(e) =>
              setStore({
                ...store,
                email: e.target.value,
              })
            }
          />
        </div>
        <div className="border rounded-2x p-5">
          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              placeholder="Enter your Instagram handle"
              type="text"
              value={store.insta}
              onChange={(e) =>
                setStore({
                  ...store,
                  insta: e.target.value,
                })
              }
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            *URL de su cuenta Ej: https://www.instagram.com/r-and-h.menu
          </p>
        </div>
        <div className="border rounded-2x p-5">
          <div className="space-y-2">
            <Label htmlFor="region">Provincia</Label>

            <Select
              id="category"
              name="category"
              onValueChange={(value) =>
                setStore({
                  ...store,
                  Provincia: value,
                  municipio: provincias.filter((env) => env.nombre == value)[0]
                    ?.municipios[0],
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={store.Provincia} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {provincias.map((obj, ind) => (
                    <SelectItem key={ind} value={obj.nombre}>
                      {obj.nombre}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Label htmlFor="region">Municipio</Label>

            <Select
              id="category"
              name="category"
              onValueChange={(value) =>
                setStore({
                  ...store,
                  municipio: value,
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={store.municipio} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {provincias
                    .filter((env) => env.nombre == store.Provincia)[0]
                    ?.municipios.map((mun, index2) => (
                      <SelectItem value={mun} key={index2}>
                        {mun}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            *Seleccione su ubicacion
          </p>
        </div>
        <div className="border rounded-2x p-5">
          <div className="space-y-2">
            <Label htmlFor="available" className="mr-2">
              Local de Trabajo
            </Label>
            <Switch
              id="available"
              checked={store.local}
              onCheckedChange={(value) =>
                setStore({
                  ...store,
                  local: value,
                })
              }
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            *Indique si dispone de un local para recibir personal
          </p>
        </div>
        <div className="border rounded-2x p-5">
          <div className="  flex justify-between">
            <div className="space-y-2 mb-2">
              <Label htmlFor="delivery" className="mr-2">
                Domicilio
              </Label>
              <Switch
                id="delivery"
                checked={store.domicilio}
                onCheckedChange={(value) => {
                  setStore({
                    ...store,
                    domicilio: value,
                    envios: value
                      ? provincias.filter(
                          (obj) => obj.nombre == store.Provincia
                        )
                      : [{ nombre: "", municipios: [] }],
                  });
                }}
              />
            </div>
            {store.domicilio ? (
              <Link
                className="border p-3 text-center"
                href={`/admin/configuracion/domicilios`}
              >
                Definir Domicilios
              </Link>
            ) : (
              <></>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            *Guarde los cambios antes de ajustar los domicilio
          </p>
        </div>
        <div className="border rounded-2x p-5">
          <div className="space-y-2">
            <Label htmlFor="reservation" className="mr-2">
              Reservation
            </Label>
            <Switch
              id="reservation"
              checked={store.reservas}
              onCheckedChange={(value) =>
                setStore({
                  ...store,
                  reservas: value,
                })
              }
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            *Indique si los clientes le pueden enviar reservacion
          </p>
        </div>
        <div className="border rounded-2x p-5">
          <div>
            <Label
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              htmlFor="category"
            >
              Moneda de trabajo
            </Label>
            <div className="mt-1">
              <Select
                id="category"
                name="category"
                onValueChange={(value) => {
                  const [h] = store.moneda.filter((obj) => obj.moneda == value);
                  setStore({
                    ...store,
                    moneda_default: h,
                  });
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={store.moneda_default.moneda} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {store.moneda.map((obj, ind) => (
                      <SelectItem key={ind} value={obj.moneda}>
                        {obj.moneda}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            *Seleccione la moneda de venta de sus productos
          </p>
        </div>
        <div className="border rounded-lg p-5">
          <Label htmlFor="current" className="text-lg">
            Precio de cambio
          </Label>
          {store.moneda.map(
            (obj, ind) =>
              ind >= 1 && (
                <div key={ind} className="space-y-2">
                  <Label htmlFor="currency-1" className="mr-2">
                    {obj.moneda}
                  </Label>
                  <Input
                    id="currency-1"
                    type="number"
                    value={obj.valor}
                    onChange={(e) => {
                      const h = store.moneda;
                      h[ind] = {
                        valor: Number(e.target.value),
                        moneda: obj.moneda,
                      };
                      setStore({ ...store, moneda: h });
                    }}
                  />
                </div>
              )
          )}
          <p className="text-xs text-muted-foreground mt-1">
            *Elija el cambio al q recibe las diferentes monedas, para
            desactivarlas, darle valor de 0
          </p>
        </div>
        <div className="bg-white p-2 flex justify-end sticky bottom-0">
          <Button
            className={`bg-black hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded ${
              downloading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={downloading}
          >
            {downloading ? "Guardando..." : "Guardar"}
          </Button>
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
