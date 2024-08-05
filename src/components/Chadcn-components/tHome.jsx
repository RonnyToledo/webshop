"use client";
import React, { useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBasket } from "lucide-react";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

export default function THome({ tienda, context }) {
  const { store, dispatchStore } = useContext(context);
  const { toast } = useToast();

  const handleShare = async (title, descripcion, url) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: descripcion,
          url: url,
        });
      } catch (error) {
        toast({
          title: "Informacion",
          description: `Error al compartir: ${error}`,
          action: (
            <ToastAction altText="Goto schedule to undo">Cerrar</ToastAction>
          ),
        });
      }
    } else {
      // Fallback para navegadores que no soportan la API de compartir
      toast({
        title: "Informacion",
        description:
          "La API de compartir no está disponible en este navegador.",
        action: (
          <ToastAction altText="Goto schedule to undo">Cerrar</ToastAction>
        ),
      });
    }
  };
  return (
    <main className="p-4 bg-gray-100">
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <Housr horario={store.horario} />

        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">{store.name}</h1>
          <div className="flex items-center space-x-2">
            <ShareIcon
              onClick={() =>
                handleShare(
                  store.name,
                  store.parrafoInfo,
                  `https://rh-menu.vercel.app/t/${params.tienda}/`
                )
              }
              className="w-6 h-6 text-gray-600"
            />
          </div>
        </div>
        <Link href="https://r-and-h.vercel.app">
          <p className="text-gray-500">r-and-h.vercel.app</p>
        </Link>
      </div>
      {store.parrrafo ? (
        <section className="bg-white rounded-lg shadow-md p-2 mb-4">
          <div className="container px-4 md:px-6">
            <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              {store.parrrafo}
            </p>
          </div>
          <div className="pt-10 flex flex-col items-center justify-center">
            <Link
              href={`/${store.variable}/${store.sitioweb}/products`}
              className="bg-gray-800 w-1/3 p-3 rounded-lg flex items-center justify-center text-gray-100"
            >
              <ShoppingBasket className="w-6 h-6 text-gray-100 mr-3" />
              Ofertas
            </Link>
          </div>
        </section>
      ) : (
        <section className="bg-white rounded-lg shadow-md p-2 mb-4">
          <div className="container px-4 md:px-6">
            <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Nos complace tenerte aquí. En nuestro espacio, encontrarás una
              amplia variedad de productos cuidadosamente seleccionados para
              satisfacer todas tus necesidades. Nuestro equipo está comprometido
              a brindarte una experiencia de compra excepcional, donde la
              calidad y el servicio al cliente son nuestra prioridad. Te
              invitamos a explorar nuestras ofertas y descubrir por qué somos la
              opción preferida en la comunidad. ¡Gracias por elegirnos!
            </p>
          </div>
          <div className="pt-10 flex flex-col items-center justify-center">
            <Link
              href={`/${store.variable}/${store.sitioweb}/products`}
              className="bg-gray-800 w-1/3 p-3 rounded-lg flex items-center justify-center text-gray-100"
            >
              <ShoppingBasket className="w-6 h-6 text-gray-100 mr-3" />
              Ofertas
            </Link>
          </div>
        </section>
      )}
      {/* <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container grid md:grid-cols-2 gap-8 px-4 md:px-6">
            <div className="flex flex-col items-start justify-center space-y-4">
              <div className="inline-block rounded-lg bg-gray-200 px-3 py-1 text-sm font-medium dark:bg-gray-700 dark:text-gray-300">
                Upcoming Events
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Join Us for Exciting Events
              </h2>
              <p className="max-w-[500px] text-gray-500 md:text-xl dark:text-gray-400">
                Check out our upcoming events and be a part of the Acme
                community.
              </p>
              <Button className="mt-4" variant="link">
                View Events
              </Button>
            </div>
            <div className="flex justify-center">
              <Image
                alt="Acme Events"
                className="aspect-square object-cover rounded-lg"
                height={500}
                src="/placeholder.svg"
                width={500}
              />
            </div>
          </div>
        </section>*/}
      {store.products.filter((ele) => ele.favorito && !ele.agotado).length >=
        0 && (
        <section className="w-full py-6 md:py-24 lg:py-32 bg-white rounded-lg shadow-md p-2 mb-4">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl px-4">
            Algunas Ofertas
          </h2>
          <div className="container grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 px-4 md:px-6">
            {store.products
              .filter((ele) => ele.favorito && !ele.agotado)
              .map(
                (obj, index) =>
                  index <= 4 && (
                    <div
                      className="mt-5 flex flex-col items-start justify-center space-y-4"
                      key={index}
                    >
                      <Image
                        alt={obj.title ? obj.title : "Titulo"}
                        className="aspect-square object-cover rounded-lg"
                        height={300}
                        src={
                          obj.image
                            ? obj.image
                            : "https://res.cloudinary.com/dbgnyc842/image/upload/v1721753647/kiphxzqvoa66wisrc1qf.jpg"
                        }
                        width={300}
                      />
                      <div className="inline-block rounded-lg bg-gray-200 px-3 py-1 text-xs sm:text-sm font-medium dark:bg-gray-700 dark:text-gray-300">
                        Oferta Especial
                      </div>
                      {/*<div className="inline-block rounded-lg bg-gray-200 px-3 py-1 text-sm font-medium dark:bg-gray-700 dark:text-gray-300">
                      {store.category
                        .filter((cat) => cat === obj.categoria)
                        .map((cat) => cat)}
                    </div>*/}
                      <h3 className="text-xl font-bold tracking-tighter">
                        {obj.title}
                      </h3>
                      <p className="line-clamp-2 overflow-hidden h-14 sm:h-16 text-gray-500 text-xs sm:text-base dark:text-gray-400">
                        {obj.descripcion}
                      </p>
                    </div>
                  )
              )}
          </div>
          <div className="pt-10 flex flex-col items-center justify-center ">
            <Link
              href={`/${store.variable}/${store.sitioweb}/products`}
              className="bg-gray-800 w-1/3 p-3 rounded-lg flex items-center justify-center text-gray-100"
            >
              Ver Mas
            </Link>
          </div>
        </section>
      )}
      <section className="w-full py-6 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800 bg-white rounded-lg shadow-md p-2 mb-4">
        <div className="container grid md:grid-cols-2 gap-8 px-4 md:px-6">
          <div className="flex flex-col items-start justify-center space-y-4">
            <div className="inline-block rounded-lg bg-gray-200 px-3 py-1 text-sm font-medium dark:bg-gray-700 dark:text-gray-300">
              {"Sobre " + store.name}
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Nuestra Collecion
            </h2>
            <p className="max-w-[500px] text-gray-500 md:text-xl dark:text-gray-400">
              Explore nuestra amplia gama de productos de alta calidad,
              cuidadosamente seleccionados para satisfacer sus necesidades.
            </p>
            <Link
              className="text-sm font-medium hover:underline underline-offset-4 text-gray-400 hover:text-gray-50"
              href={`/${store.variable}/${store.sitioweb}/products`}
            >
              Explorar Productos
            </Link>
          </div>
          <div className="flex justify-center">
            <Image
              alt={store.name}
              className="aspect-square object-cover rounded-lg"
              height={500}
              src={
                store.urlPoster
                  ? store.urlPoster
                  : "https://res.cloudinary.com/dbgnyc842/image/upload/v1721753647/kiphxzqvoa66wisrc1qf.jpg"
              }
              width={500}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
function Housr({ horario }) {
  const now = new Date();
  const newHorario = horario.map((obj, index) => {
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
  console.log(newHorario);
  function isOpen() {
    if (newHorario[0]?.apertura <= now && newHorario[0]?.cierre > now) {
      return true;
    } else if (newHorario[1]?.apertura <= now && newHorario[1]?.cierre > now) {
      return true;
    } else if (newHorario[2]?.apertura <= now && newHorario[2]?.cierre > now) {
      return true;
    } else if (newHorario[3]?.apertura <= now && newHorario[3]?.cierre > now) {
      return true;
    } else if (newHorario[4]?.apertura <= now && newHorario[4]?.cierre > now) {
      return true;
    } else if (newHorario[5]?.apertura <= now && newHorario[5]?.cierre > now) {
      return true;
    } else if (newHorario[6]?.apertura <= now && newHorario[6]?.cierre > now) {
      return true;
    } else {
      return false; // Está cerrado
    }
  }
  console.log(isOpen());
  const valor1 = isOpen()
    ? newHorario[now.getDay()]?.cierre.getHours() >= 0
      ? newHorario[now.getDay()]?.cierre.getHours() + 24 - now.getHours() - 1
      : newHorario[now.getDay()]?.cierre.getHours() - now.getHours() - 1
    : newHorario[now.getDay()]?.apertura.getHours() - now.getHours() - 1;
  const valor2 = 60 - now.getMinutes();
  return (
    <div className="flex items-center space-x-2 mb-2">
      <Badge variant={!isOpen() && "destructive"}>
        {isOpen() ? "ABIERTO" : "CERRADO"}
      </Badge>
      <p className="text-gray-500">
        {isOpen()
          ? `Cierra en ${valor1 != 0 ? `${valor1}h y` : ""} ${valor2}m`
          : `Abre en ${valor1 != 0 ? `${valor1}h y` : ""} ${valor2}m`}
      </p>
    </div>
  );
}

function ChevronDownIcon(props) {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
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

function Package2Icon(props) {
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
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
      <path d="M12 3v6" />
    </svg>
  );
}
function ShareIcon(props) {
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
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" x2="12" y1="2" y2="15" />
    </svg>
  );
}
