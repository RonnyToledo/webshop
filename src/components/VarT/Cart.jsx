"use client";
import React from "react";
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
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useContext, useState, useEffect } from "react";
import { initializeAnalytics } from "@/lib/datalayer";
import { v4 as uuidv4 } from "uuid";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { MyContext } from "@/context/MyContext";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useDialogStore } from "@/lib/dialogStore";

export default function CartPage() {
  const { toast } = useToast();
  const { open, toggleDialog } = useDialogStore();
  const { store, dispatchStore } = useContext(MyContext);
  const now = new Date();
  const [code, setCode] = useState("");
  const [compra, setCompra] = useState({
    envio: "pickup",
    pago: "cash",
    pedido: [],
    total: 0,
    provincia: "",
    municipio: "",
    code: { discount: 0, name: "" },
  });
  const [activeCode, setActiveCode] = useState(false);

  useEffect(() => {
    const calculateTotal = () => {
      let total = 0;
      store.products.forEach((objeto) => {
        total += objeto.price * (1 / store.moneda_default.valor) * objeto.Cant;
        objeto.agregados.forEach((agregate) => {
          total += agregate.cantidad * (Number(agregate.valor) + objeto.price);
        });
      });
      return total;
    };

    setCompra((prevCompra) => ({
      ...prevCompra,
      pedido: store.products.filter(
        (obj) => obj.Cant > 0 || Suma(obj.agregados) > 0
      ),
      total: calculateTotal(),
    }));
  }, [store]);

  const Suma = (agregados) =>
    agregados.reduce((sum, obj) => sum + obj.cantidad, 0);

  const getLocalISOString = (date) => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 19);
  };

  const handleOrderClick = () => {
    const newUID = uuidv4();
    let mensaje = `Hola, Quiero realizar este pedido:\n- Metodo de envio: ${
      compra.envio === "pickup" ? "Recoger en Tienda" : "Envío a Domicilio"
    }\n- Tipo de Pago: ${
      compra.pago === "cash" ? "Efectivo" : "Transferencia"
    }\n${
      compra.envio !== "pickup"
        ? `- Provincia: ${compra.provincia}\n- Municipio: ${compra.municipio}\n`
        : ""
    }- ID de Venta: ${newUID}\n\n- Productos:\n`;

    compra.pedido.forEach((producto, index) => {
      if (producto.Cant > 0) {
        mensaje += `   ${index + 1}. ${producto.title} x${producto.Cant}: ${(
          producto.Cant *
          producto.price *
          (1 / store.moneda_default.valor)
        ).toFixed(2)}\n`;
      }
      producto.agregados.forEach((agregate) => {
        if (agregate.cantidad > 0) {
          mensaje += `   . ${producto.title}-${agregate.nombre} x${
            agregate.cantidad
          }: ${(
            (producto.price + Number(agregate.valor)) *
            agregate.cantidad *
            (1 / store.moneda_default.valor)
          ).toFixed(2)}\n`;
        }
      });
    });

    mensaje += `- Total de la orden: ${
      compra.total.toFixed(2) * (1 - compra.code.discount / 100)
    } ${store.moneda_default.moneda}\n`;
    mensaje += `- Codigo de Descuento: ${compra.code.name}\n`;

    const mensajeCodificado = encodeURIComponent(mensaje);
    const urlWhatsApp = `https://wa.me/${store.cell}?text=${mensajeCodificado}`;

    if (compra.total === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No hay productos en su carrito",
      });
    } else if (
      compra.envio === "pickup" ||
      (compra.envio === "delivery" && compra.provincia && compra.municipio)
    ) {
      window.open(urlWhatsApp, "_blank");
      if (store.sitioweb) {
        initializeAnalytics({
          UUID_Shop: store.UUID,
          events: "compra",
          date: getLocalISOString(now),
          desc: JSON.stringify(compra),
          uid: newUID,
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No ha declarado la ubicación de su domicilio",
      });
    }
  };
  const ChangeCode = () => {
    const a = store.codeDiscount.find((obj) => obj.code == code);
    setActiveCode(store.codeDiscount.some((item) => item.code === code));
    if (a == undefined) {
      toast({
        variant: "destructive",
        title: "Error",
        description: ` EL codigo ${code} no existe`,
      });
    } else if (a) {
      setCompra({
        ...compra,
        code: { ...code, discount: a?.discount, name: a?.code },
      });
      toast({
        title: "Codigo Aplicado",
      });
      toggleDialog();
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ha ocurrido un error inesperado",
      });
    }
  };
  return (
    <div className="w-full p-4 bg-gray-100">
      <div className="flex items-center justify-between py-3">
        <h1 className="text-3xl font-bold">Carrito de Compras</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3">
        <ShippingMethodSection
          setCompra={setCompra}
          compra={compra}
          store={store}
        />
        <PaymentMethodSection
          setCompra={setCompra}
          compra={compra}
          store={store}
        />
      </div>
      {compra.envio === "delivery" && (
        <DeliveryDetailsSection
          setCompra={setCompra}
          compra={compra}
          store={store}
        />
      )}
      <OrderSummarySection compra={compra} store={store} />
      {store.marketing && store.plan == "custom" && store.CodePromo && (
        <div className="flex justify-end mt-6">
          <Dialog open={open} onOpenChange={toggleDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                Aplicar código de descuento
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Aplicar código de descuento</DialogTitle>
                <DialogDescription>
                  Ingresa tu código de descuento para ver el monto final.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid items-center grid-cols-[1fr_auto] gap-4">
                  <Input
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value.toUpperCase());
                      setActiveCode(false);
                    }}
                    placeholder="Ingresa el código"
                  />
                  <Button disabled={activeCode} onClick={ChangeCode}>
                    Aplicar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
      <div className="flex justify-end mt-6">
        <Button size="lg" onClick={handleOrderClick}>
          Completar Orden
        </Button>
      </div>
    </div>
  );
}

const ShippingMethodSection = ({ setCompra, compra, store }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-2xl font-bold mb-4">Detalles de Envío</h2>
    <Label htmlFor="shipping-method">Método de Envío</Label>
    <Select
      defaultValue="pickup"
      id="shipping-method"
      onValueChange={(value) =>
        setCompra((prev) => ({ ...prev, envio: value }))
      }
    >
      <SelectTrigger>
        <SelectValue placeholder="Selecciona un método de envío" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pickup">Recoger en Tienda</SelectItem>
        {store.domicilio && (
          <SelectItem value="delivery">Envío a Domicilio</SelectItem>
        )}
      </SelectContent>
    </Select>
  </div>
);

const PaymentMethodSection = ({ setCompra, compra, store }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-2xl font-bold mb-4">Método de Pago</h2>
    <Label htmlFor="payment-method">Método de Pago</Label>
    <Select
      defaultValue="cash"
      id="payment-method"
      onValueChange={(value) => setCompra((prev) => ({ ...prev, pago: value }))}
    >
      <SelectTrigger>
        <SelectValue placeholder="Selecciona un método de pago" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="cash">Efectivo</SelectItem>
        {store.act_tf && (
          <SelectItem value="transfer">Transferencia</SelectItem>
        )}
      </SelectContent>
    </Select>
  </div>
);

const DeliveryDetailsSection = ({ setCompra, compra, store }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3">
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Provincia</h2>
      <Label htmlFor="province">Selecciona la provincia</Label>
      <Select
        id="province"
        required={compra.envio === "delivery"}
        onValueChange={(value) =>
          setCompra((prev) => ({
            ...prev,
            provincia: value,
            municipio: store.envios.find((obj) => obj.nombre === value)
              ?.municipios[0],
          }))
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Seleccione su provincia" />
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Municipio</h2>
      <Label htmlFor="municipality">Selecciona el municipio</Label>
      <Select
        id="municipality"
        required={compra.envio === "delivery"}
        onValueChange={(value) =>
          setCompra((prev) => ({ ...prev, municipio: value }))
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Seleccione su municipio" />
        </SelectTrigger>
        <SelectContent>
          {store.envios
            .find((obj) => obj.nombre === compra.provincia)
            ?.municipios.map((obj, ind) => (
              <SelectItem key={ind} value={obj}>
                {obj}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  </div>
);

const OrderSummarySection = ({ compra, store }) => (
  <div className="bg-white rounded-lg shadow-md sm:p-6 mt-4 py-3 px-2">
    <h2 className="text-2xl font-bold mb-4">Resumen de la Orden</h2>
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
          <React.Fragment key={ind2}>
            {pedido.Cant > 0 && (
              <TableRow>
                <TableCell className="font-medium line-clamp-2">
                  {pedido.title}
                </TableCell>
                <TableCell>
                  <div className="flex justify-between items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={pedido.Cant === 0}
                      className="p-1 h-5 w-5 hover:text-foreground"
                      onClick={() =>
                        dispatchStore({
                          type: "AddCart",
                          payload: JSON.stringify({
                            ...pedido,
                            Cant: pedido.Cant - 1,
                          }),
                        })
                      }
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Badge variant="outline">{pedido.Cant}</Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="p-1 h-5 w-5 hover:text-foreground"
                      onClick={() =>
                        dispatchStore({
                          type: "AddCart",
                          payload: JSON.stringify({
                            ...pedido,
                            Cant: pedido.Cant + 1,
                          }),
                        })
                      }
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {pedido.price.toFixed(2)}
                </TableCell>
              </TableRow>
            )}
            {pedido.agregados.map(
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
                          className="p-1 h-5 w-5 hover:text-foreground"
                          onClick={() => {
                            const updatedAgregados = pedido.agregados.map(
                              (obj1) =>
                                agregate.nombre === obj1.nombre
                                  ? { ...obj1, cantidad: obj1.cantidad - 1 }
                                  : obj1
                            );
                            dispatchStore({
                              type: "AddCart",
                              payload: JSON.stringify({
                                ...pedido,
                                agregados: updatedAgregados,
                              }),
                            });
                          }}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Badge variant="outline">{agregate.cantidad}</Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="p-1 h-5 w-5 hover:text-foreground"
                          onClick={() => {
                            const updatedAgregados = pedido.agregados.map(
                              (obj1) =>
                                agregate.nombre === obj1.nombre
                                  ? { ...obj1, cantidad: obj1.cantidad + 1 }
                                  : obj1
                            );
                            dispatchStore({
                              type: "AddCart",
                              payload: JSON.stringify({
                                ...pedido,
                                agregados: updatedAgregados,
                              }),
                            });
                          }}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {(pedido.price + Number(agregate.valor)).toFixed(2)}
                    </TableCell>
                  </TableRow>
                )
            )}
          </React.Fragment>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Total</TableCell>
          <TableCell className="text-right">
            {Number(compra.total * (1 - compra.code.discount / 100)).toFixed(2)}{" "}
            {store.moneda_default.moneda}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  </div>
);
