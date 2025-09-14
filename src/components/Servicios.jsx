// src/components/Servicios.jsx
import { useRef } from "react";
import ServicioCard from "./ServicioCard";
import TitleWithClouds from "./TitleWithClouds";
import {
  FaStethoscope,
  FaSyringe,
  FaIdBadge,
  FaPassport,
  FaFlask,
  FaDog,
  FaXRay,
} from "react-icons/fa";
import { GiBrokenBone, GiScalpel } from "react-icons/gi";
import { texts } from "../translations";

const servicios = [
  { key: "general_medicine", icono: <FaStethoscope /> },
  { key: "vaccination", icono: <FaSyringe /> },
  { key: "animal_id", icono: <FaIdBadge /> },
  { key: "blood_analyses", icono: <FaFlask /> },
  { key: "health_travel_certificates", icono: <FaPassport /> },
  { key: "geriatric_care", icono: <FaDog /> },
  { key: "diagnostic_imaging", icono: <FaXRay /> },
  { key: "surgery", icono: <GiScalpel /> },
  { key: "traumatology", icono: <GiBrokenBone /> },
];

export default function Servicios({ lang }) {
  const trackRef = useRef(null);
  const scroll = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  };

  return (
    <section
      id="servicios"
      className="md:bg-[#B6BE9C] bg-[#B6BE9C]/70 dark:bg-transparent min-h-screen flex flex-col justify-start pt-[clamp(1rem,6vh,3rem)] pb-12"
    >
      {/* Título */}
      <div className="text-center mt-[min(4vw)] mb-[min(12vw)] md:mt-[min(0.5vw)] md:mb-[min(2.1vw)]">
        <TitleWithClouds
          as="h2"
          className="text-3xl lg:text-5xl volkhov-bold text-neutralDark/85 dark:text-white"
        >
          {texts[lang].services.title}
        </TitleWithClouds>
      </div>

      {/* MOBILE: carrusel horizontal */}
      <div className="relative md:hidden" role="region" aria-label="Servicios (carrusel)">
        <div
          ref={trackRef}
          className="flex items-center gap-4 overflow-x-auto snap-x snap-mandatory px-4
                     scroll-pl-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {servicios.map((s, i) => (
            <ServicioCard
              key={s.key}
              titulo={texts[lang].services.items[s.key]}
              icono={s.icono}
              lang={lang}
              showHint={i === 0}
              className="shrink-0 snap-center w-[min(94vw,560px)] mx-auto"
            />
          ))}
        </div>

        {/* Flechas */}
        <button
          aria-label="Anterior"
          onClick={() => scroll(-1)}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-[#4E6B3B]/30 text-white w-10 h-10 rounded-full grid place-items-center shadow-lg"
        >
          ‹
        </button>
        <button
          aria-label="Siguiente"
          onClick={() => scroll(1)}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-[#4E6B3B]/30 text-white w-10 h-10 rounded-full grid place-items-center shadow-lg"
        >
          ›
        </button>
      </div>

      {/* DESKTOP: grilla 3x3 */}
      <div className="hidden md:block px-4">
        <div
          className="grid gap-8 mx-auto justify-center"
          style={{ gridTemplateColumns: "repeat(3, 300px)" }}
        >
          {servicios.map((s, i) => (
            <ServicioCard key={s.key} titulo={texts[lang].services.items[s.key]} icono={s.icono} lang={lang} showHint={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
