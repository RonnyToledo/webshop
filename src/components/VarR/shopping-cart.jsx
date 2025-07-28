"use client";
import React from "react";
import Image from "next/image";
import {
  ChevronUpCircle,
  ChevronDownCircle,
  Loader,
  ShoppingCart,
} from "lucide-react";
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
import { ToastAction } from "../ui/toast";
import { MyContext } from "@/context/MyContext";
import { useContext, useState, useEffect } from "react";
import { Input } from "../ui/input";
import { v4 as uuidv4 } from "uuid";
import { initializeAnalytics } from "@/lib/datalayer";
import { motion } from "framer-motion";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import { useRouter } from "next/navigation";
import { RatingModal } from "./RatingModalCart";
import axios from "axios";
import { logoApp } from "@/lib/image";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { isValidPhoneNumber } from "libphonenumber-js";

export function ShoppingCartComponent() {
  const newUID = uuidv4();
  const { toast } = useToast();
  const { store, dispatchStore } = useContext(MyContext);
  const [downloading, setDownloading] = useState(false);
  const router = useRouter();
  const now = new Date();
  const [code, setCode] = useState("");
  const [compra, setCompra] = useState({
    envio: "pickup",
    pago: "cash",
    pedido: [],
    total: 0,
    provincia: "",
    phonenumber: 0,
    municipio: "",
    code: { discount: 0, name: "" },
    people: "",
  });
  const [activeCode, setActiveCode] = useState(false);
  const [count, setCount] = useState(3);
  const [loading, setLoading] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(1);
  const [description, setDescription] = useState("");
  const [nombre, setNombre] = useState("");

  useEffect(() => {
    const calculateTotal = () => {
      let total = 0;
      store.products.forEach((objeto) => {
        total += objeto.price * (1 / store.moneda_default.valor) * objeto.Cant;
      });
      return total;
    };

    setCompra((prevCompra) => ({
      ...prevCompra,
      pedido: store.products.filter((obj) => obj.Cant > 0),
      total: calculateTotal(),
    }));
  }, [store]);

  //Detectar si no  hay productos en el carrito
  useEffect(() => {
    if (compra.pedido.length === 0 && store.sitioweb) {
      // Iniciar el contador regresivo
      const interval = setInterval(() => {
        setCount((prev) => prev - 1);
      }, 1000);

      // Redirigir después de 3 segundos
      const timeout = setTimeout(() => {
        router.push(`/t/${store.sitioweb}`);
      }, 3000);

      // Limpiar intervalos y timeouts al desmontar
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [compra.pedido, store.sitioweb, router]);

  const handleOrderClick = async (e) => {
    e.preventDefault();

    if (isValidPhoneNumber(`+${compra.phonenumber}`) === false) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El numero proporcionado es incorrecto",
      });
      return;
    }
    if (compra.total === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No hay productos en su carrito",
      });
      return;
    }
    if (compra.people === "") {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Tiene que introducir un encargado de su compra",
      });
      return;
    }
    if (
      compra.envio === "pickup" ||
      (compra.envio === "delivery" && compra.provincia && compra.municipio)
    ) {
      if (store.sitioweb) {
        // Inicializa Analytics
        try {
          setDownloading(true);
          await initializeAnalytics({
            UUID_Shop: store.UUID,
            events: "compra",
            date: getLocalISOString(now),
            desc: JSON.stringify(compra),
            uid: newUID,
            nombre: compra.people,
            phonenumber: compra.phonenumber,
          });

          // Pausa para calificar la tienda
          setShowRatingModal(true);
          // Muestra una alerta con la calificación o realiza alguna acción
        } catch (error) {
          toast({
            variant: "destructive",
            title: `Error`,
            description: `No ha declarado la ubicación de su domicilio ${error}`,
          });
        } finally {
          setDownloading(false);
        }
      }
    } else {
      toast({
        variant: "destructive",
        title: `Error `,
        description: "Ha ocurrido un error inesperado",
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

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append(
      "comentario",
      JSON.stringify({
        cmt: description,
        title: "",
        star: selectedRating,
        name: nombre,
      })
    );
    formData.append("UUID", store.UUID);
    try {
      const res = await axios.post(
        `/api/tienda/${store.sitioweb}/comment`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.status == 200) {
        sendToWhatsapp();
        toast({
          title: "Comentario Realizado",
          description: "Gracias por el comentario",
          action: (
            <ToastAction altText="Goto schedule to undo">Cerrar</ToastAction>
          ),
        });
        dispatchStore({ type: "AddComent", payload: res?.data?.value });
      }
    } catch (error) {
      console.error("Error al enviar el comentario:", error);
      toast({
        title: "Error",
        variant: "destructive",
        description: `Error:${error}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const sendToWhatsapp = () => {
    setShowRatingModal(false);

    // Abrir WhatsApp

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
    });

    mensaje += `- Total de la orden: ${
      compra.total.toFixed(2) * (1 - compra.code.discount / 100)
    } ${store.moneda_default.moneda}\n`;
    if (compra.code.name) {
      mensaje += `- Codigo de Descuento: ${compra.code.name}\n`;
    }
    mensaje += `- Identificador ${newUID}\n`;

    const mensajeCodificado = encodeURIComponent(mensaje);
    const urlWhatsApp = `https://wa.me/${store.cell}?text=${mensajeCodificado}`;
    dispatchStore({ type: "Clean" });
    window.open(urlWhatsApp, "_blank");
  };
  return (
    <form onSubmit={handleOrderClick}>
      {compra.pedido.length > 0 ? (
        <div className="flex flex-col bg-gray-50">
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
              </motion.div>
            ))}
            <div className="bg-white rounded-2xl p-4 space-y-4 shadow-sm">
              {store.act_tf && (
                <div className="flex items-center justify-between">
                  <Label htmlFor="payment-type" className="text-sm font-medium">
                    Tipo de Pago
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
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="delivery" className="text-sm font-medium">
                  Telefono
                </Label>
                <PhoneInput
                  country={"cu"}
                  required
                  value={compra.phonenumber}
                  onChange={(e) =>
                    setCompra((prev) => ({
                      ...prev,
                      phonenumber: e,
                    }))
                  }
                  inputStyle={{ width: "100%" }}
                  placeholder="Ingresa tu número"
                />
              </div>
              <div className="flex flex-col items-start justify-between gap-2">
                <Input
                  id="name"
                  placeholder="Nombre de quien va a recibir este pedido"
                  defaultValue={compra.people}
                  onChange={(e) =>
                    setCompra((prev) => ({
                      ...prev,
                      people: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </main>
          {compra.envio === "delivery" && (
            <div className="grid grid-cols-1 gap-4">
              <DeliveryDetailsSection
                setCompra={setCompra}
                compra={compra}
                store={store}
              />
            </div>
          )}
          {store.marketing && store.plan == "custom" && store.codeDiscount && (
            <div className="flex justify-center m-4">
              <div className="grid items-center grid-cols-[1fr_auto]">
                <Input
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.toUpperCase());
                    setActiveCode(false);
                  }}
                  placeholder="Ingresa el código"
                />
                <Button
                  disabled={activeCode}
                  onClick={ChangeCode}
                  variant="outline"
                >
                  Aplicar
                </Button>
              </div>
            </div>
          )}
          <footer className="bg-white p-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total</span>
              <span className="text-2xl font-bold">
                {`${
                  compra.code.discount > 0 ? `(${compra.code.discount}%) ` : ``
                }`}{" "}
                $
                {Number(
                  compra.total * (1 - compra.code.discount / 100)
                ).toFixed(2)}
                {store.moneda_default.moneda}
              </span>
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
              onClick={handleOrderClick}
              disabled={downloading}
            >
              {!downloading ? (
                <>
                  <ShoppingCartCheckoutIcon className="h-8 w-8 text-white" />
                  Enviar Pedido
                </>
              ) : (
                <>
                  <Loader className=" animate-spin h-8 w-8 text-white" />
                  Preparando su pedido
                </>
              )}
            </Button>
          </footer>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
          <div className="text-center p-8 bg-white rounded-lg shadow-md">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
            <p className="text-gray-600 mb-4">
              ¿Listo para agregar algunos productos?
            </p>
            <p className="text-gray-600 mb-4">
              Te vamos a llevar a nuetra pagina principal{" "}
            </p>
            <div className="text-4xl font-bold text-blue-500 animate-pulse">
              {count}
            </div>
          </div>
        </div>
      )}
      <RatingModal
        isOpen={showRatingModal}
        onClose={() => {
          setShowRatingModal(false);
          sendToWhatsapp();
        }}
        selectedRating={selectedRating}
        userName={store.name}
        image={store.urlPoster || logoApp}
        setSelectedRating={setSelectedRating}
        description={description}
        setDescription={setDescription}
        nombre={nombre}
        setNombre={setNombre}
        loading={loading}
        handleSubmit={handleSubmitRating}
      />
    </form>
  );
}
function ListProducts({ pedido, agregate }) {
  const { dispatchStore } = useContext(MyContext);

  function MinusCart() {
    let Cant = pedido.Cant;

    Cant--;

    dispatchStore({
      type: "AddCart",
      payload: JSON.stringify({
        ...pedido,
      }),
    });
  }
  function PlusCart() {
    let Cant = pedido.Cant;

    Cant++;
    dispatchStore({
      type: "AddCart",
      payload: JSON.stringify({
        ...pedido,
        Cant: Cant,
      }),
    });
  }

  return (
    <div className="bg-white rounded-2xl p-4 flex items-center space-x-4 shadow-sm">
      <Image
        src={pedido.image || logoApp}
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
          type="button"
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
          type="button"
        >
          <ChevronDownCircle className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}

const DeliveryDetailsSection = ({ setCompra, compra, store }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 p-4 gap-4 py-3">
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
const getLocalISOString = (date) => {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);
  return localDate.toISOString().slice(0, 19);
};
