"use client";
import React, { useContext, useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { ThemeContext } from "@/app/layout";
import RetryableImage from "../globalFunctions/RetryableImage";
import Link from "next/link";
import { CircleArrowRight } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white"
  >
    <ChevronRight className="h-6 w-6 text-gray-800" />
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white"
  >
    <ChevronLeft className="h-6 w-6 text-gray-800" />
  </button>
);

export default function ProvinceStores() {
  const { webshop, setwebshop } = useContext(ThemeContext);
  const [forPronvice, setforPronvice] = useState([]);
  useEffect(() => {
    setforPronvice(organizeStoresByProvince(webshop.store));
  }, [webshop]);
  console.log(forPronvice);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Nuestras Sedes
        </h2>
        <Slider {...settings}>
          {forPronvice.map((province) => (
            <div key={province.nombre} className="px-2">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    {province.nombre}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {province.store.slice(0, 2).map((store) => (
                      <div key={store.id} className="group cursor-pointer">
                        <div className="relative overflow-hidden rounded-lg shadow-md">
                          <RetryableImage
                            width="500"
                            height="500"
                            src={
                              store.urlPoster ||
                              "https://res.cloudinary.com/dbgnyc842/image/upload/v1725399957/xmlctujxukncr5eurliu.png"
                            }
                            alt={store.name}
                            className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                            <div className="absolute bottom-0 p-6 text-white">
                              <h4 className="text-xl font-bold mb-2">
                                {store.name}
                              </h4>
                              <p className="text-sm opacity-90">
                                {store.Porvincia}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
const organizeStoresByProvince = (stores) => {
  const result = {};

  stores.forEach((store) => {
    const province = store.Provincia;

    if (!result[province]) {
      result[province] = { store: [], nombre: province };
    }

    result[province].store.push({ ...store });
  });

  return desordenarArray(Object.values(result));
};
function desordenarArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Índice aleatorio
    // Intercambiar elementos
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
