// pages/YourSliderComponent.js
import { useEffect, useRef, useState } from "react";
import KeenSlider from "keen-slider";
import { ArrowBigRightDash, ArrowBigLeftDash } from "lucide-react";
import "keen-slider/keen-slider.min.css";
import { StarCount } from "../globalFunctions/components";
import { shuffleArray } from "./function";

const cmt1 = {
  cmt: "La experiencia fue muy satisfactoria. Me sentí bien atendido/a y el servicio cumplió con mis expectativas.",
  star: 4,
  name: "Anónimo",
};
const cmt2 = {
  cmt: "El servicio recibido fue excelente, con gran atención al detalle y profesionalismo. Quedé muy complacido/a con la experiencia.",
  star: 4,
  name: "Anónimo",
};

export default function YourSliderComponent({ commentTienda }) {
  const sliderRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [coment, setcoment] = useState([]);
  useEffect(() => {
    setcoment(
      shuffleArray(
        commentTienda.length > 1
          ? [...commentTienda]
          : commentTienda.length > 0
          ? [...commentTienda, cmt1]
          : [cmt1, cmt2]
      ).slice(0, 5)
    );
  }, [commentTienda]);

  const slider = new KeenSlider(sliderRef.current, {
    loop: true,
    slides: {
      origin: "center",
      perView: 1.25,
      spacing: 16,
    },
    breakpoints: {
      "(min-width: 1024px)": {
        slides: {
          origin: "auto",
          perView: 1.5,
          spacing: 32,
        },
      },
    },
  });

  return (
    <section className="bg-gray-50">
      <div className="mx-auto max-w-[1340px] px-4 py-12 sm:px-6 lg:me-0 lg:py-16 lg:pe-0 lg:ps-8 xl:py-24">
        <div className="grid grid-cols-1 gap-8 ">
          <div>
            <div ref={sliderRef} className="keen-slider">
              {coment.map((review, indexCom) => (
                <div key={indexCom} className="keen-slider__slide">
                  <blockquote className="flex h-full flex-col justify-between bg-white p-6 shadow-sm sm:p-8 lg:p-12">
                    <div>
                      <div className="flex gap-0.5 text-green-500">
                        <StarCount array={[review]} campo={"star"} />
                      </div>
                      <div className="mt-4">
                        <p className="text-2xl font-bold text-rose-600 sm:text-3xl">
                          {review.name}
                        </p>
                        <p className="mt-4 leading-relaxed text-gray-700">
                          {review.cmt}
                        </p>
                      </div>
                    </div>
                  </blockquote>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center gap-4">
              <button
                aria-label="Previous slide"
                className="rounded-full border border-rose-600 p-3 text-rose-600 transition hover:bg-rose-600 hover:text-white"
                onClick={() => slider.prev()}
              >
                <ArrowBigLeftDash />
              </button>
              <button
                aria-label="Next slide"
                className="rounded-full border border-rose-600 p-3 text-rose-600 transition hover:bg-rose-600 hover:text-white"
                onClick={() => slider.next()}
              >
                <ArrowBigRightDash />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
