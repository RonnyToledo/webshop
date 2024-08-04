import React from "react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="space-y-4 text-center">
        <div className="text-3xl font-bold">Cargando</div>
        <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 bg-gray-500 rounded-full animate-bounce" />
          <div className="w-4 h-4 bg-gray-500 rounded-full animate-bounce animation-delay-100" />
          <div className="w-4 h-4 bg-gray-500 rounded-full animate-bounce animation-delay-200" />
        </div>
      </div>
    </div>
  );
}
