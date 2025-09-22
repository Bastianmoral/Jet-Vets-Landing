import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import whatsappIcon from "../assets/icons8-whatsapp.svg";
import instagramIcon from "../assets/icons8-instagram.svg";
import { texts } from "../translations";
import flagES from "../assets/flag-es.svg";
import flagGB from "../assets/flag-uk.svg";

export default function Header({ spaceMode, toggleSpaceMode, lang, toggleLang }) {
  const [open, setOpen] = useState(false);

  // Bloquea scroll del body cuando el menú está abierto (mejor UX)
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  return (
    <header className="bg-[#B6BE9C] dark:bg-transparent dark:text-white h-[70px] px-3 md:px-12 flex justify-between items-center relative">
        <img src={logo} alt="Jet Vets Logo" className="h-full" />

      {/* Desktop */}
      <nav className="hidden md:flex md:gap-10 items-center">
        <a
  href="#nosotros"
  onClick={(e) => {
    e.preventDefault();
    document.getElementById("nosotros")?.scrollIntoView({
      behavior: "smooth",
    });
  }}
  className="text-primary dark:text-white font-medium cursor-pointer"
>
  {texts[lang].header.about}
</a>
        <a
  href="#servicios"
  onClick={(e) => {
    e.preventDefault();
    document.getElementById("servicios")?.scrollIntoView({
      behavior: "smooth",
    });
  }}
  className="text-primary dark:text-white font-medium cursor-pointer"
>
  {texts[lang].header.services}
</a>
          <a href="https://wa.me/34666624057" target="_blank" rel="noopener noreferrer">
            <img src={whatsappIcon} alt="WhatsApp" className="block w-10 h-10" />
          </a>
          <a href="https://www.instagram.com/jet.vets" target="_blank" rel="noopener noreferrer">
            <img src={instagramIcon} alt="Instagram" className="block w-10 h-10" />
          </a>
        <button
          onClick={toggleSpaceMode}
          className="bg-[#5c7c4d] text-white px-4 py-2 rounded-lg text-center w-40"
        >
          {spaceMode ? texts[lang].header.light : texts[lang].header.space}
        </button>
        <button
  onClick={toggleLang}
  className="bg-[#5c7c4d] rounded-full w-11 h-11 grid place-items-center hover:opacity-90 active:scale-95 transition"
  aria-label={lang === "es" ? "Cambiar a inglés" : "Change to Spanish"}
  title={lang === "es" ? "English" : "Español"}
>
  <img
    src={lang === "es" ? flagGB : flagES}
    alt={lang === "es" ? "English flag" : "Bandera de España"}
    className="w-9 h-9 rounded-full object-cover"
    draggable="false"
  />
</button>
        <a href="#reserva" className="bg-[#5c7c4d] text-white px-4 py-2 rounded-lg text-center">
          {texts[lang].header.book}
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
        {open ? "✕" : "Menú"}
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
                    bg-beige/90 dark:bg-neutral-900/90 z-50 pt-[20px] pb-8 px-6 shadow-2xl rounded-l-2xl
                    transition-transform duration-300
                    ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <nav className="flex flex-col items-end gap-6">
          <img src={logo} alt="Jet Vets Logo" className="h-[100px] md:h-[130px] mb-2"/>
          <a href="#nosotros" className="text-primary dark:text-white font-medium" onClick={() => setOpen(false)}>{texts[lang].header.about}</a>
          <a href="#servicios" className="text-primary dark:text-white font-medium" onClick={() => setOpen(false)}>{texts[lang].header.services}</a>
          <div className="flex items-center gap-4">
            <a href="https://wa.me/34666624057" target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
              <img src={whatsappIcon} alt="WhatsApp" className="w-9 h-9" />
            </a>
            <a href="https://instagram.com/jet.vets" target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
              <img src={instagramIcon} alt="Instagram" className="w-8 h-8" />
            </a>
          </div>
          <button
            onClick={() => { toggleSpaceMode(); setOpen(false); }}
            className="bg-[#5c7c4d] text-white px-4 py-2 rounded-lg w-40 self-end"
          >
            {spaceMode ? texts[lang].header.light : texts[lang].header.space}
          </button>
          <button
  onClick={() => { toggleLang(); setOpen(false); }}
  className="bg-[#5c7c4d] rounded-full w-10 h-10 grid place-items-center self-end hover:opacity-90 active:scale-95 transition"
  aria-label={lang === "es" ? "Cambiar a inglés" : "Change to Spanish"}
  title={lang === "es" ? "English" : "Español"}
>
  <img
    src={lang === "es" ? flagGB : flagES}
    alt={lang === "es" ? "English flag" : "Bandera de España"}
    className="w-6 h-6 rounded-full object-cover"
    draggable="false"
  />
</button>

          <a
            href="#reserva"
            onClick={() => setOpen(false)}
            className="mt-3 bg-[#5c7c4d] text-white px-1 py-3 rounded-lg"
          >
            {texts[lang].header.book}
          </a>
        </nav>
      </div>
    </header>
  );
}
