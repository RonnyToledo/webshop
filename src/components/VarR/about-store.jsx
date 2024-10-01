"use client";

import Image from "next/image";
import {
  ArrowLeft,
  Store,
  Users,
  Package,
  Truck,
  Mail,
  Phone,
  ShoppingBag,
  Star,
  Clock,
  CreditCard,
} from "lucide-react";
import { useState, useEffect, useContext } from "react";
import { MyContext } from "@/context/MyContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function AboutStoreComponent() {
  const { store, dispatchStore } = useContext(MyContext);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow p-4 space-y-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm text-center">
          <Image
            src={
              store.urlPoster ||
              "https://res.cloudinary.com/dbgnyc842/image/upload/v1725399957/xmlctujxukncr5eurliu.png"
            }
            alt={store.name || "Shoes background"}
            width={200}
            height={200}
            className="rounded-full mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold mb-2">{store.name}</h2>
          <p className="text-blue-600 font-semibold mb-4">{store.tipo}</p>
          <p className="text-gray-600 mb-4">{store.parrafo}</p>
        </div>

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
          <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
          {store.email && (
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-blue-600" />
              <span>{store.email}</span>
            </div>
          )}
          {store.cell && (
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-blue-600" />
              <span>+53 {store.cell}</span>
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold mb-2">Customer Reviews</h3>
          <div className="space-y-4">
            {store.comentario.map((review, index) => (
              <div key={index} className="flex items-start space-x-4">
                <Avatar>
                  <AvatarFallback>{review.name}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-semibold">{review.name}</h4>
                  <div className="flex items-center">
                    {[...Array(review.star)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.star
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{review.cmt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold mb-2">Horarios de Trabajo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {store.horario.map((hor, ind) => (
              <div key={ind} className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="font-medium">{hor.dia}</p>
                  <div>
                    <p className="text-sm text-gray-600">
                      {hor.apertura == 0 && hor.cierre == 24
                        ? "Abierto 24 horas"
                        : hor.apertura == hor.cierre
                        ? "Cerrado"
                        : hor.apertura + ":00 - " + hor.cierre + ":00"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
