"use client";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { useContext, useState, useEffect } from "react";
import { context } from "@/app/layout";

export default function CartPage() {
  const { store, dispatchStore } = useContext(context);

  const [compra, setCompra] = useState({
    envio: "pickup",
    pago: "cash",
    pedido: [],
    total: 0,
    provincia: store.Provincia,
    municipio: store.municipio,
  });
  function Suma(agregados) {
    let b = 0;
    agregados.map((objeto) => (b = b + objeto.cantidad));
    return b;
  }
  function Precio(obj) {
    let b = 0;
    obj.agregados.map(
      (objeto) => (b += objeto.cantidad * (Number(objeto.valor) + obj.price))
    );
    return b;
  }
  useEffect(() => {
    let pagar = 0;
    store.products.map(
      (objeto) =>
        (pagar +=
          objeto.price *
            (1 / store.moneda_default.valor) *
            (1 - objeto.discount / 100) *
            objeto.Cant +
          Precio(objeto))
    );
    console.log(pagar);

    const CambiarDatos = () => {
      setCompra({
        ...compra,
        pedido: store.products.filter(
          (obj) => obj.Cant > 0 || Suma(obj.agregados) > 0
        ),
        total: pagar,
      });
    };
    CambiarDatos();
  }, [store]);

  let mensaje = `Hola, Quiero realizar este pedido:\n`;
  mensaje += `- Metodo de envio: ${
    compra.envio == "pickup" ? "Recoger en Tienda" : "Envío a Domicilio"
  }\n`;
  mensaje += `- Tipo de Pago: ${
    compra.pago == "cash" ? "Efectivo" : "Trasnferencia"
  }\n`;
  compra.envio != "pickup" && (mensaje += `- Provincia: ${compra.provincia}\n`);
  compra.envio != "pickup" && (mensaje += `- Municipio: ${compra.municipio}\n`);
  mensaje += `- Productos:\n`;
  compra.pedido.forEach((producto, index) => {
    if (producto.Cant > 0) {
      mensaje += `   ${index + 1}. ${producto.title} x${producto.Cant}: ${(
        producto.Cant *
        producto.price *
        (1 / store.moneda_default.valor) *
        ((100 - producto.discount) / 100)
      ).toFixed(2)}\n`;
    }
    producto.agregados.forEach((agregate, ind3) => {
      if (agregate.cantidad > 0) {
        mensaje += `   . ${producto.title}-${agregate.nombre} x${
          agregate.cantidad
        }: ${(
          (producto.price + Number(agregate.valor)) *
          agregate.cantidad *
          (1 / store.moneda_default.valor) *
          ((100 - producto.discount) / 100)
        ).toFixed(2)}\n`;
      }
    });
  });
  mensaje += `- Total de la orden: ${compra.total.toFixed(2)} ${
    store.moneda_default.moneda
  }\n`;

  // Codificar el mensaje para usarlo en una URL de WhatsApp
  const mensajeCodificado = encodeURIComponent(mensaje);
  const urlWhatsApp = `https://wa.me/53${store.cell}?text=${mensajeCodificado}`;

  const manejarClick = () => {
    window.open(urlWhatsApp, "_blank"); // Cambia la URL por la que desees abrir
  };

  return (
    <>
      <div className="w-full p-4 bg-gray-100">
        <div className="flex items-center justify-between  py-3 ">
          <h1 className="text-3xl font-bold">Carrito de Compras</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3 ">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Detalles de Envío</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="shipping-method">Método de Envío</Label>
                <Select
                  defaultValue="pickup"
                  id="shipping-method"
                  onValueChange={(value) => {
                    setCompra({
                      ...compra,
                      envio: value,
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un método de envío" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pickup">Recoger en Tienda</SelectItem>
                    {store.domicilio && (
                      <SelectItem value="delivery">
                        Envío a Domicilio
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Método de Pago</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="payment-method">Método de Pago</Label>
                <Select
                  defaultValue="cash"
                  id="payment-method"
                  onValueChange={(value) => {
                    setCompra({
                      ...compra,
                      pago: value,
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un método de pago" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Efectivo</SelectItem>
                    {store.tf_ac && (
                      <SelectItem value="transfer">Transferencia</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        {compra.envio == "delivery" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3 ">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Provincia</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="payment-method">
                    Selecciona la provincia
                  </Label>
                  <Select
                    defaultValue="cash"
                    id="payment-method"
                    onValueChange={(value) => {
                      setCompra({
                        ...compra,
                        provincia: value,
                        municipio: store.envios.filter(
                          (obj) => obj.nombre == value
                        )[0]?.municipios[0],
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={store.Provincia} />
                    </SelectTrigger>
                    <SelectContent>
                      {store.envios.map((obj, ind) => (
                        <SelectItem key={ind} value={obj.nombre}>
                          {obj.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Municipio</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="payment-method">
                    Selecciona el municipio
                  </Label>
                  <Select
                    defaultValue="cash"
                    id="payment-method"
                    onValueChange={(value) => {
                      setCompra({
                        ...compra,
                        municipio: value,
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={store.Provincia} />
                    </SelectTrigger>
                    <SelectContent>
                      {store.envios
                        .filter((obj) => obj.nombre == compra.provincia)[0]
                        ?.municipios.map((obj, ind) => (
                          <SelectItem key={ind} value={obj}>
                            {obj}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="bg-white rounded-lg shadow-md sm:p-6 mt-4 py-3  px-2">
          <h2 className="text-2xl font-bold mb-4">Resumen de la Orden</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Table>
              <TableCaption>A list of your recent invoices.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Producto</TableHead>
                  <TableHead className="w-[50px]">Cantidad</TableHead>
                  <TableHead className="text-right w-[50px]">PxU</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {compra.pedido.map((pedido, ind2) => (
                  <>
                    {pedido.Cant > 0 && (
                      <TableRow key={ind2}>
                        <TableCell className="font-medium">
                          {pedido.title}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-between items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={pedido.Cant == 0}
                              className="p-1  h-5 w-5 hover:text-foreground"
                              onClick={(e) => {
                                dispatchStore({
                                  type: "AddCart",
                                  payload: JSON.stringify({
                                    ...pedido,
                                    Cant: pedido.Cant - 1,
                                  }),
                                });
                              }}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Badge variant="outline">{pedido.Cant}</Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              className=" p-1 h-5 w-5 hover:text-foreground"
                              onClick={(e) => {
                                dispatchStore({
                                  type: "AddCart",
                                  payload: JSON.stringify({
                                    ...pedido,
                                    Cant: pedido.Cant + 1,
                                  }),
                                });
                              }}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {pedido.price.toFixed(2)}{" "}
                        </TableCell>
                      </TableRow>
                    )}
                    {pedido.agregados.length > 0 &&
                      pedido.agregados.map(
                        (agregate, ind3) =>
                          agregate.cantidad > 0 && (
                            <TableRow key={ind3}>
                              <TableCell className="font-medium">
                                {pedido.title} - {agregate.nombre}
                              </TableCell>
                              <TableCell>
                                <div className="flex justify-between items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="p-1  h-5 w-5 hover:text-foreground"
                                    onClick={(e) => {
                                      const c = pedido.agregados.map((obj1) =>
                                        agregate.nombre == obj1.nombre
                                          ? {
                                              ...obj1,
                                              cantidad: obj1.cantidad - 1,
                                            }
                                          : obj1
                                      );

                                      dispatchStore({
                                        type: "AddCart",
                                        payload: JSON.stringify({
                                          ...pedido,
                                          agregados: c,
                                        }),
                                      });
                                    }}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <Badge variant="outline">
                                    {agregate.cantidad}
                                  </Badge>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className=" p-1 h-5 w-5 hover:text-foreground"
                                    onClick={(e) => {
                                      const c = pedido.agregados.map((obj1) =>
                                        agregate.nombre == obj1.nombre
                                          ? {
                                              ...obj1,
                                              cantidad: obj1.cantidad + 1,
                                            }
                                          : obj1
                                      );

                                      dispatchStore({
                                        type: "AddCart",
                                        payload: JSON.stringify({
                                          ...pedido,
                                          agregados: c,
                                        }),
                                      });
                                    }}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                {(
                                  pedido.price + Number(agregate.valor)
                                ).toFixed(2)}{" "}
                              </TableCell>
                            </TableRow>
                          )
                      )}
                  </>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={2}>Total</TableCell>
                  <TableCell className="text-right">
                    $
                    {compra.total.toFixed(2) +
                      " " +
                      store.moneda_default.moneda}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
          <div className="flex justify-end mt-6">
            <Button size="lg" onClick={manejarClick}>
              Completar Orden
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
