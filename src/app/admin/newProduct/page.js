"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectGroup,
  SelectContent,
  Select,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase";
import { Switch } from "@/components/ui/switch";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Save, GitMerge, Loader2 } from "lucide-react";

export default function usePage() {
  const [downloading, setDownloading] = useState(false);
  const { toast } = useToast();
  const form = useRef(null);
  const supabase = createClient();
  const [store, setStore] = useState({
    comentario: [],
    categoria: [],
    moneda: [],
  });
  const [products, setProducts] = useState({
    favorito: false,
    title: "",
    descripcion: "",
    discount: 0,
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

            setStore({ ...a, categoria: JSON.parse(a.categoria) });
          });
      });
    };
    Tabla();
  }, [supabase]);
  console.log(products);

  function getLocalISOString(date) {
    const offset = date.getTimezoneOffset(); // Obtiene el desfase en minutos
    const localDate = new Date(date.getTime() - offset * 60000); // Ajusta la fecha a UTC
    return localDate.toISOString().slice(0, 19); // Formato "YYYY-MM-DDTHH:mm:ss"
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const now = new Date();
    setDownloading(true);
    const formData = new FormData();
    formData.append("title", products.title);
    formData.append("price", products.price);
    formData.append("caja", products.caja);
    formData.append("favorito", products.favorito);
    formData.append("descripcion", products.descripcion);
    formData.append("discount", products.discount);
    formData.append("UID", store.UUID);
    formData.append("creado", getLocalISOString(now));
    if (products.image) formData.append("image", products.image);
    const res = await axios.post(
      `/api/tienda/${store.sitioweb}/products`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (res.status == 200) {
      toast({
        title: "Tarea Ejecutada",
        description: "Producto creado",
        action: (
          <ToastAction altText="Goto schedule to undo">Cerrar</ToastAction>
        ),
      });
    }
    form.current.reset();
    setDownloading(false);
  };
  return (
    <main className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8 ">
      <form ref={form} onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            htmlFor="images"
          >
            Imágenes
          </Label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <CloudUploadIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600 dark:text-gray-400">
                <label
                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                  htmlFor="images"
                >
                  <span>Subir archivos</span>
                  <input
                    className="sr-only"
                    id="images"
                    name="images"
                    type="file"
                    onChange={(e) =>
                      setProducts({
                        ...products,
                        image: e.target.files[0],
                      })
                    }
                  />
                </label>
                <p className="pl-1">o arrastrar y soltar</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG, GIF hasta 10MB
              </p>
              <p className="text-xs text-muted-foreground mt-1">*Opcional</p>
            </div>
          </div>
          {products?.image && (
            <Image
              alt="Logo"
              className="rounded-xl  mx-auto my-1"
              height={200}
              width={150}
              src={URL.createObjectURL(products.image)}
              style={{
                aspectRatio: "40/40",
                objectFit: "cover",
              }}
            />
          )}
        </div>
        <div>
          <Label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            htmlFor="title"
          >
            Título
          </Label>
          <div className="mt-1">
            <Input
              id="title"
              name="title"
              required
              value={products.title}
              type="text"
              onChange={(e) =>
                setProducts({
                  ...products,
                  title: e.target.value,
                })
              }
            />
          </div>
        </div>
        <div>
          <Label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            htmlFor="price"
          >
            Precio
          </Label>
          <div className="mt-1">
            <Input
              id="price"
              name="price"
              required
              value={products.price}
              type="number"
              onChange={(e) =>
                setProducts({
                  ...products,
                  price: e.target.value,
                })
              }
            />
          </div>
        </div>
        <div>
          <Label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            htmlFor="category"
          >
            Categoría
          </Label>
          <div className="mt-1">
            <Select
              id="category"
              name="category"
              required
              onValueChange={(value) =>
                setProducts({
                  ...products,
                  caja: value,
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {store.categoria.map((obj, ind) => (
                    <SelectItem key={ind} value={obj}>
                      {obj}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <Switch
              id="reservation"
              checked={products.favorito}
              onCheckedChange={(value) => {
                setProducts({
                  ...products,
                  favorito: value,
                });
              }}
            />
          </div>
          <div className="ml-3 text-sm">
            <Label
              className="font-medium text-gray-700 dark:text-gray-300"
              htmlFor="special"
            >
              Producto especial
            </Label>
          </div>
        </div>
        <div>
          <Label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            htmlFor="description"
          >
            Descripción
          </Label>
          <div className="mt-1">
            <Textarea
              id="description"
              name="description"
              value={products.descripcion}
              rows={3}
              onChange={(e) =>
                setProducts({
                  ...products,
                  descripcion: e.target.value,
                })
              }
            />
          </div>
        </div>
        <div>
          <Label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            htmlFor="discount"
          >
            Descuento
          </Label>
          <div className="mt-1 flex items-center">
            <Input
              id="discount"
              max="100"
              min="0"
              name="discount"
              required
              value={products.discount}
              step="1"
              type="number"
              onChange={(e) =>
                setProducts({
                  ...products,
                  discount: e.target.value,
                })
              }
            />
            <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
              %
            </span>
          </div>
        </div>

        <div className="bg-white p-2 flex justify-end sticky bottom-0">
          {!downloading ? (
            <Button className="bg-black hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded">
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

function CloudUploadIcon(props) {
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
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M12 12v9" />
      <path d="m16 16-4-4-4 4" />
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
