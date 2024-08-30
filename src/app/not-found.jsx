"use client";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { ThemeContext } from "@/app/layout";
import Image from "next/image";
import Fuse from "fuse.js";

const options = {
  includeScore: true,
  // Ajusta estos valores según tus necesidades
  threshold: 0.4,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: ["name"],
};

export default function NotFound() {
  const [search, setsearch] = useState("");
  const { webshop, setwebshop } = useContext(ThemeContext);
  const [ListSearch, setListSearch] = useState([]);

  useEffect(() => {
    const Aux = webshop.store > 0 ? webshop.store : [];
    const fuse = new Fuse(Aux, options);
    if (search) {
      const results = fuse.search(search);
      setListSearch(results.map((obj) => obj.item));
    } else {
      setListSearch([]);
    }
  }, [webshop.store, search]);

  console.log(webshop);
  return (
    <div className="flex min-h-[100dvh] flex-col items-center bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className=" max-w-md text-center mt-10 flex flex-col items-center">
        <Image
          src=" https://res.cloudinary.com/dbgnyc842/image/upload/v1725047629/Coffe_react/hkusxv4rr56vja2skrwk.png"
          alt="404 Status"
          width={200}
          height={200}
          className="mr-3 rounded-md"
          style={{ aspectRatio: "40/40", objectFit: "cover" }}
        />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          404: ¡Error de navegación!
        </h1>
        <p className="mt-4 text-muted-foreground mb-10">
          Pero no te preocupes, aquí hay un mapa para volver a nuestras mejores
          ofertas.
        </p>
        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          prefetch={false}
        >
          Explorar ahora
        </Link>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Busca tu tienda"
              className="w-full rounded-lg bg-background pl-8 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              value={search}
              onChange={(e) => {
                setsearch(e.target.value);
              }}
            />
            {ListSearch.length > 0 && (
              <div className="absolute top-full left-0 z-10 w-full rounded-lg bg-background shadow-lg">
                <div className="p-4">
                  <h3 className="text-sm font-medium text-foreground">
                    Resultados de búsqueda
                  </h3>
                  <ul className="mt-2 space-y-2">
                    {ListSearch.map((obj, ind) => (
                      <li key={ind}>
                        <Link
                          href={`/${obj.variable}/${obj.sitioweb}`}
                          className="flex items-center rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
                          prefetch={false}
                        >
                          <Image
                            src={
                              obj.urlPoster == ""
                                ? process.env.NEXT_PUBLIC_IMAGE_USER
                                : obj.urlPoster
                                ? obj.urlPoster
                                : process.env.NEXT_PUBLIC_IMAGE_USER
                            }
                            alt={obj.name ? obj.name : "Store"}
                            width={40}
                            height={40}
                            className="mr-3 rounded-md"
                            style={{ aspectRatio: "40/40", objectFit: "cover" }}
                          />
                          <span>{obj.name ? obj.name : "Store"}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchIcon(props) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function TriangleAlertIcon(props) {
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
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}
