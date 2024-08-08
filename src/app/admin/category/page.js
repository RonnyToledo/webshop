"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { Save } from "lucide-react";
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
  const [formulario, setFormulario] = useState(false);
  const [newCat, setNewCat] = useState("");

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
              .eq("storeId", a.UUID)
              .then((respuesta) => {
                setProducts(respuesta.data);
              });
          });
      });
    };
    Tabla();
  }, [supabase]);

  const catSubmit = (e) => {
    e.preventDefault();
    setStore({ ...store, categoria: [...store.categoria, newCat] });
    form.current.reset();
  };
  function startDrag(evt, obj) {
    evt.dataTransfer.setData("itemId", obj);
    const array = store.categoria.filter((objeto) => objeto !== obj);
    array.push(obj);
    setStore({ ...store, categoria: array });
  }
  function startDrag1(evt, obj) {
    const array = store.categoria.filter((objeto) => objeto !== obj);
    array.push(obj);
    setStore({ ...store, categoria: array });
  }
  function startDrag1(evt, obj) {
    const array = store.categoria.filter((objeto) => objeto !== obj);
    array.push(obj);
    setStore({ ...store, categoria: array });
  }
  const Eliminar = (obj) => {
    const array = store.categoria.filter((objeto) => objeto !== obj);
    setStore({ ...store, categoria: array });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setDownloading(true);
    const formData = new FormData();
    const jsonString = JSON.stringify(store.categoria);
    formData.append("categoria", jsonString);
    try {
      const res = await axios.post(
        `/api/tienda/${store.sitioweb}/categoria`,
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
    } catch (error) {
      console.error("Error al enviar el comentario:", error);
      toast({
        title: "Error",
        description: "No se pudo enviar el comentario.",
      });
    } finally {
      setDownloading(false);
    }
  };
  return (
    <main className="py-8 px-6">
      <div className="mb-6">
        <Button
          size="sm"
          onClick={() => {
            formulario
              ? setFormulario(false) && form.current.reset()
              : setFormulario(true);
          }}
        >
          {formulario ? "Cerrar" : "Agregar Categoría"}
        </Button>
      </div>
      {formulario && (
        <div className="mt-8 mb-5 ">
          <h2 className="text-lg font-bold mb-4">Agregar Categoría</h2>
          <form
            className="bg-white border rounded-lg p-6 space-y-4"
            onSubmit={catSubmit}
            ref={form}
          >
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                placeholder="Ingresa el nombre de la categoría"
                type="text"
                onChange={(e) => setNewCat(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button>Guardar</Button>
            </div>
          </form>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {store.categoria.map((obj, ind) => (
            <div
              key={ind}
              className="bg-white border rounded-lg p-4 flex items-center justify-between"
            >
              <div
                className="flex items-center gap-4"
                draggable
                droppable="true"
                onTouchStart={(evt) => startDrag1(evt, obj)}
                onDragStart={(evt) => startDrag(evt, obj)}
              >
                <FolderIcon className="h-6  w-6 text-gray-500" />
                <div>
                  <h3 className="font-medium">{obj}</h3>
                  <p className="text-gray-500 text-sm">
                    {products.filter((prod) => prod.caja == obj).length +
                      " Productos"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => Eliminar(obj)}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
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

function FolderIcon(props) {
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
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    </svg>
  );
}

function PencilIcon(props) {
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
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
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
