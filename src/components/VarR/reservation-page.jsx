"use client";
import { useState, useContext } from "react";
import { Calendar, Clock, Search, User } from "lucide-react";
import { format, addDays, startOfWeek, getDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { Label } from "../ui/label";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { MyContext } from "@/context/MyContext";
import { generateSchedule } from "../globalFunctions/function";
import { Textarea } from "../ui/textarea";

const popularReservations = [];

export function ReservationPageComponent() {
  const now = new Date();
  const { store } = useContext(MyContext);
  const [reserva, setReserva] = useState({
    cantidad: 2,
    dia: `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`,
    hora: "",
    nombre: "",
    message: "",
  });
  const [date, setDate] = useState(now);
  const { toast } = useToast();

  const now1 = new Date();
  now1.setMonth(now.getMonth() + 1);

  const newHorario = generateSchedule(store.horario);

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

  let mensaje =
    `Hola, Quiero realizar esta reserva:\n` +
    `- A nombre de: ${reserva.nombre}\n` +
    `- Para: ${reserva.cantidad} persona(s)\n` +
    `- Día: ${reserva.dia}\n` +
    `- Hora: ${reserva.hora}\n`;
  if (reserva.message) {
    mensaje += `- Extra: ${reserva.message}\n`;
  }
  mensaje += `Espero su confirmación\n`;

  const mensajeCodificado = encodeURIComponent(mensaje);
  const urlWhatsApp = `https://wa.me/53${store.cell}?text=${mensajeCodificado}`;

  const handleClick = () => {
    window.open(urlWhatsApp, "_blank");
  };

  return (
    <div className="container mx-auto p-4 mt-16">
      <Card className="mb-8">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <Label
                htmlFor="nombre"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nombre
              </Label>
              <div className="relative">
                <Input
                  id="nombre"
                  type="text"
                  placeholder="A nombre de quien la reserva"
                  value={reserva.nombre}
                  onChange={
                    (e) => setReserva({ ...reserva, nombre: e.target.value }) // Reset time when date changes
                  }
                />
              </div>
            </div>
            <div className="flex-grow">
              <Label className="block text-sm font-medium text-gray-700 mb-1">
                Elige el dia{" "}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Elige el dia</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => {
                      handleDateChange(newDate);
                      setReserva({ ...reserva, hora: undefined }); // Reset time when date changes
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex-grow">
              <Label className="block text-sm font-medium text-gray-700 mb-1">
                Hora{` ${lengthArray == 0 ? "(Dia no dsponible)" : ""}`}
              </Label>
              <Select
                value={reserva.hora}
                onValueChange={(value) =>
                  setReserva({ ...reserva, hora: value })
                }
                disabled={lengthArray == 0}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select time">
                    {reserva.hora ? (
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        {reserva.hora}
                      </div>
                    ) : (
                      "Select time"
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: lengthArray }).map((_, index) => {
                    const hour =
                      (newHorario[date.getDay()]?.apertura.getHours() + index) %
                      24;
                    const displayHour = hour === 0 ? 12 : hour % 12;
                    const period = hour >= 12 ? "PM" : "AM";
                    const formattedHour = `${displayHour}:00 ${period}`;
                    return (
                      <SelectItem key={index} value={formattedHour}>
                        {formattedHour}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-grow">
              <Label className="block text-sm font-medium text-gray-700 mb-1">
                Personas
              </Label>
              <Select
                value={reserva.cantidad}
                onValueChange={(value) =>
                  setReserva({ ...reserva, cantidad: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select guests" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 8 }).map((_, index) => (
                    <SelectItem key={index} value={index + 1}>
                      {`${index + 1} Persona${index + 1 > 1 ? "s" : ""}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-grow">
              <Label
                htmlFor="extra"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Algo q agregar
              </Label>
              <div className="relative">
                <Textarea
                  id="extra"
                  type="text"
                  value={reserva.message}
                  onChange={(e) =>
                    setReserva({ ...reserva, message: e.target.value })
                  }
                  className="pl-10"
                />
              </div>
            </div>
            <Button className="w-full md:w-auto" onClick={handleClick}>
              Enviar
            </Button>
          </div>
        </CardContent>
      </Card>
      <h2 className="text-xl font-semibold mb-4">Popular Reservations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {popularReservations.map((reservation) => (
          <Card key={reservation.id}>
            <CardContent className="p-4">
              <Image
                src={reservation.image}
                alt={reservation.name}
                className="w-full h-40 object-cover mb-4 rounded"
                width={200}
                height={200}
              />
              <h3 className="font-semibold">{reservation.name}</h3>
              <p className="text-sm text-gray-600">
                ${reservation.price} per night
              </p>
              <div className="flex items-center mt-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(reservation.rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-sm ml-1">
                  {reservation.rating.toFixed(1)}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
