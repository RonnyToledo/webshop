"use client";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "@/app/layout";
import { CircleArrowRight } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import RetryableImage from "../globalFunctions/RetryableImage";

export default function CategoryProducts() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const { webshop, setwebshop } = useContext(ThemeContext);
  const [category, setcategory] = useState([]);

  useEffect(() => {
    const newCategory = ExtraerCategoria(webshop.store, webshop.products);
    console.log(newCategory);
    setSelectedCategory(newCategory[0]);

    setcategory(newCategory);
  }, [webshop.store, webshop.products]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  console.log(selectedCategory);
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Explora por Categorías
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-4">
          {category.slice(0, 6).map((category) => (
            <button
              key={category.categoria}
              onClick={() => setSelectedCategory(category)}
              className={`flex flex-col items-center h-28  p-4 justify-between border rounded-xl transition-all ${
                selectedCategory.categoria === category.categoria
                  ? "bg-purple-300 scale-105"
                  : "hover:bg-purple-200"
              }`}
            >
              <span className="text-sm font-medium h-10 text-gray-800 line-clamp-2">
                {category.categoria}
              </span>
              <span
                className="text-xs font-medium text-gray-500"
                style={{ fontSize: "8px" }}
              >
                {category.tienda}-{category.provincia}
              </span>
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            {selectedCategory.categoria}
          </h3>
          <Slider {...settings}>
            {BuscarProductos(webshop.products, selectedCategory.categoria)
              .slice(0, 4)
              .map((product) => (
                <div key={product.id} className="px-2">
                  <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                    <div className="h-48 overflow-hidden">
                      <RetryableImage
                        width="500"
                        height="500"
                        src={
                          product.image ||
                          "https://res.cloudinary.com/dbgnyc842/image/upload/v1725399957/xmlctujxukncr5eurliu.png"
                        }
                        alt={product.title || ""}
                        className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">
                        {product.title}
                      </h4>
                      <div className="flex justify-between items-center">
                        <p className="text-purple-600 font-bold">
                          ${Number(product.price).toFixed(2)}
                        </p>
                        <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                          <Link
                            href={`/${selectedCategory.variable}/${selectedCategory.sitioweb}/products/${product.productId}`}
                          >
                            Ver detalles
                          </Link>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </Slider>
        </div>
      </div>
    </section>
  );
}

function ExtraerCategoria(data, products) {
  const categoriaProducts = [...new Set(products.map((prod) => prod.caja))];
  const repeticiones = contarRepeticiones(products.map((prod) => prod.caja));
  const categorias_unicas = [
    ...new Set(data.flatMap((tienda) => tienda.categoria)),
  ];
  const newCat = categorias_unicas.filter(
    (prod) => repeticiones[prod] >= 4 && categoriaProducts.includes(prod)
  );

  const newArray = newCat.map((obj) => {
    const [tienda1] = data.filter((tienda) => tienda.categoria.includes(obj));
    return {
      provincia: tienda1.Provincia,
      tienda: tienda1.name,
      sitioweb: tienda1.sitioweb,
      variable: tienda1.variable,
      categoria: obj,
    };
  });
  return desordenarArray(newArray);
}
function BuscarProductos(products, category) {
  return products.filter((obj) => obj.caja == category);
}
function desordenarArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Índice aleatorio
    // Intercambiar elementos
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
function contarRepeticiones(array) {
  const repeticiones = {};

  for (let i = 0; i < array.length; i++) {
    const elemento = array[i];

    if (repeticiones[elemento]) {
      repeticiones[elemento]++;
    } else {
      repeticiones[elemento] = 1;
    }
  }

  return repeticiones;
}
