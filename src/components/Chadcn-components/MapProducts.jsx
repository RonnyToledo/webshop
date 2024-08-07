import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Minus } from "lucide-react";
import Link from "next/link";

export default function MapProducts({ prod, store, dispatchStore }) {
  return (
    <div className=" p-2">
      <div className="relative bg-cover bg-center group rounded-2xl  overflow-hidden">
        <Link
          className="relative"
          href={`/${store.variable}/${store.sitioweb}/products/${prod.productId}`}
        >
          <Image
            src={
              prod.image
                ? prod.image
                : "https://res.cloudinary.com/dbgnyc842/image/upload/v1721753647/kiphxzqvoa66wisrc1qf.jpg"
            }
            alt={prod.title ? prod.title : "Product"}
            className="w-full group-hover:scale-105 transition-transform block object-cover"
            height="300"
            style={{
              aspectRatio: "200/200",
              objectFit: "cover",
            }}
            width="200"
          />
          <HanPasadoSieteDias fecha={prod.creado} />
          <div className=" absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-2 md:p-8">
            <h4 className="text-xs md:text-lg text-white font-bold line-clamp-2 overflow-hidden ">
              {prod.title}
            </h4>
          </div>
        </Link>
      </div>
      <p className="text-gray-700 font-semibold text-end ">
        {(prod.price / store.moneda_default.valor).toFixed(2)}{" "}
        {store.moneda_default.moneda}
      </p>

      {store.domicilio && !prod.agotado ? (
        prod.agregados.length > 0 ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full">Agregados</Button>
            </DialogTrigger>
            <DialogContent className="max-w-[300px] sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Agregados</DialogTitle>
                <DialogDescription>
                  Indique los agregados de su Producto, a este se le agregrega
                  al precio original de {`${prod.title}-(${prod.price})`}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {prod.agregados.map((obj, ind2) => (
                  <div
                    key={ind2}
                    className="flex justify-between items-center gap-4"
                  >
                    <Label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {`${obj.nombre} - ${(
                        obj.valor / store.moneda_default.valor
                      ).toFixed(2)}`}{" "}
                      {store.moneda_default.moneda}
                    </Label>
                    <div className="flex justify-between items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={obj.cantidad == 0}
                        className="p-1  h-5 w-5 hover:text-foreground"
                        onClick={(e) => {
                          const c = prod.agregados.map((obj1) =>
                            obj.nombre == obj1.nombre
                              ? {
                                  ...obj1,
                                  cantidad: obj.cantidad - 1,
                                }
                              : obj1
                          );

                          dispatchStore({
                            type: "AddCart",
                            payload: JSON.stringify({
                              ...prod,
                              agregados: c,
                            }),
                          });
                        }}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Badge variant="outline">{obj.cantidad}</Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className=" p-1 h-5 w-5 hover:text-foreground"
                        onClick={(e) => {
                          const c = prod.agregados.map((obj1) =>
                            obj.nombre == obj1.nombre
                              ? {
                                  ...obj1,
                                  cantidad: obj.cantidad + 1,
                                }
                              : obj1
                          );
                          dispatchStore({
                            type: "AddCart",
                            payload: JSON.stringify({
                              ...prod,
                              agregados: c,
                            }),
                          });
                        }}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button
                  onClick={(e) => {
                    dispatchStore({
                      type: "AddCart",
                      payload: JSON.stringify({
                        ...prod,
                        Cant: prod.Cant + 1,
                      }),
                    });
                  }}
                >
                  Sin Agregados
                  <Badge className="ml-3">{prod.Cant}</Badge>
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : (
          <Button
            className="w-full"
            onClick={() => {
              dispatchStore({
                type: "AddCart",
                payload: JSON.stringify({
                  ...prod,
                  Cant: prod.Cant + 1,
                }),
              });
            }}
          >
            Add to Cart <Badge className="ml-3">{prod.Cant}</Badge>
          </Button>
        )
      ) : (
        <Button disabled className="w-full">
          Agotado
        </Button>
      )}
    </div>
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
