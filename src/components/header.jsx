import { useEffect, useState } from "react";
import logo from "../assets/logo.png";

export default function Header() {
  const [open, setOpen] = useState(false);

  // Bloquea scroll del body cuando el menú está abierto (mejor UX)
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  return (
    <header className="bg-[#F6E9DF] h-[70px] px-3 py-8 md:px-12 md:py-11 flex justify-between items-center relative">
      <img src={logo} alt="Jet Vets Logo" className="mt-4 md:mt-1 h-[95px] md:h-[130px]" />

      {/* Desktop */}
      <nav className="hidden md:flex md:gap-10 items-center">
        <a href="#nosotros" className="text-primary font-medium">Sobre Nosotros</a>
        <a href="#servicios" className="text-primary font-medium">Servicios</a>
        <a href="https://wa.me/34666666666" target="_blank" rel="noopener noreferrer">
          <img src="src/assets/icons8-whatsapp.svg" alt="WhatsApp" className="w-10 h-10" />
        </a>
        <a href="https://instagram.com/jetvets" target="_blank" rel="noopener noreferrer">
          <img src="src/assets/icons8-instagram.svg" alt="Instagram" className="w-8 h-10" />
        </a>
        <a href="#reserva" className="bg-[#5c7c4d] text-white px-4 py-2 rounded-lg text-center">
          Reservar tu hora
        </a>
      </nav>

      {/* Botón FAB fijo (solo mobile) */}
      <button
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        className="md:hidden fixed z-[60] top-[calc(env(safe-area-inset-top)+12px)]
                   right-[calc(env(safe-area-inset-right)+12px)]
                   w-12 h-12 rounded-full bg-[#4E6B3B] text-white
                   grid place-items-center shadow-lg active:scale-95 transition"
        onClick={() => setOpen(!open)}
      >
        {open ? "✕" : "☰"}
      </button>

      {/* Overlay para cerrar tocando fuera */}
      {open && (
        <button
          aria-label="Cerrar menú"
          className="md:hidden fixed inset-0 bg-black/30 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Panel lateral derecho con slide-in */}
      <div
        className={`md:hidden fixed top-20 right-0 h-screen w-[47vw] max-w-[380px]
                    bg-beige/90 z-50 pt-[20px] pb-8 px-6 shadow-2xl rounded-l-2xl
                    transition-transform duration-300
                    ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <nav className="flex flex-col items-end gap-6">
          <img src={logo} alt="Jet Vets Logo" className="h-[100px] md:h-[130px] mb-2"/>   
          <a href="#nosotros" className="text-primary font-medium" onClick={() => setOpen(false)}>Sobre Nosotros</a>
          <a href="#servicios" className="text-primary font-medium" onClick={() => setOpen(false)}>Servicios</a>
          <div className="flex items-center gap-4">
            <a href="https://wa.me/34666666666" target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
              <img src="src/assets/icons8-whatsapp.svg" alt="WhatsApp" className="w-9 h-9" />
            </a>
            <a href="https://instagram.com/jetvets" target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
              <img src="src/assets/icons8-instagram.svg" alt="Instagram" className="w-8 h-8" />
            </a>
          </div>
          <a
            href="#reserva"
            onClick={() => setOpen(false)}
            className="mt-3 bg-[#5c7c4d] text-white px-1 py-3 rounded-lg"
          >
            Reservar tu hora
          </a>
        </nav>
      </div>
    </header>
  );
}
