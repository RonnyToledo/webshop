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
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import RemoveShoppingCartOutlinedIcon from "@mui/icons-material/RemoveShoppingCartOutlined";
import { motion, AnimatePresence } from "framer-motion";

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
export function ButtonOfCart({ prod, condition = true }) {
  const { store, dispatchStore } = useContext(MyContext);

  const handleAgregadoUpdate = (nombre, incremento) => {
    const updatedAgregados = prod.agregados.map((obj) =>
      obj.nombre === nombre
        ? { ...obj, cantidad: obj.cantidad + incremento }
        : obj
    );
    console.log(updatedAgregados, nombre, incremento);

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
  function MinusCart() {
    dispatchStore({
      type: "AddCart",
      payload: JSON.stringify({ ...prod, Cant: prod.Cant - 1 }),
    });
  }
  console.log(prod);
  return (
    <>
      {store.domicilio && prod?.agregados?.length > 0 ? (
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="w-full  rounded-full" type="button">
              <ShoppingCartCheckoutIcon className="h-4 w-4 mr-2" />
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
                      type="button"
                      variant="outline"
                      disabled={obj.cantidad === 0}
                      className="p-2 h-5 w-5 hover:text-foreground border border-black"
                      onClick={() => handleAgregadoUpdate(obj.nombre, -1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Badge variant="outline">{obj.cantidad}</Badge>
                    <Button
                      size="sm"
                      type="button"
                      variant="outline"
                      className="p-2 h-5 w-5 hover:text-foreground border border-black"
                      onClick={() => handleAgregadoUpdate(obj.nombre, 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button
                size="sm"
                onClick={handleAddToCart}
                type="button"
                className=" rounded-full  w-full"
              >
                Sin Agregados{" "}
                <Badge className="ml-3  text-white" variant="outline">
                  {prod.Cant}
                </Badge>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <div className="flex justify-end">
          {condition ? (
            <motion.div
              className="flex items-center bg-primary rounded-full overflow-hidden"
              initial={{ width: prod.Cant === 0 ? "2.5rem" : "100%" }}
              animate={{ width: prod.Cant > 0 ? "100%" : "2.5rem" }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <AnimatePresence>
                {prod.Cant > 0 && (
                  <>
                    <motion.div
                      className="flex justify-evenly w-full"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button
                        size="sm"
                        type="button"
                        className="w-full flex justify-center items-center rounded-full"
                        onClick={prod.Cant > 0 && MinusCart}
                        disabled={prod.Cant === 0}
                      >
                        <RemoveShoppingCartOutlinedIcon className="h-4 w-4" />
                      </Button>
                    </motion.div>
                    <motion.div
                      className="p-2"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Badge className="text-white" variant="outline">
                        {prod.Cant}
                      </Badge>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
              <Button
                size="sm"
                type="button"
                className="w-full flex justify-evenly rounded-r-full"
                onClick={handleAddToCart}
              >
                <AddShoppingCartIcon className="h-4 w-4" />
              </Button>
            </motion.div>
          ) : (
            <div className="w-full flex bg-primary rounded-full">
              <Button
                size="sm"
                type="button"
                className="w-full flex justify-evenly rounded-l-full"
                onClick={MinusCart}
                disabled={prod.Cant == 0}
              >
                <RemoveShoppingCartOutlinedIcon className="h-4 w-4 mr-1" />
              </Button>
              <div className="p-2">
                <Badge className=" text-white" variant="outline">
                  {prod.Cant}
                </Badge>
              </div>
              <Button
                size="sm"
                type="button"
                className="w-full flex justify-evenly rounded-r-full"
                onClick={handleAddToCart}
              >
                <AddShoppingCartIcon className="h-4 w-4 mr-1" />
              </Button>
            </div>
          )}
        </div>
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
