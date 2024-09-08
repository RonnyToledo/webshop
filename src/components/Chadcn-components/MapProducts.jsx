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
import { Plus, Minus, Star } from "lucide-react";
import Link from "next/link";

export default function MapProducts({ prod, store, dispatchStore }) {
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
    <div className="p-2">
      <div className="relative bg-cover bg-center group rounded-2xl overflow-hidden">
        <Link
          className="relative"
          href={`/${store.variable}/${store.sitioweb}/products/${prod.productId}`}
        >
          <Image
            src={
              prod.image
                ? prod.image
                : "https://res.cloudinary.com/dbgnyc842/image/upload/v1725399957/xmlctujxukncr5eurliu.png"
            }
            alt={prod.title || "Product"}
            className="w-full group-hover:scale-105 transition-transform block object-cover"
            height="300"
            width="200"
            style={{ aspectRatio: "200/300", objectFit: "cover" }}
          />
          <HanPasadoSieteDias fecha={prod.creado} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-between p-2 md:p-8">
            <h4 className="flex gap-1 text-xs md:text-lg text-white font-bold line-clamp-2 overflow-hidden bg-primary rounded-lg p-1 max-w-max">
              {Number(StarLength(prod)).toFixed(1)}
              <Star className="w-4 h-4 md:w-5 md:h-5 fill-gray-100" />
            </h4>
            <h4 className="text-xs sm:text-lg text-white font-bold line-clamp-2 overflow-hidden">
              {prod.title}
            </h4>
          </div>
        </Link>
      </div>
      <p className="text-gray-700 font-semibold text-end">
        {(prod.price / store.moneda_default.valor).toFixed(2)}{" "}
        {store.moneda_default.moneda}
      </p>

      {store.domicilio &&
        (!prod.agotado ? (
          prod.agregados.length > 0 ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">Agregados</Button>
              </DialogTrigger>
              <DialogContent className="max-w-[300px] sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Agregados</DialogTitle>
                  <DialogDescription>
                    Selecciona los agregados para {prod.title} (precio:{" "}
                    {prod.price}).
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
                          variant="ghost"
                          size="icon"
                          disabled={obj.cantidad === 0}
                          className="p-1 h-5 w-5 hover:text-foreground"
                          onClick={() => handleAgregadoUpdate(obj.nombre, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Badge variant="outline">{obj.cantidad}</Badge>
                        <Button
                          variant="ghost"
                          size="icon"
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
                  <Button onClick={handleAddToCart}>
                    Sin Agregados <Badge className="ml-3">{prod.Cant}</Badge>
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : (
            <Button className="w-full" onClick={handleAddToCart}>
              Add to Cart <Badge className="ml-3">{prod.Cant}</Badge>
            </Button>
          )
        ) : (
          <Button disabled className="w-full">
            Agotado
          </Button>
        ))}
    </div>
  );
}

function HanPasadoSieteDias({ fecha }) {
  const fechaEntrada = new Date(fecha);
  const fechaActual = new Date();
  const diferenciaEnDias = (fechaActual - fechaEntrada) / (1000 * 60 * 60 * 24);

  return (
    <div className="absolute" style={{ top: "5px", right: "5px" }}>
      {diferenciaEnDias <= 7 && (
        <h2 className="bg-primary text-gray-100 rounded-lg p-1 text-xs">New</h2>
      )}
    </div>
  );
}

function StarLength(product) {
  if (product?.coment?.length > 0) {
    const totalStars = product.coment.reduce((acc, obj) => acc + obj.star, 0);
    return totalStars / product.coment.length;
  }
  return 0;
}
