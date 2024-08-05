"use client";
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import Link from "next/link";
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
import { context } from "@/app/layout";

export default function AllProducts() {
  const [category, setcategory] = useState([]);
  const { store, dispatchStore } = useContext(context);

  useEffect(() => {
    setcategory(ExtraerCategoria(store, store.products));
  }, [store]);
  console.log(category);
  return (
    <>
      {category.map((cat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-1 mb-4">
          <h3 className="text-xl font-bold mb-4 p-4">{cat}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
            {store.products
              .filter((prod) => prod.caja === cat)
              .map((prod, ind) => (
                <div key={ind} className=" p-2">
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
                      className="w-full block object-cover"
                      height="300"
                      style={{
                        aspectRatio: "200/200",
                        objectFit: "cover",
                      }}
                      width="200"
                    />
                    <HanPasadoSieteDias fecha={prod.creado} />
                  </Link>
                  <h4 className="text-lg font-bold h-16 line-clamp-2 overflow-hidden ">
                    {prod.title}
                  </h4>
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
                              Indique los agregados de su Producto, a este se le
                              agregrega al precio original de{" "}
                              {`${prod.title}-(${prod.price})`}
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
                                  <Badge variant="outline">
                                    {obj.cantidad}
                                  </Badge>
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
              ))}
          </div>
        </div>
      ))}
      {store.products.filter((obj) => !store.categoria.includes(obj.caja))
        .length >= 1 && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <h3 className="text-xl font-bold mb-4">Otras Ofertas</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
            {products
              .filter((obj) => !store.categoria.includes(obj.caja))
              .map((prod, ind) => (
                <div key={ind} className="bg-gray-100 rounded-lg p-2">
                  <Link
                    className="relative"
                    href={`/${store.variable}/${store.sitioweb}/products/${prod.productId}`}
                  >
                    <Image
                      alt={prod.title ? prod.title : "Producto"}
                      src={
                        prod.image
                          ? prod.image
                          : "https://res.cloudinary.com/dbgnyc842/image/upload/v1721753647/kiphxzqvoa66wisrc1qf.jpg"
                      }
                      className="w-full block object-cover"
                      height="300"
                      style={{
                        aspectRatio: "200/200",
                        objectFit: "cover",
                      }}
                      width="200"
                    />
                    <HanPasadoSieteDias fecha={prod.creado} />
                  </Link>
                  <h4 className="text-lg font-bold">{prod.title}</h4>
                  <p className="text-gray-700">
                    {(prod.price / store.moneda_default.valor).toFixed(2)}{" "}
                    {store.moneda_default.moneda}
                  </p>
                  {!prod.agotado ? (
                    prod.agregados.length > 0 ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="w-full">Agregados</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[300px] sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Agregados</DialogTitle>
                            <DialogDescription>
                              Indique los agregados de su Producto
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
                                  <Badge variant="outline">
                                    {obj.cantidad}
                                  </Badge>
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
              ))}
          </div>
        </div>
      )}
    </>
  );
}
function ExtraerCategoria(data, products) {
  const categoriaProducts = [...new Set(products.map((prod) => prod.caja))];

  const newCat = data.categoria.filter((prod) =>
    categoriaProducts.includes(prod)
  );
  return newCat;
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
