"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "@/context/MyContext";
import RemoveShoppingCartOutlinedIcon from "@mui/icons-material/RemoveShoppingCartOutlined";
import { ButtonOfCart } from "../globalFunctions/components";
import Link from "next/link";
import { ExtraerCategorias, Promedio } from "../globalFunctions/function";
import { notFound } from "next/navigation";

export default function CategoryShowcase({ categoria }) {
  const { store, dispatchStore } = useContext(MyContext);
  const [finCategory, setFinCategory] = useState({});

  useEffect(() => {
    const newCat = store.categoria.find((obj) => obj.id === categoria);
    if (newCat) {
      setFinCategory(newCat);
    } else {
      notFound();
    }
  }, [categoria, store.categoria]);
  console.log(finCategory);
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[300px] rounded-b-xl overflow-hidden mb-6 bg-white">
        <Image
          src={
            finCategory?.image ||
            store?.banner ||
            store?.urlPoster ||
            "https://res.cloudinary.com/dbgnyc842/image/upload/v1725399957/xmlctujxukncr5eurliu.png"
          }
          alt={finCategory?.name || "Categoria"}
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center p-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4  line-clamp-2">
            {finCategory?.name}
          </h1>
          <p className="text-xl text-white max-w-2xl line-clamp-3">
            {finCategory?.description}
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="bg-white rounded-xl m-2 p-2">
        <div className="grid grid-cols-2 gap-1 grid-flow-row-dense">
          {store.products
            .filter((obj) => obj.caja == categoria)
            .sort((a, b) => {
              return Promedio(a.coment, "star") == Promedio(b.coment, "star")
                ? a.order - b.order
                : Promedio(b.coment, "star") - Promedio(a.coment, "star");
            })
            .map((product) => (
              <Card
                key={product.id}
                className={`p-1 flex flex-col rounded-2xl border-0 ${
                  product.span ? "col-span-2" : ""
                }`}
              >
                <CardContent className="p-0">
                  <Link
                    className={`relative rounded-2xl overflow-hidden`}
                    href={`/${store.variable}/${store.sitioweb}/products/${product.productId}`}
                  >
                    <Image
                      src={
                        product.image ||
                        store.urlPoster ||
                        "https://res.cloudinary.com/dbgnyc842/image/upload/v1725399957/xmlctujxukncr5eurliu.png"
                      }
                      alt={product.title || "Product"}
                      className={` object-center w-full group-hover:scale-105 transition-transform block z-[1] rounded-2xl ${
                        product.span ? "h-52" : "h-auto"
                      }`}
                      height="300"
                      width="300"
                      style={{
                        aspectRatio: "1",
                        objectFit: "cover",
                        filter: product.agotado
                          ? "grayscale(100%)"
                          : "grayscale(0)",
                      }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-2 md:p-8 rounded-2xl">
                      <p className="text-sm text-white font-semibold max-h-10 line-clamp-2 ">
                        {product.title}
                      </p>
                    </div>
                  </Link>

                  <div className="p-1">
                    <div className="grid grid-cols-6 overflow-hidden m-2">
                      <div
                        className="h-7 m-2 text-gray-700 line-clamp-2 col-span-4"
                        style={{ fontSize: "10px" }}
                      >
                        ${Number(product.price).toFixed(2)}
                      </div>
                      <div className="flex justify-end col-span-2">
                        {!product.agotado ? (
                          <ButtonOfCart
                            prod={product}
                            AnimationCart={AnimationCart}
                          />
                        ) : (
                          <Button
                            className="flex justify-evenly rounded-full"
                            size="sm"
                            disabled
                          >
                            <RemoveShoppingCartOutlinedIcon />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </section>
    </div>
  );
}
const AnimationCart = () => {};
