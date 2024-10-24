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
import { HandCoins, ShoppingCart, Star, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "../ui/badge";
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { motion } from "framer-motion";
import Image from "next/image";

const ReturnImage = () => {
  return "https://res.cloudinary.com/dbgnyc842/image/upload/v1725399957/xmlctujxukncr5eurliu.png";
};
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
export function ButtonOfCart({ prod, AnimationCart, isAnimating }) {
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
    AnimationCart();
  };

  const handleAddToCart = () => {
    dispatchStore({
      type: "AddCart",
      payload: JSON.stringify({ ...prod, Cant: prod.Cant + 1 }),
    });
    AnimationCart();
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
          className="w-full flex justify-center"
          onClick={handleAddToCart}
          disabled={isAnimating}
        >
          {!isAnimating ? <ShoppingCart className="h-4 w-4 mr-2" /> : <Spin />}
          <span className="hidden md:block"> Add to Cart</span>{" "}
          <Badge className=" text-white" variant="outline">
            {prod.Cant}
          </Badge>
        </Button>
      )}
    </>
  );
}
export function CurrencySelector({ store, dispatchStore }) {
  return (
    <>
      {store.moneda.length > 1 ? (
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <HandCoins className="h-5 w-5" />
          </NavigationMenuTrigger>
          <NavigationMenuContent className="w-[100px]">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <div className="grid max-w-max gap-4 ">
                {store.moneda.map(
                  (mon, ind) =>
                    mon.valor > 0 && (
                      <Button
                        key={ind}
                        className="w-16"
                        onClick={() => {
                          const selectedMoneda = store.moneda.find(
                            (obj) => obj.moneda === mon.moneda
                          );
                          dispatchStore({
                            type: "ChangeCurrent",
                            payload: JSON.stringify(selectedMoneda),
                          });
                        }}
                      >
                        {mon.moneda}
                      </Button>
                    )
                )}
              </div>
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      ) : (
        <></>
      )}
    </>
  );
}
export function IconCartAnimation({
  imageClone,
  prod,
  store,
  isAnimating,
  setIsAnimating,
  setImageClone,
}) {
  return (
    <motion.div
      initial={{
        x: imageClone?.initialX,
        y: imageClone?.initialY,
        width: imageClone?.width,
        height: imageClone?.height,
        opacity: 0, // Iniciar con opacidad 0
        scale: 1,
      }}
      animate={
        isAnimating
          ? {
              opacity: 1,
              width: "50px",
              height: "50px",
              x: imageClone?.finalX,
              y: imageClone?.finalY,
              zIndex: 50,
            }
          : {
              opacity: 0,
              width: "100%",
              height: "auto",
              x: imageClone?.initialX,
              y: imageClone?.initialY,
              zIndex: 0,
            }
      }
      transition={{
        opacity: { duration: 0.5 }, // Primero aumenta la opacidad
        x: {
          duration: 1,
          delay: 0.4,
        }, // Luego se mueve
        y: {
          duration: 1,
          delay: 0.4,
        },
      }}
      className="absolute z-[6] w-full"
      onAnimationComplete={() => {
        setIsAnimating(false);
        setImageClone(null); // Limpiar la imagen clonada
      }}
    >
      <Image
        src={
          prod.image ||
          store.urlPoster ||
          "https://res.cloudinary.com/dbgnyc842/image/upload/v1725399957/xmlctujxukncr5eurliu.png"
        }
        alt={prod.title || "Product"}
        className="rounded-full w-full h-full object-cover z-[1]"
        height="50"
        width="50"
        onLoad={() => ReturnImage()}
      />
    </motion.div>
  );
}
function Spin() {
  return (
    <div className="flex items-center justify-center">
      <svg
        className="animate-spin h-8 w-8 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.963 7.963 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  );
}
