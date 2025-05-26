"use client";

import React from "react";

import { useState, useContext } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Check, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MyContext } from "@/context/MyContext";
import Link from "next/link";
import { ClipboardList } from "lucide-react";

export default function ProductCard({
  id,
  productId,
  title,
  price,
  descripcion,
  agotado,
  Cant,
  span,
  image,
  creado,
  prod,
}) {
  const { store, dispatchStore } = useContext(MyContext);

  const [isZoomed, setIsZoomed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = () => {
    dispatchStore({
      type: "AddCart",
      payload: JSON.stringify({ ...prod, Cant: Cant + 1 }),
    });

    // Aquí podrías agregar lógica para añadir al carrito real
  };

  const decreaseQuantity = () => {
    dispatchStore({
      type: "AddCart",
      payload: JSON.stringify({ ...prod, Cant: Cant - 1 }),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-full max-w-sm ${span ? "col-span-2" : ""}`}
    >
      <Card className="overflow-hidden border-0 shadow-lg bg-white rounded-xl">
        <Link
          href={`/t/${store.sitioweb}/products/${productId}`}
          className="aspect-[3/4]"
        >
          <div
            className="relative h-64 overflow-hidden bg-gray-100 "
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsZoomed(true)}
            onTouchEnd={() => setIsZoomed(false)}
          >
            <motion.div
              animate={{
                scale: isZoomed || isHovered ? 1.1 : 1,
              }}
              transition={{ duration: 0.3 }}
              className="h-full w-full"
            >
              <Image
                src={
                  image ||
                  store.urlPoster ||
                  "https://res.cloudinary.com/dbgnyc842/image/upload/v1725399957/xmlctujxukncr5eurliu.png"
                }
                alt={name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </motion.div>
            {HanPasadoSieteDias(creado) && (
              <motion.div className="absolute top-2 left-2">
                <Badge className="bg-white text-black hover:bg-white">
                  Nuevo
                </Badge>
              </motion.div>
            )}
            {prod.oldPrice > prod.price && (
              <motion.div className="absolute top-2 right-2">
                <Badge className="bg-red-500 text-white hover:bg-red-600">
                  -
                  {Math.round(
                    ((prod.oldPrice - prod.price) / prod.oldPrice) * 100
                  )}
                  %
                </Badge>
              </motion.div>
            )}
          </div>
        </Link>

        <CardContent className="p-2">
          <div className="flex flex-col justify-between items-start mb-2">
            <div>
              <h3 className="font-medium text-base line-clamp-2 h-12 text-gray-900">
                {title}
              </h3>
              <span className="font-bold text-lg text-gray-900">
                ${Number(price).toFixed(2)}
              </span>
              <p className="h-10 line-clamp-2 text-sm text-gray-500 mt-1">
                {descripcion}
              </p>
            </div>
          </div>

          <div className="m-2">
            <AnimatePresence mode="wait">
              {agotado ? (
                <motion.div
                  key="add"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Button
                    disabled
                    className="w-full bg-black hover:bg-gray-800 text-white transition-all duration-100"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Agotado
                  </Button>
                </motion.div>
              ) : Cant === 0 ? (
                <motion.div
                  key="add"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Button
                    onClick={handleAddToCart}
                    className="w-full transition-all duration-100"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Añadir al carrito
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="quantity"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-between"
                >
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={decreaseQuantity}
                    className="rounded-full h-8 w-8 border-gray-200"
                    disabled={Cant === 0}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>

                  <motion.span
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="font-medium"
                  >
                    {Cant}
                  </motion.span>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleAddToCart}
                    className="rounded-full h-8 w-8 border-gray-200"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function HanPasadoSieteDias({ fecha }) {
  const fechaEntrada = new Date(fecha);
  const fechaActual = new Date();
  const diferenciaEnDias = (fechaActual - fechaEntrada) / (1000 * 60 * 60 * 24);
  return diferenciaEnDias <= 7;
}
