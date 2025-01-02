"use client";

import { useState, useContext, useRef } from "react";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import RatingSection from "./Details-Coment/rating-section";
import { MyContext } from "@/context/MyContext";
import { ButtonOfCart } from "../globalFunctions/components";
import { ProductGrid } from "./allProduct";
import RemoveShoppingCartOutlinedIcon from "@mui/icons-material/RemoveShoppingCartOutlined";
import { useSearchParams } from "next/navigation";

export function ProductDetailComponent({ specific }) {
  const router = useRouter();
  const { store } = useContext(MyContext);
  const [isAnimating, setIsAnimating] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const searchParams = useSearchParams();
  const swipeDirection = searchParams.get("direction") || "next";

  const handleSwipeStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleSwipeEnd = (e) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(deltaX) > 65 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) navigateToProduct("previous");
      else navigateToProduct("next");
    }
  };

  const navigateToProduct = (direction) => {
    if (isAnimating) return; // Evitar animaciones simultáneas
    setIsAnimating(true);

    const currentIndex = store.products.findIndex(
      (p) => p.productId === specific
    );
    const newIndex =
      direction === "next"
        ? (currentIndex + 1) % store.products.length
        : (currentIndex - 1 + store.products.length) % store.products.length;

    const newProductId = store.products[newIndex].productId;

    // Pasar la dirección como estado al router
    const path = `/${store.variable || ""}/${store.sitioweb || ""}/products/${
      newProductId || ""
    }?direction=${direction}`;

    if (path.includes("undefined")) {
      console.error("Path generado contiene valores no válidos:", path);
      return; // Detén la ejecución si hay valores inválidos
    }
    router.push(path);
  };

  const product = store.products.find((p) => p.productId === specific);
  if (!product) {
    notFound();
  }

  return (
    <div className="bg-gray-100">
      <AnimatePresence>
        <div
          className="relative rounded-b-2xl overflow-hidden"
          onTouchStart={handleSwipeStart}
          onTouchEnd={handleSwipeEnd}
        >
          <motion.div
            key={product.productId} // Necesario para que Framer Motion detecte cambios
            initial={{ opacity: 0, x: swipeDirection === "next" ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: swipeDirection === "next" ? -100 : 100 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src={
                product.image ||
                store.urlPoster ||
                "https://res.cloudinary.com/dbgnyc842/image/upload/v1725399957/xmlctujxukncr5eurliu.png"
              }
              alt={product.title || "Shoes background"}
              className="inset-0 w-full h-auto block object-cover object-center"
              width={500}
              height={500}
              style={{
                aspectRatio: "1",
                objectFit: "cover",
                filter: product.agotado ? "grayscale(100%)" : "grayscale(0)",
              }}
            />
          </motion.div>
          <div className="absolute inset-0 flex flex-col justify-end text-white w-full h-full top-0 z-[1] bg-gradient-to-t from-black/80 to-transparent">
            <div className="backdrop-blur-xl h-20 p-4 rounded-2xl flex justify-between items-center">
              <h2 className="text-2xl font-bold">{product.title}</h2>
              <div className="flex flex-col items-center gap-2">
                <Badge
                  className={`${
                    product.agotado ? "bg-red-500" : "bg-green-500"
                  }`}
                >
                  {product.agotado ? "Out of Stock" : "In Stock"}
                </Badge>
                <span className="text-xl font-bold text-white">
                  ${Number(product.price).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </AnimatePresence>
      <main className="flex-grow p-4 space-y-6">
        <div>
          <p className="text-gray-700">Descripción</p>
          <p className="text-gray-400">{product.descripcion || "..."}</p>
        </div>
      </main>
      <footer className="p-4">
        <div className="flex justify-end col-span-2">
          {!product.agotado ? (
            <ButtonOfCart prod={product} condition={false} />
          ) : (
            <Button
              className="flex justify-evenly rounded-full w-full"
              size="sm"
              disabled
            >
              <RemoveShoppingCartOutlinedIcon />
            </Button>
          )}
        </div>
      </footer>
      <RatingSection specific={product.productId} sitioweb={store.sitioweb} />
      {store.products.filter((prod) => product.caja === prod.caja).length >
        1 && (
        <div className="flex flex-col w-full mt-4 p-2 md:p-4 bg-white rounded-lg shadow-md border">
          <div className="flex justify-between items-center sticky top-12 md:top-16 bg-white z-[10]">
            <h2 className="text-xl font-semibold font-serif">Otras ofertas</h2>
          </div>
          <div className="grid grid-cols-2 gap-1 grid-flow-row-dense">
            {store.products
              .filter((prod) => product.caja === prod.caja)
              .map((prod, index) => (
                <ProductGrid key={index} prod={prod} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
