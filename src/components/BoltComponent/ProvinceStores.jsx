import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const provinces = [
  {
    name: "Madrid",
    stores: [
      {
        id: 1,
        name: "Plaza Central Madrid",
        image:
          "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800",
        location: "Gran Vía",
      },
      {
        id: 2,
        name: "Moderna Alcalá",
        image:
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800",
        location: "Alcalá de Henares",
      },
    ],
  },
  {
    name: "Barcelona",
    stores: [
      {
        id: 3,
        name: "Plaza Diagonal",
        image:
          "https://images.unsplash.com/photo-1545721264-afab304e89d9?auto=format&fit=crop&q=80&w=800",
        location: "Av. Diagonal",
      },
      {
        id: 4,
        name: "Moderna Gracia",
        image:
          "https://images.unsplash.com/photo-1574737331256-16f47895d422?auto=format&fit=crop&q=80&w=800",
        location: "Barrio de Gracia",
      },
    ],
  },
  {
    name: "Valencia",
    stores: [
      {
        id: 5,
        name: "Plaza del Mar",
        image:
          "https://images.unsplash.com/photo-1519420573924-65fcd45245f8?auto=format&fit=crop&q=80&w=800",
        location: "Puerto",
      },
      {
        id: 6,
        name: "Moderna Centro",
        image:
          "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=800",
        location: "Centro Histórico",
      },
    ],
  },
];

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
          {provinces.map((province) => (
            <div key={province.name} className="px-2">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    {province.name}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {province.stores.map((store) => (
                      <div key={store.id} className="group cursor-pointer">
                        <div className="relative overflow-hidden rounded-lg shadow-md">
                          <Image
                            width="500"
                            height="500"
                            src={store.image}
                            alt={store.name}
                            className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                            <div className="absolute bottom-0 p-6 text-white">
                              <h4 className="text-xl font-bold mb-2">
                                {store.name}
                              </h4>
                              <p className="text-sm opacity-90">
                                {store.location}
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
