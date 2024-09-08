"use client";
import React, { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
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
import { MyContext } from "@/context/MyContext";

export default function ReservationPage() {
  const now = new Date();
  const { store } = useContext(MyContext);
  const [reserva, setReserva] = useState({
    cantidad: 2,
    dia: `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`,
    hora: "",
    nombre: "",
  });
  const [date, setDate] = useState(now);
  const { toast } = useToast();

  const now1 = new Date();
  now1.setMonth(now.getMonth() + 1);

  const newHorario = store.horario.map((obj, index) => {
    const apertura = new Date(now);
    const cierre = new Date(now);

    apertura.setDate(now.getDate() + index - now.getDay());
    apertura.setHours(obj.apertura, 0, 0, 0);

    cierre.setDate(now.getDate() + index - now.getDay());
    if (obj.apertura >= obj.cierre) {
      cierre.setDate(cierre.getDate() + 1);
    }
    cierre.setHours(obj.cierre, 0, 0, 0);

    return {
      dia: obj.dia,
      apertura,
      cierre,
    };
  });

  const lengthArray =
    (newHorario[date.getDay()]?.cierre.getTime() -
      newHorario[date.getDay()]?.apertura.getTime()) /
    (1000 * 60 * 60);

  const handleDateChange = (value) => {
    if (value >= now && value <= now1) {
      setDate(value);
      setReserva((prev) => ({
        ...prev,
        dia: `${value.getDate()}/${
          value.getMonth() + 1
        }/${value.getFullYear()}`,
      }));
    } else {
      toast({
        title: "Fecha incorrecta",
        description: `Escoge una fecha entre ${now.getDate()}/${
          now.getMonth() + 1
        }/${now.getFullYear()} y ${now1.getDate()}/${
          now1.getMonth() + 1
        }/${now1.getFullYear()}`,
        action: <ToastAction altText="Cerrar">Cerrar</ToastAction>,
      });
      setDate(now);
    }
  };

  const mensaje =
    `Hola, Quiero realizar esta reserva:\n` +
    `- A nombre de: ${reserva.nombre}\n` +
    `- Para: ${reserva.cantidad} persona(s)\n` +
    `- Día: ${reserva.dia}\n` +
    `- Hora: ${reserva.hora}\n` +
    `Espero su confirmación\n`;

  const mensajeCodificado = encodeURIComponent(mensaje);
  const urlWhatsApp = `https://wa.me/53${store.cell}?text=${mensajeCodificado}`;

  const handleClick = () => {
    window.open(urlWhatsApp, "_blank");
  };

  return (
    <div className="grid min-h-screen w-full overflow-hidden lg:grid-cols-[280px_1fr]">
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <div className="mx-auto w-full max-w-sm space-y-2">
            <div className="flex flex-col gap-2">
              <label
                className="font-semibold uppercase text-[0.65rem]"
                htmlFor="name"
              >
                A nombre de quién
              </label>
              <Input
                className="w-full"
                id="name"
                placeholder="Nombre y Apellidos"
                type="text"
                required
                onChange={(e) =>
                  setReserva({ ...reserva, nombre: e.target.value })
                }
              />
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
                      {date.getDate()}/{date.getMonth() + 1}/
                      {date.getFullYear()}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 max-w-[276px]">
                  <Calendar
                    mode="single"
                    selected={date}
                    required
                    onSelect={handleDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Select
              required
              onValueChange={(value) =>
                setReserva({ ...reserva, cantidad: value })
              }
            >
              <SelectTrigger className="h-auto">
                <div className="flex flex-col items-start">
                  <span className="font-semibold uppercase text-[0.65rem]">
                    Cantidad de personas contando a usted
                  </span>
                  <SelectValue placeholder="2" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <SelectItem key={n} value={n}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="grid gap-4">
              {Array.from({ length: lengthArray }).map((_, index) => {
                const hour =
                  (newHorario[date.getDay()]?.apertura.getHours() + index) % 24;
                const displayHour = hour === 0 ? 12 : hour % 12;
                const period = hour >= 12 ? "PM" : "AM";
                const formattedHour = `${displayHour}:00 ${period}`;
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg bg-gray-200 p-4 dark:bg-gray-700"
                  >
                    <div>
                      <div className="font-semibold">{formattedHour}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Disponible
                      </div>
                    </div>
                    <Button
                      className={
                        reserva.hora === formattedHour
                          ? "bg-primary text-white hover:bg-gray-800 focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 dark:focus:ring-gray-600"
                          : ""
                      }
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setReserva({ ...reserva, hora: formattedHour })
                      }
                    >
                      Reserve
                    </Button>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button
                className="w-full h-12 bg-primary text-white hover:bg-gray-800 focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 dark:focus:ring-gray-600"
                size="lg"
                onClick={handleClick}
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
