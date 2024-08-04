"use client";
import Link from "next/link";
import React, { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { SheetTrigger, SheetContent, Sheet } from "@/components/ui/sheet";
import {
  PopoverTrigger,
  PopoverContent,
  Popover,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { context } from "@/app/layout";

export default function ReservationPage() {
  const now = new Date();
  const { store, dispatchStore } = useContext(context);
  const [reserva, setreserva] = useState({
    cantidad: 2,
    dia: `${now.getDate()}/${now.getMonth()}/${now.getFullYear()}`,
  });
  const now1 = new Date();
  now1.setMonth(now.getMonth() + 1);
  const [date, setDate] = useState(now);
  const { toast } = useToast();

  const newHorario = store.horario.map((obj, index) => {
    const abierto = new Date(); // Obtener la fecha actual
    const cerrado = new Date();
    abierto.setDate(now.getDate() + index - now.getDay());
    abierto.setHours(obj.apertura);
    abierto.setMinutes(0); // Establecer los minutos a 0
    abierto.setSeconds(0); // Establecer los segundos a 0

    cerrado.setDate(now.getDate() + index - now.getDay());
    cerrado.setMinutes(0); // Establecer los minutos a 0
    cerrado.setSeconds(0); // Establecer los segundos a 0
    if (obj.apertura >= obj.cierre) {
      cerrado.setDate(cerrado.getDate() + 1);
      cerrado.setHours(obj.cierre);
    } else {
      cerrado.setHours(obj.cierre);
    }
    return {
      dia: obj.dia,
      apertura: abierto,
      cierre: cerrado,
    };
  });
  const correccionMonth =
    (newHorario[date.getDay()]?.cierre.getMonth() -
      newHorario[date.getDay()]?.apertura.getMonth()) *
    newHorario[date.getDay()]?.apertura.getDate();
  const lengtharray =
    (correccionMonth +
      newHorario[date.getDay()]?.cierre.getDate() -
      newHorario[date.getDay()]?.apertura.getDate()) *
      24 +
    newHorario[date.getDay()]?.cierre.getHours() -
    newHorario[date.getDay()]?.apertura.getHours();

  function ActiveFunction(value) {
    setDate(value);
    setreserva({
      ...reserva,
      dia: `${value.getDate()}/${value.getMonth()}/${value.getFullYear()}`,
    });
  }

  let mensaje = `Hola, Quiero realizar esta reserva:\n`;
  mensaje += `- A nombre de: ${reserva.nombre}\n`;
  mensaje += `- Para: ${reserva.cantidad} de persona(s)\n`;
  mensaje += `- Dia: ${reserva.dia} \n`;
  mensaje += `- Hora: ${reserva.hora}\n`;
  mensaje += `Espero su confirmacion\n`;

  // Codificar el mensaje para usarlo en una URL de WhatsApp
  const mensajeCodificado = encodeURIComponent(mensaje);
  const urlWhatsApp = `https://wa.me/53${store.cell}?text=${mensajeCodificado}`;
  const manejarClick = () => {
    window.open(urlWhatsApp, "_blank");
  };
  return (
    <div className="grid min-h-screen w-full overflow-hidden lg:grid-cols-[280px_1fr]">
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <div className="mx-auto w-full max-w-sm space-y-2">
            <div className="flex gap-2">
              <div className="flex flex-col w-full">
                <span className="font-semibold uppercase text-[0.65rem]">
                  A nombre de quién
                </span>
                <Input
                  className="w-full"
                  id="name"
                  placeholder="Nombre y Apellidos"
                  type="text"
                  required
                  onChange={(e) =>
                    setreserva({ ...reserva, nombre: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className="w-full flex-col h-auto items-start"
                    variant="outline"
                  >
                    <span className="font-semibold uppercase text-[0.65rem]">
                      Date
                    </span>
                    <span className="font-normal">
                      {date.getDate()}/{date.getMonth()}/{date.getFullYear()}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 max-w-[276px]">
                  <Calendar
                    mode="single"
                    selected={date}
                    required
                    onSelect={(value) => {
                      value >= now && value <= now1
                        ? ActiveFunction(value)
                        : toast({
                            title: "Fecha incorrecta",
                            description: `Escoger una fecha entre ${now.getDate()}/${now.getMonth()}/${now.getFullYear()} y ${now1.getDate()}/${now1.getMonth()}/${now1.getFullYear()}`,
                            action: (
                              <ToastAction altText="Goto schedule to undo">
                                Cerrar
                              </ToastAction>
                            ),
                          }) && setDate(now);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Select
              required
              onValueChange={(value) =>
                setreserva({
                  ...reserva,
                  cantidad: value,
                })
              }
            >
              <SelectTrigger className="h-auto">
                <div className="flex flex-col items-start">
                  <span className="font-semibold uppercase text-[0.65rem]">
                    Cantidad de personas contandose a usted
                  </span>
                  <SelectValue
                    placeholder={<span className="font-normal">2</span>}
                  />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={1}>1 </SelectItem>
                <SelectItem value={2}>2 </SelectItem>
                <SelectItem value={3}>3 </SelectItem>
                <SelectItem value={4}>4 </SelectItem>
                <SelectItem value={5}>5 </SelectItem>
                <SelectItem value={6}>6 </SelectItem>
              </SelectContent>
            </Select>
            <div className="grid gap-4">
              {Array.from({ length: lengtharray }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-gray-200 p-4 dark:bg-gray-700"
                >
                  <div>
                    <div className="font-semibold">
                      {newHorario[date.getDay()]?.apertura.getHours() + index ==
                      12
                        ? 12
                        : (newHorario[date.getDay()]?.apertura.getHours() +
                            index) %
                          12}
                      :00{" "}
                      {(newHorario[date.getDay()]?.apertura.getHours() +
                        index) %
                        24 >=
                      12
                        ? "PM"
                        : "AM"}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Disponible
                    </div>
                  </div>
                  <Button
                    className={
                      reserva.hora ==
                        `${
                          newHorario[date.getDay()]?.apertura.getHours() +
                            index ==
                          12
                            ? 12
                            : (newHorario[date.getDay()]?.apertura.getHours() +
                                index) %
                              12
                        }:00 ${
                          (newHorario[date.getDay()]?.apertura.getHours() +
                            index) %
                            24 >=
                          12
                            ? "PM"
                            : "AM"
                        }` &&
                      "bg-gray-900 text-white hover:bg-gray-800 focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 dark:focus:ring-gray-600"
                    }
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setreserva({
                        ...reserva,
                        hora: `${
                          newHorario[date.getDay()]?.apertura.getHours() +
                            index ==
                          12
                            ? 12
                            : (newHorario[date.getDay()]?.apertura.getHours() +
                                index) %
                              12
                        }:00 ${
                          (newHorario[date.getDay()]?.apertura.getHours() +
                            index) %
                            24 >=
                          12
                            ? "PM"
                            : "AM"
                        }`,
                      })
                    }
                  >
                    Reserve
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button
                className="w-full h-12 bg-gray-900 text-white hover:bg-gray-800 focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 dark:focus:ring-gray-600"
                size="lg"
                onClick={manejarClick}
              >
                Reserve
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function MenuIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function MountainIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}
