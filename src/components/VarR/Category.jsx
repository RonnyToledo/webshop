"use client";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "@/context/MyContext";
import RemoveShoppingCartOutlinedIcon from "@mui/icons-material/RemoveShoppingCartOutlined";
import { ButtonOfCart } from "../globalFunctions/components";
import Link from "next/link";
import { ExtraerCategorias, Promedio } from "../globalFunctions/function";

export default function CategoryShowcase({ categoria }) {
  const { store, dispatchStore } = useContext(MyContext);
  const [finCategory, setFinCategory] = useState({});

  useEffect(() => {
    setFinCategory(store.categoria.find((obj) => obj.id === categoria));
  }, [categoria, store.categoria]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="relative h-[300px] rounded-xl overflow-hidden mb-12">
        <Image
          src={
            finCategory?.image ||
            "https://res.cloudinary.com/dbgnyc842/image/upload/v1725399957/xmlctujxukncr5eurliu.png"
          }
          alt={finCategory?.name || "Categoria"}
          layout="fill"
          objectFit="cover"
          className="absolute inset-0"
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
      <section>
        <h2 className="text-3xl font-semibold mb-6">{finCategory?.name}</h2>
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
                className={`flex flex-col ${product.span ? "col-span-2" : ""}`}
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
