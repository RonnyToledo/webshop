"use client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import axios from "axios";
import { createClient } from "@/lib/supabase";
import {
  Loader2,
  Save,
  Eye,
  Star,
  ScreenShareOff,
  GitMerge,
} from "lucide-react";

import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect, useRef } from "react";

export default function usePage({ params }) {
  const [downloading, setDownloading] = useState(false);
  const [newAregados, setNewAgregados] = useState({
    nombre: "",
    valor: 0,
    cantidad: 0,
  });

  const { toast } = useToast();
  const form = useRef(null);
  const supabase = createClient();
  const [store, setStore] = useState({
    comentario: [],
    categoria: [],
    moneda: [],
    horario: [],
  });
  const [products, setProducts] = useState({
    agregados: [],
  });
  const [newImage, setNewImage] = useState();

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

            supabase
              .from("Products")
              .select("*")
              .eq("productId", params.specific)
              .then((respuesta) => {
                const [b] = respuesta.data;
                setProducts({ ...b, agregados: JSON.parse(b.agregados) });
              });
          });
      });
    };
    Tabla();
  }, [params.specific]);
  console.log(products);
  const SaveData = async (e) => {
    e.preventDefault();
    setDownloading(true);
    const formData = new FormData();

    formData.append("title", products.title);
    formData.append("descripcion", products.descripcion);
    formData.append("price", products.price);
    formData.append("discount", products.discount);
    formData.append("caja", products.caja);
    formData.append("favorito", products.favorito);
    formData.append("agotado", products.agotado);
    formData.append("visible", products.visible);
    formData.append("agregados", JSON.stringify(products.agregados));
    formData.append("Id", products.productId);
    if (newImage) {
      formData.append("newImage", newImage);
      if (products.image) formData.append("image", products.image);
    }

    const res = await axios.put(
      `/api/tienda/${store.sitioweb}/products/${products.productId}/`,
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
        description: "Informacion Actualizada",
        action: (
          <ToastAction altText="Goto schedule to undo">Cerrar</ToastAction>
        ),
      });
    }
    setDownloading(false);
  };
  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 lg:p-10">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">Editar producto</h1>
      </div>
      <form>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Imagen del producto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <Image
                  src={
                    newImage
                      ? URL.createObjectURL(newImage)
                      : products.image
                      ? products.image
                      : "https://res.cloudinary.com/dbgnyc842/image/upload/v1721753647/kiphxzqvoa66wisrc1qf.jpg"
                  }
                  alt={products.title ? products.title : `Product`}
                  width={300}
                  height={300}
                  className="object-contain"
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Cambiar Imagen</CardTitle>
            </CardHeader>
            <CardContent>
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
                          onChange={(e) => setNewImage(e.target.files[0])}
                        />
                      </label>
                      <p className="pl-1">o arrastrar y soltar</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG, GIF hasta 10MB
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      *Opcional
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detalles del producto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    type="text"
                    value={products.title}
                    onChange={(e) =>
                      setProducts({ ...products, title: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    defaultValue={products.descripcion}
                    onChange={(e) =>
                      setProducts({ ...products, descripcion: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Precio</Label>
                  <Input
                    id="price"
                    type="number"
                    defaultValue={products.price}
                    onChange={(e) =>
                      setProducts({
                        ...products,
                        price: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Descuento</Label>
                  <Input
                    id="price"
                    type="number"
                    defaultValue={products.discount}
                    onChange={(e) =>
                      setProducts({
                        ...products,
                        discount: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Categoría</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <Label htmlFor="category">Categoría</Label>
                <Select
                  id="category"
                  onValueChange={(value) => {
                    setProducts({
                      ...products,
                      caja: value,
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={products.caja} />
                  </SelectTrigger>
                  <SelectContent>
                    {store.categoria.map((obj, ind) => (
                      <SelectItem key={ind} value={obj}>
                        {obj}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Estado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    id="out-of-stock"
                    checked={products.agotado}
                    onCheckedChange={(value) =>
                      setProducts({ ...products, agotado: value })
                    }
                  />
                  <Label htmlFor="out-of-stock ">Agotado</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="favorite"
                    checked={products.favorito}
                    onCheckedChange={(value) =>
                      setProducts({ ...products, favorito: value })
                    }
                  />
                  <Label htmlFor="favorite">Favorito</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="visible"
                    checked={products.visible}
                    onCheckedChange={(value) =>
                      setProducts({ ...products, visible: value })
                    }
                  />
                  <Label htmlFor="visible">Visible</Label>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Agregado</CardTitle>
            </CardHeader>
            <CardContent>
              {products.agregados.length >= 0 &&
                products.agregados.map((obj1, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between "
                  >
                    <div className="flex items-center gap-2">
                      <GitMerge className="h-5 w-5 text-primary" />
                      <p className="text-base font-medium">{obj1.nombre}</p>
                      <p className="text-base font-medium">${obj1.valor}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-foreground"
                      onClick={(e) => {
                        e.preventDefault();
                        setProducts({
                          ...products,
                          agregados: products.agregados.filter(
                            (fil) => fil != obj1
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
                <form
                  ref={form}
                  className="space-x-6 flex items-center justify-between"
                >
                  <div>
                    <Label
                      htmlFor="new-subcategory"
                      className="text-base font-medium"
                    >
                      Nombre
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      required
                      value={newAregados.nombre}
                      type="text"
                      onChange={(e) =>
                        setNewAgregados({
                          ...newAregados,
                          nombre: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="new-subcategory"
                      className="text-base font-medium"
                    >
                      Valor
                    </Label>
                    <Input
                      id="value"
                      name="value"
                      required
                      value={newAregados.valor}
                      type="number"
                      onChange={(e) =>
                        setNewAgregados({
                          ...newAregados,
                          valor: e.target.value,
                        })
                      }
                    />
                  </div>
                  <Button
                    variant="outline m-2"
                    className="w-16"
                    onClick={(e) => {
                      e.preventDefault();
                      setProducts({
                        ...products,
                        agregados: Array.from(
                          new Set([...products.agregados, newAregados])
                        ),
                      });
                      setNewAgregados({ nombre: "", valor: 0, cantidad: 0 });
                    }}
                  >
                    <PlusIcon className="h-5 w-5" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
          <div className="bg-white p-2 flex justify-end sticky bottom-0 gap-2">
            {!downloading ? (
              <Button
                className="bg-black hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded"
                onClick={SaveData}
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
        </div>
      </form>
    </div>
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
