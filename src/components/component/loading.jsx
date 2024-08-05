"use client";
import React from "react";
import { Progress } from "../ui/progress";

export function Loading({ loading }) {
  return (
    <div className="absolute h-full w-full flex flex-col items-center justify-center h-screen bg-background z-[200]">
      <div className=" w-full max-w-md">
        <div className="flex flex-col items-center space-y-4 px-6">
          <h2 className="text-2xl font-bold ">Cargando...</h2>
          <Progress value={loading} />

          <p className="text-muted-foreground">
            Cargando productos, por favor espere...
          </p>
        </div>
      </div>
    </div>
  );
}
