"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select";
import Image from "next/image";
import axios from "axios";
import { createClient } from "@/lib/supabase";
import { Loader2, Save, Eye, Star, ScreenShareOff } from "lucide-react";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect, useRef } from "react";

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
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const Tabla = async () => {
      await supabase.auth.onAuthStateChange((event, session) => {
        supabase
          .from("Sitios")
          .select("*")
          .eq("Editor", session?.user.id || null)
          .then((res) => {
            const [a] = res.data;
            setStore(a);

            supabase
              .from("Products")
              .select("*")
              .eq("storeId", a.UUID)
              .then((respuesta) => {
                setProducts(respuesta.data);
              });
          });
      });
    };
    Tabla();
  }, [supabase]);

  const deleteProduct = async (value, image) => {
    setDownloading(true);
    const formData = new FormData();
    if (image) formData.append("image", image);
    formData.append("Id", value);
    const res = await axios.delete(
      `/api/tienda/${store.sitioweb}/products/${value}/`,
      {
        data: formData,
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
    <div key="1" className="flex flex-col min-h-screen">
      <main className="flex-1 bg-gray-100 dark:bg-gray-800 p-6">
        <div className="grid grid-cols-1 gap-1">
          <span className="flex bg-green-100 text-green-800 text-xs font-medium p-4 rounded dark:bg-green-200 dark:text-green-900">
            <Eye className=" h-4 w-4 mr-2" />
            Producto Visible para el cliente
          </span>

          <span className="flex bg-blue-100 text-blue-800 text-xs font-medium p-4 rounded dark:bg-blue-200 dark:text-blue-900">
            <Star className=" h-4 w-4 mr-2" />
            Producto en vista de favorito
          </span>

          <span className="flex bg-red-100 text-red-800 text-xs font-medium p-4 rounded dark:bg-red-200 dark:text-red-900">
            <ScreenShareOff className=" h-4 w-4 mr-2" />
            Producto en agotado
          </span>
        </div>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Productos</h2>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {products.map((obj, ind) => (
                  <div
                    key={ind}
                    className="p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <Link href={`/admin/products/${obj.productId}`}>
                        <Image
                          alt={obj.title ? obj.title : `Producto${ind}`}
                          className="rounded-md"
                          height={64}
                          src={
                            obj.image
                              ? obj.image
                              : "https://res.cloudinary.com/dbgnyc842/image/upload/v1721753647/kiphxzqvoa66wisrc1qf.jpg"
                          }
                          style={{
                            aspectRatio: "64/64",
                            objectFit: "cover",
                          }}
                          width={64}
                        />
                      </Link>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">
                          {obj.title}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                          ${obj.price}
                        </p>
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-blue-200 dark:text-blue-900">
                          {obj.caja}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="grid grid-cols-2 gap-1">
                        {obj.visible && (
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-2 rounded dark:bg-green-200 dark:text-green-900">
                            <Eye className=" h-4 w-4 " />
                          </span>
                        )}
                        {obj.favorito && (
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-2 rounded dark:bg-blue-200 dark:text-blue-900">
                            <Star className=" h-4 w-4 " />
                          </span>
                        )}
                        {obj.agotado && (
                          <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-2 rounded dark:bg-red-200 dark:text-red-900">
                            <ScreenShareOff className=" h-4 w-4 " />
                          </span>
                        )}
                      </div>
                      <Button
                        className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                        size="icon"
                        variant="outline"
                        disable={downloading}
                        onClick={() => deleteProduct(obj.productId, obj.image)}
                      >
                        {!downloading ? (
                          <DeleteIcon className="w-5 h-5" />
                        ) : (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
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

function CircleCheckIcon(props) {
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
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function CircleXIcon(props) {
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
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  );
}

function DeleteIcon(props) {
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
      <path d="M20 5H9l-7 7 7 7h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z" />
      <line x1="18" x2="12" y1="9" y2="15" />
      <line x1="12" x2="18" y1="9" y2="15" />
    </svg>
  );
}
