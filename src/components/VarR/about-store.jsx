"use client";
import { Map, Marker } from "pigeon-maps";
import Image from "next/image";
import {
  Users,
  Truck,
  ShoppingBag,
  Star,
  Clock,
  CreditCard,
} from "lucide-react";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import React, { lazy, useState, useContext } from "react";
import { MyContext } from "@/context/MyContext";
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { Promedio } from "../globalFunctions/function";
import { RatingModal } from "./Details-Coment/rating-modal";
import Link from "next/link";

// Lazy Loading de los componentes
const YourSliderComponent = lazy(() => import("./SliderComponent"));

export function AboutStoreComponent() {
  const { store, dispatchStore } = useContext(MyContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [nombre, setnombre] = useState("");

  const handleStarClick = (rating) => {
    setSelectedRating(rating);
    setIsModalOpen(true);
  };
  const handleSubmit = async (e) => {
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
        toast({
          title: "Tarea Ejecutada",
          description: "Informacion Actualizada",
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
        description: "No se pudo editar las categorias.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow space-y-8">
        <div className="bg-white shadow-sm text-center">
          <div
            className="h-48 bg-gradient-to-br from-rose-200 to-rose-300"
            style={{
              width: "100%",
              backgroundImage: `url(${
                store.banner ||
                store.urlPoster ||
                "https://res.cloudinary.com/dbgnyc842/image/upload/v1725399957/xmlctujxukncr5eurliu.png"
              })`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          />

          {/* Profile Content */}
          <div className="absolute left-1/2 -translate-x-1/2 -translate-y-3/4 flex flex-col items-center">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-full bg-white p-1 shadow-lg">
              <div className="w-full h-full rounded-full bg-rose-100 flex items-center justify-center overflow-hidden">
                <Image
                  src={
                    store.urlPoster ||
                    "https://res.cloudinary.com/dbgnyc842/image/upload/v1725399957/xmlctujxukncr5eurliu.png"
                  }
                  alt={store.name || "Shoes background"}
                  width={300}
                  height={300}
                  className="rounded-full h-36 w-36 object-cover mx-auto"
                />
              </div>
            </div>
          </div>

          <div className=" rounded-3xl p-6 shadow-sm text-center mt-5">
            <h2 className="text-2xl font-bold mb-2">{store.name}</h2>
            <p className="text-blue-600 font-semibold mb-4">{store.tipo}</p>
            <p className="text-gray-600 mb-4">{store.parrafo}</p>
          </div>
        </div>
        <div className="p-2 space-y-4">
          <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-semibold mb-2">Sobre nosotros</h3>
            <div className="grid grid-cols-2 gap-4">
              {store.reservas && (
                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-xl">
                  <ShoppingBag className="h-8 w-8 text-blue-600 mb-2" />
                  <span className="text-sm font-medium text-center">
                    Reservacion
                  </span>
                </div>
              )}
              <div className="flex flex-col items-center p-3 bg-gray-50 rounded-xl">
                <Users className="h-8 w-8 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-center">
                  Gran alcance
                </span>
              </div>
              {store.act_tf && (
                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-xl">
                  <CreditCard className="h-8 w-8 text-blue-600 mb-2" />
                  <span className="text-sm font-medium text-center">
                    Pago en transferencia
                  </span>
                </div>
              )}
              {store.domicilio && (
                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-xl">
                  <Truck className="h-8 w-8 text-blue-600 mb-2" />
                  <span className="text-sm font-medium text-center">
                    Domicilio Rapido
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-semibold mb-2">Horarios de Trabajo</h3>
            <div className="grid grid-cols-1  gap-4">
              <HorarioGrupo horario={store.horario} />
            </div>
          </div>
          {store.ubicacion && (
            <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-semibold mb-2">Ubicacion</h3>
              <Map
                height={300}
                defaultCenter={[
                  store.ubicacion.latitude,
                  store.ubicacion.longitude,
                ]}
                mouseEvents={false}
                touchEvents={false}
                defaultZoom={15}
              >
                <Marker
                  width={50}
                  anchor={[store.ubicacion.latitude, store.ubicacion.longitude]}
                />
              </Map>
              <div>
                <div className="flex items-center space-x-3 font-bold text-sm">
                  <span>{store.direccion}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700 text-xs">
                  <span>
                    {store.Provincia &&
                      ` ${store.municipio ? `${store.municipio},` : ""}${
                        store.Provincia
                      }`}
                  </span>
                </div>
              </div>
            </div>
          )}
          {(store.email || store.cell) && (
            <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
              {store.email && (
                <Link
                  href={`mailto:${store.email}`}
                  className="flex items-center space-x-3 text-sm"
                >
                  <AlternateEmailIcon className="h-5 w-5 text-blue-600" />
                  <span>{store.email}</span>
                </Link>
              )}
              {store.cell && (
                <Link
                  href={`https://wa.me/${store.cell}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-sm"
                >
                  <WhatsAppIcon className="h-5 w-5 text-blue-600" />
                  <span>+{store.cell}</span>
                </Link>
              )}
            </div>
          )}
          {/* Bloque con Lazy Loading */}

          <div className="max-w-xl mx-auto p-6 bg-white rounded-3xl shadow-sm space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg ">Calificaciones y opiniones</h2>
            </div>

            <p className="text-gray-500 mb-6 text-sm">
              Las calificaciones y opiniones provienen de personas que usan el
              mismo tipo de dispositivo que tú.
            </p>
            <div>
              <div className="flex items-center gap-8 mb-8">
                <div>
                  <div className="text-6xl font-light">
                    {Number(Promedio(store.comentTienda, "star")).toFixed(1)}
                  </div>
                  <div className="flex gap-1 my-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Number(store.comentTienda.promedio)
                            ? "fill-yellow-600 text-yellow-600"
                            : "text-yellow-600"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-gray-600">
                    {Number(store.comentTienda.total).toLocaleString()}
                  </div>
                </div>

                <div className="flex-1">
                  {[5, 4, 3, 2, 1].map((item) => (
                    <div key={item} className="flex items-center gap-2 mb-1">
                      <span className="w-3">{item}</span>
                      <div className="flex-1 h-2 bg-gray-400 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-400"
                          style={{
                            width: `${
                              (store.comentTienda?.data.filter(
                                (obj) => obj.star == item
                              ).length *
                                100) /
                                store.comentTienda?.total || 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Button asChild variant="ghost">
                <Link
                  href={`/t/${store.sitioweb}/about/coments`}
                  className="w-full flex justify-between"
                >
                  <h2 className="text-lg ">Todos los comentarios</h2>
                  <div className="text-lg">→</div>
                </Link>
              </Button>
            </div>

            <div className="border-t border-gray-800 pt-6">
              <h3 className="text-xl mb-2">Califica esta tienda online</h3>
              <p className="text-gray-400 mb-4">
                Comparte tu opinión con otros usuarios
              </p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleStarClick(rating)}
                    className="hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-12 h-12 ${
                        rating <= selectedRating
                          ? "fill-blue-600 text-blue-600"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <RatingModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            selectedRating={selectedRating}
            setSelectedRating={setSelectedRating}
            userName="Usuario"
            description={description}
            setDescription={setDescription}
            setnombre={setnombre}
            nombre={nombre}
            loading={loading}
            handleSubmit={handleSubmit}
          />
        </div>
      </main>
    </div>
  );
}

const HorarioGrupo = ({ horario }) => {
  // Lógica para agrupar horarios consecutivos
  const agruparHorarios = (horarios) => {
    const groupedHorarios = [];
    let currentGroup = {
      dias: [horarios[0].dia],
      apertura: horarios[0].apertura,
      cierre: horarios[0].cierre,
    };

    for (let i = 1; i < horarios.length; i++) {
      const hor = horarios[i];
      const prev = horarios[i - 1];

      if (hor.apertura === prev.apertura && hor.cierre === prev.cierre) {
        currentGroup.dias.push(hor.dia);
      } else {
        groupedHorarios.push(currentGroup);
        currentGroup = {
          dias: [hor.dia],
          apertura: hor.apertura,
          cierre: hor.cierre,
        };
      }
    }
    groupedHorarios.push(currentGroup);
    return groupedHorarios;
  };

  const groupedHorarios = agruparHorarios(horario);
  console.log(groupedHorarios);
  // Renderizado del componente
  return (
    <div className="space-y-4">
      {groupedHorarios.map((group, ind) => (
        <div key={ind} className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-blue-600" />
          <div>
            <p className="font-medium">
              {group.dias.length > 1
                ? `De ${group.dias[0]} a ${group.dias[group.dias.length - 1]}`
                : group.dias[0]}
            </p>
            <p className="text-sm text-gray-600">
              {group.apertura === 0 && group.cierre === 24
                ? "Abierto 24 horas"
                : group.apertura === group.cierre
                ? "Cerrado"
                : `${group.apertura}:00 - ${group.cierre}:00`}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
