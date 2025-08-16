// ServicioCard.jsx
import { useState } from "react";
import useIsMobile from "../hooks/useIsMobile";

export default function ServicioCard({ titulo, descripcion, icono, className="" }) {
  const [flipped, setFlipped] = useState(false);
  const isMobile = useIsMobile();
  const hover = (v)=>{ if (!isMobile) setFlipped(v); };

  return (
    <div
      className={`relative w-full h-[440px] md:h-[233px] cursor-pointer [perspective:1000px] ${className}`}
      onClick={()=> isMobile && setFlipped(!flipped)}
      onMouseEnter={()=>hover(true)} onMouseLeave={()=>hover(false)}
    >
      <div className={`w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${flipped ? "[transform:rotateY(180deg)]" : ""}`}>
        {/* Frente */}
        <div className="absolute inset-0 rounded-2xl shadow-[0_12px_28px_rgba(0,0,0,.18)] bg-[#4E6B3B] text-white [backface-visibility:hidden] p-6 flex flex-col items-center justify-center gap-4">
          {icono ? <div className="text-5xl">{icono}</div> : null}
          <h3 className="text-xl font-semibold text-center leading-snug">{titulo}</h3>
        </div>

        {/* Reverso */}
        <div className="absolute inset-0 rounded-2xl shadow-[0_12px_28px_rgba(0,0,0,.18)] bg-[#C5E0D8] text-neutralDark [transform:rotateY(180deg)] [backface-visibility:hidden] p-5 flex flex-col items-center justify-center gap-3">
          <p className="text-sm text-center">{descripcion}</p>
          <a href={`/reserva?asunto=${encodeURIComponent(titulo)}`}
             className="bg-[#41658A] text-white px-4 py-2 rounded-lg hover:opacity-90">
            Reservar Hora
          </a>
        </div>
      </div>
    </div>
  );
}