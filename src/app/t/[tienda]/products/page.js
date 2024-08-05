"use client";
import React from "react";
import AllProducts from "@/components/Chadcn-components/AllProducts";
import { context } from "@/app/t/[tienda]/layout";

export default function usePage() {
  return (
    <div key="1" className="bg-gray-100 p-4">
      <AllProducts context={context} />
    </div>
  );
}
