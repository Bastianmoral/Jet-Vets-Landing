// ServicioCard.jsx
import { useState, useEffect } from "react";
import { FaWhatsapp, FaRegHandPointer } from "react-icons/fa";
import useIsMobile from "../hooks/useIsMobile";
import { texts } from "../translations";

export default function ServicioCard({ titulo, icono, className="", lang, showHint=false }) {
  const [flipped, setFlipped] = useState(false);
  const isMobile = useIsMobile();
  const hover = (v)=>{ if (!isMobile) setFlipped(v); };
  const [hint, setHint] = useState(showHint);
  useEffect(() => {
    if (!showHint) return;
    const timer = setTimeout(() => setHint(false), 4000);
    return () => clearTimeout(timer);
  }, [showHint]);
  const t = texts[lang].serviceCard;


  
  return (
    <div
      className={`relative w-full h-[440px] md:h-[233px] cursor-pointer [perspective:1000px] ${className}`}
      onClick={()=> { if (isMobile) { setFlipped(!flipped); setHint(false); } }}
      onMouseEnter={()=>hover(true)} onMouseLeave={()=>hover(false)}
    >
      <div className={`w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${flipped ? "[transform:rotateY(180deg)]" : ""}`}>
        {/* Frente */}
        <div className="absolute inset-0 rounded-2xl shadow-[0_12px_28px_rgba(0,0,0,.18)] bg-[#4E6B3B] text-white [backface-visibility:hidden] p-6 flex flex-col items-center justify-center gap-4">
          {icono ? <div className="text-5xl">{icono}</div> : null}
          <h3 className="text-xl font-semibold text-center leading-snug">{titulo}</h3>
          {hint && isMobile && (
            <FaRegHandPointer className="absolute bottom-4 right-4 text-3xl animate-bounce" />
          )}
        </div>

        {/* Reverso */}
        <div className="absolute inset-0 rounded-2xl shadow-[0_12px_28px_rgba(0,0,0,.18)] bg-[#C5E0D8] text-neutralDark [transform:rotateY(180deg)] [backface-visibility:hidden] p-5 flex flex-col items-center justify-center gap-4">
          {icono ? <div className="text-5xl text-primary">{icono}</div> : null}
          <div className="flex gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                const params = new URLSearchParams(window.location.search);
                params.set('asunto', titulo);
                const newUrl = `${window.location.pathname}?${params.toString()}#reserva`;
                window.history.pushState(null, '', newUrl);
                window.dispatchEvent(new PopStateEvent('popstate'));
                document.getElementById('reserva')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-[#41658A] text-white px-4 py-2 rounded-lg hover:opacity-90"
            >
              {t.book}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                const message = encodeURIComponent(t.whatsapp.replace('{servicio}', titulo));
                window.open(`https://wa.me/34666666666?text=${message}`, '_blank');
              }}
              className="bg-[#25D366] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90"
            >
              <FaWhatsapp />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}