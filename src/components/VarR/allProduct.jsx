"use client";
import React from "react";
import { Heart, ShoppingCart, Star, Plus, Minus } from "lucide-react";
import { useState, useEffect, useContext } from "react";
import { MyContext } from "@/context/MyContext";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";

export default function AllProduct() {
  const { store, dispatchStore } = useContext(MyContext);

  return (
    <>
      {ExtraerCategorias(store, store.products).map((categoria, ind) => (
        <div
          key={ind}
          className="flex flex-col w-full mt-4 p-2 md:p-4 bg-white rounded-lg shadow-md"
        >
          <div className="flex justify-start mt-4">
            <h2 className="text-lg font-semibold">{categoria}</h2>
          </div>
          <div className="grid grid-cols-2 gap-1">
            {store.products
              .filter((obj) => obj.caja == categoria)
              .sort((a, b) => a.order - b.order)
              .map((prod, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-2 md:p-4 rounded-2xl relative"
                >
                  <Link
                    className="relative"
                    href={`/${store.variable}/${store.sitioweb}/products/${prod.productId}`}
                  >
                    <Image
                      src={
                        prod.image ||
                        store.urlPoster ||
                        "https://res.cloudinary.com/dbgnyc842/image/upload/v1725399957/xmlctujxukncr5eurliu.png"
                      }
                      alt={prod.title || `Producto ${index}`}
                      className="w-full h-48 md:h-64 object-cover rounded-xl mb-2"
                      width={300}
                      height={300}
                    />
                    {prod.agotado && (
                      <Badge
                        variant="destructive"
                        className="absolute top-2 right-2"
                      >
                        Agotado
                      </Badge>
                    )}
                    <HanPasadoSieteDias fecha={prod.creado} />
                  </Link>
                  <p className="text-sm font-semibold">{prod.title}</p>
                  <p className="text-sm font-bold mb-1">
                    ${Number(prod.price).toFixed(2)}{" "}
                    {store.moneda_default.moneda}
                  </p>
                  <div className="flex items-center mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-3 w-3 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <ButtonOfCart prod={prod} />
                </div>
              ))}
          </div>
        </div>
      ))}
      {store.products.some((prod) => !store.categoria.includes(prod.caja)) && (
        <div className="flex flex-col w-full mt-4 p-4 bg-white rounded-lg shadow-md">
          <div className="flex justify-start mt-4">
            <h2 className="text-lg font-semibold">Otros Productos</h2>
          </div>
          <div className="grid grid-cols-2 gap-1">
            {store.products
              .filter((prod) => !store.categoria.includes(prod.caja))
              .map((prod, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-4 rounded-2xl relative"
                >
                  <Link
                    className="relative"
                    href={`/${store.variable}/${store.sitioweb}/products/${prod.productId}`}
                  >
                    <Image
                      src={
                        prod.image ||
                        store.urlPoster ||
                        "https://res.cloudinary.com/dbgnyc842/image/upload/v1725399957/xmlctujxukncr5eurliu.png"
                      }
                      alt={prod.title || `Producto ${index}`}
                      className="w-full h-48 md:h-64 object-cover rounded-xl mb-2"
                      width={300}
                      height={300}
                    />
                    {prod.agotado && (
                      <Badge
                        variant="destructive"
                        className="absolute top-2 right-2"
                      >
                        Agotado
                      </Badge>
                    )}
                    <HanPasadoSieteDias fecha={prod.creado} />
                  </Link>
                  <p className="text-sm font-semibold">{prod.title}</p>
                  <p className="text-sm font-bold mb-1">
                    ${Number(prod.price).toFixed(2)}{" "}
                    {store.moneda_default.moneda}
                  </p>
                  <div className="flex items-center mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-3 w-3 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <ButtonOfCart prod={prod} />
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
}
function ExtraerCategorias(store, products) {
  const categoriasProductos = new Set(products.map((prod) => prod.caja));
  return store.categoria.filter((cat) => categoriasProductos.has(cat));
}
function HanPasadoSieteDias({ fecha }) {
  const fechaEntrada = new Date(fecha);
  const fechaActual = new Date();
  const diferenciaEnDias = (fechaActual - fechaEntrada) / (1000 * 60 * 60 * 24);

  return (
    <>
      {diferenciaEnDias <= 7 && (
        <Badge className="absolute top-2 left-2 text-xs mb-1">New</Badge>
      )}
    </>
  );
}
function ButtonOfCart({ prod }) {
  const { store, dispatchStore } = useContext(MyContext);
  const handleAgregadoUpdate = (nombre, incremento) => {
    const updatedAgregados = prod.agregados.map((obj) =>
      obj.nombre === nombre
        ? { ...obj, cantidad: obj.cantidad + incremento }
        : obj
    );
    dispatchStore({
      type: "AddCart",
      payload: JSON.stringify({ ...prod, agregados: updatedAgregados }),
    });
  };

  const handleAddToCart = () => {
    dispatchStore({
      type: "AddCart",
      payload: JSON.stringify({ ...prod, Cant: prod.Cant + 1 }),
    });
  };
  return (
    <>
      {store.domicilio && prod.agregados.length > 0 ? (
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" variant="destructive" className="w-full">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Agregados
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[300px] sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Agregados</DialogTitle>
              <DialogDescription>
                Selecciona los agregados para {prod.title} (precio: {prod.price}
                ).
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {prod.agregados.map((obj, ind2) => (
                <div
                  key={ind2}
                  className="flex justify-between items-center gap-4"
                >
                  <Label className="text-sm font-medium">
                    {`${obj.nombre} - ${(
                      obj.valor / store.moneda_default.valor
                    ).toFixed(2)} ${store.moneda_default.moneda}`}
                  </Label>
                  <div className="flex justify-between items-center gap-1">
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={obj.cantidad === 0}
                      className="p-1 h-5 w-5 hover:text-foreground"
                      onClick={() => handleAgregadoUpdate(obj.nombre, -1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Badge variant="outline">{obj.cantidad}</Badge>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="p-1 h-5 w-5 hover:text-foreground"
                      onClick={() => handleAgregadoUpdate(obj.nombre, 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button size="sm" variant="destructive" onClick={handleAddToCart}>
                Sin Agregados{" "}
                <Badge className="ml-3  text-white" variant="outline">
                  {prod.Cant}
                </Badge>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <Button
          size="sm"
          variant="destructive"
          className="w-full"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart{" "}
          <Badge className="ml-3 text-white" variant="outline">
            {prod.Cant}
          </Badge>
        </Button>
      )}
    </>
  );
}
