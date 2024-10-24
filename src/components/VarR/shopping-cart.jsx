"use client";
import React from "react";
import Image from "next/image";
import { ChevronUpCircle, ChevronDownCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { MyContext } from "@/context/MyContext";
import { useContext, useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { useDialogStore } from "@/lib/dialogStore";
import { v4 as uuidv4 } from "uuid";
import { initializeAnalytics } from "@/lib/datalayer";
import { motion } from "framer-motion";
import { transitionVariants } from "../globalFunctions/function";

export function ShoppingCartComponent() {
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
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ha ocurrido un error inesperado",
      });
    }
  };

  return (
    <div className="flex flex-col bg-gray-50 mt-10 ">
      <main className="flex-grow p-4 space-y-4">
        {compra.pedido.map((item, i) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{
              opacity: 0,
              scale: 0,
              y: innerHeight,
              height: 0,
              transition: { duration: 0.7 },
            }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              duration: 0.7,
              delay: 0.5 + i / 10,
            }}
            key={i}
          >
            <ListProducts pedido={item} />
            {item.agregados.map(
              (agregate, ind3) =>
                agregate.cantidad > 0 && (
                  <ListProducts pedido={item} key={ind3} agregate={agregate} />
                )
            )}
          </motion.div>
        ))}
        <div className="bg-white rounded-2xl p-4 space-y-4 shadow-sm">
          {store.act_tf && (
            <div className="flex items-center justify-between">
              <Label htmlFor="payment-type" className="text-sm font-medium">
                Tipo de Paog
              </Label>
              <Select
                onValueChange={(value) =>
                  setCompra((prev) => ({ ...prev, pago: value }))
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select payment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Efectivo</SelectItem>
                  <SelectItem value="transfer">Transferencia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {store.domicilio && (
            <div className="flex items-center justify-between">
              <Label htmlFor="delivery" className="text-sm font-medium">
                Domicilio
              </Label>
              <Switch
                id="delivery"
                checked={compra.envio == "delivery"}
                onCheckedChange={(value) =>
                  setCompra((prev) => ({
                    ...prev,
                    envio: value ? "delivery" : "pickup",
                  }))
                }
              />
            </div>
          )}
        </div>
      </main>
      {compra.envio === "delivery" && (
        <DeliveryDetailsSection
          setCompra={setCompra}
          compra={compra}
          store={store}
        />
      )}
      {store.marketing && store.plan == "custom" && store.custom.CodePromo && (
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
      <footer className="bg-white p-4 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total</span>
          <span className="text-2xl font-bold">
            $
            {Number(compra.total * (1 - compra.code.discount / 100)).toFixed(2)}
            {store.moneda_default.moneda}
          </span>
        </div>
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          size="lg"
          onClick={handleOrderClick}
        >
          Proceed to Checkout
        </Button>
      </footer>
    </div>
  );
}
function ListProducts({ pedido, agregate }) {
  const { dispatchStore } = useContext(MyContext);

  function MinusCart() {
    let updatedAgregados = pedido.agregados;
    let Cant = pedido.Cant;
    if (agregate?.nombre) {
      updatedAgregados = pedido.agregados.map((obj1) =>
        agregate.nombre === obj1.nombre
          ? { ...obj1, cantidad: obj1.cantidad - 1 }
          : obj1
      );
    } else {
      Cant--;
    }
    dispatchStore({
      type: "AddCart",
      payload: JSON.stringify({
        ...pedido,
        Cant: Cant,
        agregados: updatedAgregados,
      }),
    });
  }
  function PlusCart() {
    let updatedAgregados = pedido.agregados;
    let Cant = pedido.Cant;
    if (agregate?.nombre) {
      updatedAgregados = pedido.agregados.map((obj1) =>
        agregate.nombre === obj1.nombre
          ? { ...obj1, cantidad: obj1.cantidad + 1 }
          : obj1
      );
    } else {
      Cant++;
    }
    dispatchStore({
      type: "AddCart",
      payload: JSON.stringify({
        ...pedido,
        Cant: Cant,
        agregados: updatedAgregados,
      }),
    });
  }

  return (
    <div className="bg-white rounded-2xl p-4 flex items-center space-x-4 shadow-sm">
      <Image
        src={
          pedido.image ||
          "https://res.cloudinary.com/dbgnyc842/image/upload/v1725399957/xmlctujxukncr5eurliu.png"
        }
        alt={pedido.title || "Producto"}
        width={200}
        height={200}
        className="rounded-xl object-cover h-28 w-20"
      />
      <div className="flex-grow">
        <h2 className="font-semibold">
          {pedido.title}
          {agregate?.nombre && ` - ${agregate.nombre}`}
        </h2>
        <p className="text-blue-600 font-bold">
          $
          {agregate?.valor
            ? (pedido.price + Number(agregate.valor)).toFixed(2)
            : Number(pedido.price).toFixed(2)}
        </p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 rounded-full"
          onClick={PlusCart}
        >
          <ChevronUpCircle className="h-6 w-6" />
        </Button>

        <span className="w-6 text-center">
          {agregate?.cantidad ? agregate.cantidad : pedido.Cant}
        </span>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 rounded-full"
          disabled={pedido.Cant === 0}
          onClick={MinusCart}
        >
          <ChevronDownCircle className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}

const DeliveryDetailsSection = ({ setCompra, compra, store }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3">
    <div className="flex bg-white rounded-lg shadow-md p-6  gap-2">
      <h2 className="text-xl font-bold mb-4">Provincia</h2>
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
    <div className="flex bg-white rounded-lg shadow-md p-6 gap-2">
      <h2 className=" text-xl font-bold mb-4">Municipio</h2>
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
