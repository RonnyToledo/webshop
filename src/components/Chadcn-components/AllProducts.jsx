"use client";
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import MapProducts from "./MapProducts";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { LayoutList, ChevronsRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AllProducts({ context }) {
  const [ShotScroll, setShotScroll] = useState("");
  const [category, setcategory] = useState([]);
  const { store, dispatchStore } = useContext(context);

  const [isOpen, setIsOpen] = useState(false);
  const openDrawer = () => setIsOpen(true);
  const closeDrawer = () => setIsOpen(false);

  useEffect(() => {
    setcategory(ExtraerCategoria(store, store.products));
  }, [store]);

  const pause = (duration) => {
    return new Promise((resolve) => {
      setTimeout(resolve, duration);
    });
  };
  useEffect(() => {
    async function Load() {
      const element = document.getElementById(ShotScroll);
      if (element) {
        await pause(500);
        element.scrollIntoViewIfNeeded({ behavior: "smooth" });
      }
    }
    Load();
  }, [ShotScroll]);

  return (
    <>
      {category.map((cat, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md p-1 mb-4"
          id={cat.split(" ").join("_")}
        >
          <h3 className="flex items-center justify-between sticky top-16 z-[5]  bg-background ">
            <Button
              onClick={openDrawer}
              variant="ghost"
              className="text-xl font-bold mb-4 p-4 flex justify-between items-center w-full"
            >
              {cat}
              <LayoutList className="h-5 w-5" />
            </Button>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
            {store.products
              .filter((prod) => prod.caja === cat)
              .map((prod, ind) => (
                <MapProducts
                  key={ind}
                  prod={prod}
                  store={store}
                  dispatchStore={dispatchStore}
                />
              ))}
          </div>
        </div>
      ))}
      {store.products.filter((obj) => !store.categoria.includes(obj.caja))
        .length >= 1 && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <h3 className="sticky top-16 z-[5] bg-background text-xl font-bold mb-4">
            Otras Ofertas
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
            {products
              .filter((obj) => !store.categoria.includes(obj.caja))
              .map((prod, ind) => (
                <MapProducts
                  key={ind}
                  prod={prod}
                  store={store}
                  dispatchStore={dispatchStore}
                />
              ))}
          </div>
        </div>
      )}
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="p-2">Listado de Categorias</DrawerTitle>
            <DrawerDescription>
              <ScrollArea className="h-72 w-full rounded-md border">
                <div className="p-4">
                  {category.map((cat, index) => (
                    <div key={index}>
                      <Button
                        variant="ghost"
                        className="flex items-center justify-between w-full p-2 text-sm font-bold"
                        onClick={() => {
                          closeDrawer();
                          setShotScroll(cat.split(" ").join("_"));
                        }}
                      >
                        {cat}
                        <ChevronsRight className="h-5 w-5" />
                      </Button>
                      <Separator className="my-2" />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    </>
  );
}
function ExtraerCategoria(data, products) {
  const categoriaProducts = [...new Set(products.map((prod) => prod.caja))];

  const newCat = data.categoria.filter((prod) =>
    categoriaProducts.includes(prod)
  );
  return newCat;
}
function HanPasadoSieteDias({ fecha }) {
  // Convertir la fecha de entrada a un objeto Date
  const fechaEntrada = new Date(fecha);

  // Obtener la fecha actual
  const fechaActual = new Date();

  // Calcular la diferencia en milisegundos
  const diferenciaEnMilisegundos = fechaActual - fechaEntrada;

  // Convertir la diferencia a días
  const diferenciaEnDias = diferenciaEnMilisegundos / (1000 * 60 * 60 * 24);

  // Verificar si han pasado 7 días
  return (
    <div className="absolute" style={{ top: "5px", right: "5px" }}>
      {diferenciaEnDias <= 7 && (
        <h2 className="bg-gray-800 text-gray-100 rounded-lg p-1 text-xs">
          New
        </h2>
      )}
    </div>
  );
}
