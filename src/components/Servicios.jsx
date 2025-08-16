// Servicios.jsx
import { useRef } from "react";
import ServicioCard from "./ServicioCard";
import { FaStethoscope, FaSyringe, FaIdBadge, FaPassport, FaFlask, FaDog, FaAmbulance } from "react-icons/fa";

const servicios = [
  { titulo: "Consultas a Domicilio", descripcion: "…", icono: <FaStethoscope/> },
  { titulo: "Vacunación y Desparasitación", descripcion: "…", icono: <FaSyringe/> },
  { titulo: "Identificación de Animales", descripcion: "…", icono: <FaIdBadge/> },
  { titulo: "Certificados de Salud y Viaje", descripcion: "…", icono: <FaPassport/> },
  { titulo: "Revisiones y Análisis Clínicos", descripcion: "…", icono: <FaFlask/> },
  { titulo: "Atención Geriátrica", descripcion: "…", icono: <FaDog/> },
  { titulo: "Servicio de Urgencia", descripcion: "…", icono: <FaAmbulance/> },
];

export default function Servicios() {
  const trackRef = useRef(null);
  const scroll = (dir)=> trackRef.current?.scrollBy({ left: dir * trackRef.current.clientWidth * 0.9, behavior: "smooth" });

  return (/* bg-[#C5E0D8]/70 */
    <section id="servicios" className="md:bg-[#F6E9DF] bg-[#C5E0D8]/70 min-h-screen flex flex-col justify-start pt-[clamp(1rem,6vh,3rem)] pb-12">
      <h2 className="text-center text-3xl lg:text-5xl volkhov-bold text-neutralDark/85 mt-[min(4vw)] mb-[min(12vw)]  md:mt-[min(0.5vw)] md:mb-[min(2.1vw)]">Nuestros Servicios</h2>

      {/* MOBILE */}
      <div className="relative md:hidden">
        <div
          ref={trackRef}
          className="flex items-center gap-4 overflow-x-auto snap-x snap-mandatory px-4
                     scroll-pl-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {servicios.map((s) => (
            <ServicioCard
              key={s.titulo}
              {...s}
              // Más grande: ocupa ~94vw con tope, alto lo controla la card (h-[360px])
              className="shrink-0 snap-center w-[min(94vw,560px)] mx-auto"
              // Si quieres “peek”: cambia a w-[min(88vw,520px)]
            />
          ))}
        </div>

        {/* Flechas visibles */}
        <button aria-label="Anterior" onClick={()=>scroll(-1)}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-[#4E6B3B]/30 text-white w-10 h-10 rounded-full grid place-items-center shadow-lg">‹</button>
        <button aria-label="Siguiente" onClick={()=>scroll(1)}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-[#4E6B3B]/30 text-white w-10 h-10 rounded-full grid place-items-center shadow-lg">›</button>
      </div> {/* bg-[#4E6B3B]/90 l verde por si el cliente quiere jugar con esto */}

      {/* DESKTOP */}
      <div className="hidden md:block px-4">
  {/* Fila superior: 4 columnas fijas */}
  <div
    className="grid gap-8 mx-auto justify-center"
    style={{ gridTemplateColumns: "repeat(4, 300px)" }} // ajusta 300px al ancho de tu card
  >
    {servicios.slice(0, 4).map((s) => (
      <ServicioCard key={s.titulo} {...s} />
    ))}
  </div>

  {/* Fila inferior: bloque centrado con 3 columnas */}
  <div className="mt-8 flex justify-center">
    <div
      className="grid gap-8"
      style={{ gridTemplateColumns: "repeat(3, 300px)" }} // mismo ancho que arriba
    >
      {servicios.slice(4).map((s) => (
        <ServicioCard key={s.titulo} {...s} />
      ))}
    </div>
  </div>
</div>
    </section>
  );
}