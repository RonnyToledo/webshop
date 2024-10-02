"use client";
import React from "react";
import { useState, useEffect, useContext } from "react";
import { MyContext } from "@/context/MyContext";
import { Promedio } from "./function";
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
import { Heart, ShoppingCart, Star, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "../ui/badge";

export function StarCount({ array, campo }) {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i + 1}
          className={`w-4 h-4 ${
            i < Promedio(array, campo)
              ? "text-yellow-400 fill-current"
              : "text-gray-700"
          }`}
        />
      ))}
    </>
  );
}
export function ButtonOfCart({ prod }) {
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
      {store.domicilio && prod?.agregados?.length > 0 ? (
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
