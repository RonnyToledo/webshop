"use client";
import Link from "next/link";
import React, { useContext } from "react";
import { MyContext } from "@/context/MyContext";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { HandCoins, MapPin, Phone, Mail } from "lucide-react";
import { Button } from "../ui/button";
import Housr from "./Horas";

export default function Footer() {
  const { store, dispatchStore } = useContext(MyContext);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1  gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-4">
              Acerca de {store.name}
            </h4>
            <p className="text-gray-400 line-clamp-6">
              <Housr />
            </p>

            <p className="text-gray-400 line-clamp-6">{store.parrrafo}</p>
          </div>
          <div className="grid grid-cols-2">
            <div>
              <h4 className="text-lg font-semibold mb-4">Enlaces rápidos</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href={`${store.variable}/${store.sitioweb}/about`}
                    className="text-gray-400 hover:text-white"
                  >
                    Sobre {store.name}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`${store.variable}/${store.sitioweb}/search`}
                    className="text-gray-400 hover:text-white"
                  >
                    Busqueda
                  </Link>
                </li>
                {store.reservas && (
                  <li>
                    <Link
                      href={`${store.variable}/${store.sitioweb}/search`}
                      className="text-gray-400 hover:text-white"
                    >
                      Reservaciones
                    </Link>
                  </li>
                )}
              </ul>
            </div>
            <div className="flex justify-end">
              <div>
                <h4 className="text-lg font-semibold mb-4">Moneda</h4>
                <NavigationMenu view="top-full">
                  <NavigationMenuList>
                    <CurrencySelector
                      store={store}
                      dispatchStore={dispatchStore}
                    />
                  </NavigationMenuList>
                </NavigationMenu>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Síguenos</h4>
            <div className="flex space-x-4">
              <Link
                href={store.insta}
                className="text-gray-400 hover:text-white"
              >
                <span className="sr-only">Instagram</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
          {(store.ubicacion || store.cell || store.email) && (
            <div className="mt-12 pt-8 border-t border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {store.ubicacion && (
                  <Link
                    href="https://maps.app.goo.gl/PcbK2YJmZe7ZF4s4A"
                    target="_blank"
                    className="flex items-center justify-center md:justify-start text-gray-300"
                  >
                    <MapPin className="h-5 w-5 mr-2" />
                    {store.municipio && store.Provincia ? (
                      <span>{`${store.municipio || ""}, ${
                        store.Provincia || ""
                      }`}</span>
                    ) : (
                      <span>Encuentranos</span>
                    )}
                  </Link>
                )}
                {store.cell && (
                  <Link
                    href={`https://wa.me/${store.cell}`}
                    className="flex items-center justify-center md:justify-end text-gray-300"
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    <span>+{store.cell}</span>
                  </Link>
                )}
                {store.email && (
                  <Link
                    href={`mailto:${store.email}?subject=Consulta&body=Hola, tengo una consulta sobre...`}
                    className="flex items-center justify-center md:justify-end text-gray-300"
                  >
                    <Mail className="h-5 w-5 mr-2" />
                    <span>{store.email}</span>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center">
          <p className="text-gray-400">
            &copy; {currentYear} {store.name}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
function CurrencySelector({ store, dispatchStore }) {
  return (
    <>
      {store.moneda.length > 1 ? (
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <HandCoins className="h-5 w-5" />
            {store.moneda_default.moneda}
          </NavigationMenuTrigger>
          <NavigationMenuContent className="w-[100px]">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <div className="grid max-w-max gap-4 ">
                {store.moneda.map(
                  (mon, ind) =>
                    mon.valor > 0 && (
                      <Button
                        key={ind}
                        className="w-16"
                        onClick={() => {
                          const selectedMoneda = store.moneda.find(
                            (obj) => obj.moneda === mon.moneda
                          );
                          dispatchStore({
                            type: "ChangeCurrent",
                            payload: JSON.stringify(selectedMoneda),
                          });
                        }}
                      >
                        {mon.moneda}
                      </Button>
                    )
                )}
              </div>
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      ) : (
        <></>
      )}
    </>
  );
}
