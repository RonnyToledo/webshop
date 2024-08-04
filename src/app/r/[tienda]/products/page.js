"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import React from "react";
import { createClient } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { SkeletonProducts } from "@/components/Chadcn-components/SkeletonCard";

export default function usePage({ params }) {
  const { toast } = useToast();
  const [store, setStore] = useState({
    Monedas: [],
    moneda_default: {},
    moneda: [],
    horario: [],
    comentario: [],
    categoria: [],
    insta: "",
  });
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const supabase = createClient();
        await supabase
          .from("Sitios")
          .select()
          .eq("sitioweb", params.tienda)
          .then((res) => {
            const [a] = res.data;
            setStore({ ...a, categoria: JSON.parse(a.categoria) });
            setLoading(true);
            supabase
              .from("Products")
              .select("*")
              .eq("storeId", a.UUID)
              .then((respuesta) => {
                setProducts(respuesta.data);
              });
          });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    obtenerDatos();
  }, [params]);

  const Mantenimiento = () => {
    toast({
      title: "Informacion",
      description: "Servicio en reparacion",
      action: <ToastAction altText="Goto schedule to undo">Cerrar</ToastAction>,
    });
  };
  console.log(products);
  return (
    <>
      {loading ? (
        <div key="1" className="container mx-auto px-2 py-2">
          {store.categoria.map((cat, index) => (
            <div className="mt-12" key={index}>
              <div
                className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6"
                style={{
                  position: "sticky",
                  top: "64px",
                  backgroundColor: "white",
                  zIndex: 10,
                }}
              >
                <div className="grid gap-2">
                  <h2 className="text-2xl px-2 font-bold">{cat}</h2>
                </div>
              </div>
              <div>
                <div
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1"
                  id={cat}
                >
                  {products
                    .filter((prod) => prod.caja === cat)
                    .map((prod, ind) => (
                      <Card className="w-full" key={ind}>
                        <Link
                          className="relative"
                          href={`/t/${store.sitioweb}/products/${prod.productId}`}
                        >
                          <Image
                            alt={prod.title ? prod.title : "Titulo"}
                            className="w-full block object-cover"
                            height="300"
                            src={prod.image ? prod.image : "/placeholder.svg"}
                            style={{
                              aspectRatio: "200/200",
                              objectFit: "cover",
                            }}
                            width="200"
                          />
                          <HanPasadoSieteDias fecha={prod.creado} />
                        </Link>

                        <div className="p-4 flex flex-col">
                          <div className="flex justify-between items-center">
                            <h5 className="text-base sm:text-lg  font-bold line-clamp-2 h-14 overflow-hidden">
                              {prod.title}
                            </h5>
                          </div>
                          <p className="text-xs sm:text-lg line-clamp-2 overflow-hidden mt-1 text-gray-600 h-14 sm:h-16">
                            {prod.descripcion}
                          </p>
                          <div className="flex justify-between items-center mt-4">
                            <span className="text-xs sm:text-lg font-bold">
                              ${prod.price.toFixed(2)}
                            </span>
                            {!prod.agotado ? (
                              <Button
                                className="text-xs sm:text-lg w-16 sm:w-auto h-8 sm:h-auto"
                                onClick={Mantenimiento}
                              >
                                Comprar
                              </Button>
                            ) : (
                              <Button
                                disabled
                                className="text-xs sm:text-lg w-16 sm:w-auto h-8 sm:h-auto"
                              >
                                Agotado
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              </div>
            </div>
          ))}
          {products.filter((obj) => !store.categoria.includes(obj.caja))
            .length >= 1 && (
            <div className="mt-12">
              <div
                className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6"
                style={{
                  position: "sticky",
                  top: "64px",
                  backgroundColor: "white",
                  zIndex: 10,
                }}
              >
                <div className="grid gap-2">
                  <h2 className="text-2xl px-2 font-bold">Ofertas Variadas</h2>
                </div>
              </div>
              <div>
                <div
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1"
                  id="otros"
                >
                  {products
                    .filter((obj) => !store.categoria.includes(obj.caja))
                    .map((prod, ind) => (
                      <Card className="w-full" key={ind}>
                        <Link
                          href={`/t/${store.sitioweb}/products/${prod.productId}`}
                        >
                          <Image
                            alt={prod.title}
                            className="w-full  object-cover"
                            height="300"
                            src={prod.image ? prod.iamge : "/placeholder.svg"}
                            style={{
                              aspectRatio: "200/200",
                              objectFit: "cover",
                            }}
                            width="200"
                          />
                        </Link>

                        <div className="p-4 flex flex-col">
                          <div className="flex justify-between items-center">
                            <h5 className="text-base sm:text-lg  font-bold line-clamp-2 h-14 overflow-hidden">
                              {prod.title}
                            </h5>
                          </div>
                          <p className="text-xs sm:text-lg line-clamp-2 overflow-hidden mt-1 text-gray-600 h-14 sm:h-16">
                            {prod.descripcion}
                          </p>
                          <div className="flex justify-between items-center mt-4">
                            <span className="text-xs sm:text-lg font-bold">
                              ${prod.price.toFixed(2)}
                            </span>
                            {!prod.agotado ? (
                              <Button className="text-xs sm:text-lg w-16 sm:w-auto h-8 sm:h-auto">
                                Comprar
                              </Button>
                            ) : (
                              <Button
                                disabled
                                className="text-xs sm:text-lg w-16 sm:w-auto h-8 sm:h-auto"
                              >
                                Agotado
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <SkeletonProducts />
      )}
    </>
  );
}
function HanPasadoSieteDias({ fecha }) {
  // Convertir la fecha de entrada a un objeto Date
  const fechaEntrada = new Date(fecha);

  // Obtener la fecha actual
  const fechaActual = new Date();

  // Calcular la diferencia en milisegundos
  const diferenciaEnMilisegundos = fechaActual - fechaEntrada;

  // Convertir la diferencia a días
  const diferenciaEnDias = diferenciaEnMilisegundos / (1000 * 60 * 60 * 24);

  // Verificar si han pasado 7 días
  return (
    <div className="absolute" style={{ top: "5px", right: "5px" }}>
      {diferenciaEnDias <= 7 && (
        <h2 className="bg-gray-800 text-gray-100 rounded-lg p-1 text-xs">
          New
        </h2>
      )}
    </div>
  );
}
