// LoadingLazy.js
"use client";

import { AnimatePresence } from "framer-motion";
import Transition from "../VarR/Transition";
import React, { Suspense } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function LoadingLazy({ Component, tienda }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<Loading />}>
        <Transition key={pathname}>
          <Component tienda={tienda} />
        </Transition>
      </Suspense>
    </AnimatePresence>
  );
}

export function Loading() {
  return (
    <div class="absolute right-1/2 bottom-1/2 transform translate-x-1/2 translate-y-1/2">
      <div class="p-4 bg-gradient-to-tr animate-spin from-green-500 to-blue-500 via-purple-500 rounded-full">
        <div class="bg-white rounded-full">
          <div class="w-24 h-24 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
