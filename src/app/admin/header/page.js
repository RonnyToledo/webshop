"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { Save } from "lucide-react";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function usePage() {
  const [downloading, setDownloading] = useState(false);
  const { toast } = useToast();
  const form = useRef(null);
  const supabase = createClient();
  const [store, setStore] = useState({
    comentario: [],
    categoria: [],
    moneda: [],
    horario: [],
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
            setStore({ ...a, horario: JSON.parse(a.horario) });
          });
      });
    };
    Tabla();
  }, [supabase]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDownloading(true);
    const formData = new FormData();
    formData.append("name", store.name);
    formData.append("parrrafo", store.parrrafo);
    formData.append("parrafoInfo", store.parrafoInfo);
    const jsonString = JSON.stringify(store.horario);
    formData.append("horario", jsonString);
    if (store.image) {
      formData.append("urlPosterNew", store.image);
      if (store.urlPoster) {
        formData.append("urlPoster", store.urlPoster);
      }
    }
    try {
      const res = await axios.post(`/api/tienda/${store.sitioweb}/`, formData, {
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
        variant: "destructive",
        description: "No se pudo actulizar la informacion.",
      });
    } finally {
      form.current.reset();
      setDownloading(false);
    }
  };
  return (
    <main className="container mx-auto py-12 px-6">
      <form ref={form} className="space-y-8" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <Label htmlFor="cover-photo">Cover Photo</Label>
            <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
              <div className="space-y-1 text-center">
                <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                    htmlFor="cover-photo"
                  >
                    <span>Subir una imagen</span>
                    <Input
                      className="sr-only"
                      id="cover-photo"
                      name="cover-photo"
                      type="file"
                      onChange={(e) =>
                        setStore({
                          ...store,
                          image: e.target.files[0],
                        })
                      }
                    />
                  </label>
                  <p className="pl-1">o arrastrar hasta aqui</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF hasta 10MB
                </p>
              </div>
            </div>
          </div>
          {store.image && (
            <Image
              alt="Logo"
              className="rounded-xl  mx-auto my-1"
              height={200}
              width={150}
              src={URL.createObjectURL(store.image)}
              style={{
                aspectRatio: "40/40",
                objectFit: "cover",
              }}
            />
          )}
          <div>
            <div className="space-y-2 mt-4">
              <Label htmlFor="business-name">Nombre del negocio</Label>
              <Input
                id="business-name"
                name="business-name"
                value={store.name}
                type="text"
                onChange={(e) =>
                  setStore({
                    ...store,
                    name: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="welcome-message">Mensaje de Bienvenida</Label>
          <Textarea
            id="welcome-message"
            name="welcome-message"
            value={store.parrrafo}
            rows={5}
            onChange={(e) =>
              setStore({
                ...store,
                parrrafo: e.target.value,
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="info-message">Mensaje de Infromacion</Label>
          <Textarea
            id="info-message"
            name="info-message"
            value={store.parrafoInfo}
            rows={5}
            onChange={(e) =>
              setStore({
                ...store,
                parrafoInfo: e.target.value,
              })
            }
          />
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="business-hours text-lg">Horarios de Trabajo</Label>
            <div className="mt-2 grid grid-cols-1 gap-4  md:grid-cols-2">
              {store.horario.map((obj, ind) => (
                <div key={ind} className="border p-3">
                  <Label
                    className="block font-medium text-gray-700"
                    htmlFor={obj.dia}
                  >
                    {obj.dia}
                  </Label>
                  <div className="mt-1 flex flex-row rounded-md shadow-sm p-2 md:p-5">
                    <RadioGroup
                      className="flex flex-col md:flex-row md:ml-auto md:mr-auto"
                      defaultValue={
                        obj.cierre == 0 && obj.apertura == 0
                          ? "option-two"
                          : obj.cierre == 24 && obj.apertura == 0
                          ? "option-one"
                          : "option-three"
                      }
                    >
                      <div className="flex items-center space-x-2  p-3">
                        <RadioGroupItem
                          value="option-one"
                          id="option-one"
                          onClick={(e) => {
                            const h = store.horario;
                            h[ind] = {
                              dia: obj.dia,
                              cierre: 24,
                              apertura: 0,
                            };
                            setStore({
                              ...store,
                              horario: h,
                            });
                          }}
                        />
                        <Label htmlFor="option-one">24 Horas</Label>
                      </div>
                      <div className="flex items-center space-x-2  p-3">
                        <RadioGroupItem
                          value="option-two"
                          id="option-two"
                          onClick={(e) => {
                            const h = store.horario;
                            h[ind] = {
                              dia: obj.dia,
                              cierre: 0,
                              apertura: 0,
                            };
                            setStore({
                              ...store,
                              horario: h,
                            });
                          }}
                        />
                        <Label htmlFor="option-two">Cerrado</Label>
                      </div>
                      <div className="flex items-center space-x-2  p-3">
                        <RadioGroupItem
                          value="option-three"
                          id="option-three"
                          onClick={(e) => {
                            const h = store.horario;
                            h[ind] = {
                              dia: obj.dia,
                              cierre: 23,
                              apertura: 1,
                            };
                            setStore({
                              ...store,
                              horario: h,
                            });
                          }}
                        />

                        <Label htmlFor="option-three">Custom</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  {obj.apertura != 0 && (
                    <div className="grid grid-cols-2 gap-4 p-5">
                      <div className="space-y-2">
                        <Label htmlFor="opening-time">Opening Time</Label>
                        <Input
                          disabled={obj.cierre == 24 && obj.apertura}
                          id="opening-time"
                          value={
                            obj.apertura >= 10
                              ? `${obj.apertura}:00`
                              : `0${obj.apertura}:00`
                          }
                          name="opening-time"
                          type="time"
                          onChange={(e) => {
                            const h = store.horario;
                            const [horas] = e.target.value.split(":");
                            const horasNumericas = parseInt(horas, 10);
                            h[ind] = {
                              dia: obj.dia,
                              cierre: obj.cierre,
                              apertura: horasNumericas,
                            };
                            setStore({
                              ...store,
                              horario: h,
                            });
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="closing-time">Closing Time</Label>
                        <Input
                          id="closing-time"
                          name="closing-time"
                          value={
                            obj.cierre >= 10
                              ? `${obj.cierre}:00`
                              : `0${obj.cierre}:00`
                          }
                          type="time"
                          onChange={(e) => {
                            const h = store.horario;
                            const [horas] = e.target.value.split(":");
                            const horasNumericas = parseInt(horas, 10);
                            h[ind] = {
                              dia: obj.dia,
                              cierre: horasNumericas,
                              apertura: obj.apertura,
                            };
                            setStore({
                              ...store,
                              horario: h,
                            });
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
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

function UploadIcon(props) {
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
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}
