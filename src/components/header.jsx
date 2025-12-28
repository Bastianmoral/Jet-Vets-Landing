// src/components/Header.jsx
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "../assets/logo.png";
import whatsappIcon from "../assets/icons8-whatsapp.svg";
import instagramIcon from "../assets/icons8-instagram.svg";
import { texts } from "../translations";
import flagES from "../assets/flag-es.svg";
import flagGB from "../assets/flag-uk.svg";
import StarBackground from "./StarBackground";

export default function Header({
  spaceMode,
  toggleSpaceMode,
  lang,
  toggleLang,
  mobileMode = "full",
}) {
  const headerRef = useRef(null);
  const [offsetH, setOffsetH] = useState(100);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    const r = () => setOffsetH(headerRef.current?.offsetHeight || 70);
    r();
    window.addEventListener("resize", r);
    return () => window.removeEventListener("resize", r);
  }, []);

  const scrollToId = (id) => (e) => {
    e?.preventDefault?.();
    const el = document.getElementById(id);
    if (!el) return;
    const headerH = headerRef.current?.offsetHeight ?? 70;
    const y = el.getBoundingClientRect().top + window.scrollY - headerH - 8;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  useEffect(() => {
    const close = (ev) => {
      if (!headerRef.current?.contains(ev.target)) setMoreOpen(false);
    };
    if (moreOpen) document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [moreOpen]);

  const baseBg = spaceMode
    ? "bg-[#03120E] text-white"
    : "bg-[#B6BE9C] text-[#03120E]";

  return (
    <>
      <header
        ref={headerRef}
        className={`${baseBg} sticky top-0 left-0 right-0 z-50 border-b border-black/5 dark:border-white/10 relative`}
      >
        {spaceMode && (
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <StarBackground count={28} variant="local" />
          </div>
        )}

        <div className="relative z-10">
          {/* ---- DESKTOP ---- */}
          <div className="hidden md:flex h-[100px] px-12 items-center justify-between">
            <img src={logo} alt="Jet Vets Logo" className="h-[120px] w-[120px]" />

            <nav className="flex gap-10 items-center">
              <a
                href="#nosotros"
                onClick={scrollToId("nosotros")}
                className="text-primary dark:text-white font-medium text-[17px] mt-[10px] cursor-pointer"
              >
                {texts[lang].header.about}
              </a>
              <a
                href="#servicios"
                onClick={scrollToId("servicios")}
                className="text-primary dark:text-white font-medium text-[17px] mt-[10px] cursor-pointer"
              >
                {texts[lang].header.services}
              </a>

              <a
                href="https://wa.me/34666624057"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Abrir WhatsApp"
              >
                <img src={whatsappIcon} alt="WhatsApp" className="w-11 h-11" />
              </a>
              <a
                href="https://www.instagram.com/jet.vets"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Abrir Instagram"
              >
                <img src={instagramIcon} alt="Instagram" className="w-11 h-11" />
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

              <a
                href="#reserva"
                onClick={scrollToId("reserva")}
                className="bg-[#5c7c4d] text-white px-4 py-2 rounded-lg text-center"
              >
                {texts[lang].header.book}
              </a>
            </nav>
          </div>

          {/* ---- MOBILE: MODO FULL MEJORADO ---- */}
          {mobileMode === "full" && (
            <div className="md:hidden px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                {/* Logo */}
                <img
                  src={logo}
                  alt="Jet Vets Logo"
                  className="h-16 w-16 flex-shrink-0"
                />

                {/* Sección izquierda: Links */}
                <div className="flex flex-col gap-3 flex-1">
                  <button
                    onClick={scrollToId("nosotros")}
                    className="text-black/90 dark:text-white font-semibold tracking-wide text-xs text-left hover:opacity-70 transition"
                  >
                    {texts[lang].header.about.toUpperCase()}
                  </button>
                  <button
                    onClick={scrollToId("servicios")}
                    className="text-black/90 dark:text-white font-semibold tracking-wide text-xs text-left hover:opacity-70 transition"
                  >
                    {texts[lang].header.services.toUpperCase()}
                  </button>
                </div>

                {/* Sección central: Iconos sociales */}
                <div className="flex flex-col items-center gap-1 mr-1">
                  <a
                    href="https://www.instagram.com/jet.vets"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="hover:scale-110 transition"
                  >
                    <img src={instagramIcon} alt="Instagram" className="w-9 h-9" />
                  </a>
                  <a
                    href="https://wa.me/34666624057"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="hover:scale-110 transition"
                  >
                    <img src={whatsappIcon} alt="WhatsApp" className="w-9 h-9" />
                  </a>
                </div>

                {/* Sección derecha: Controles */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  {/* Toggle modo espacial + idioma en la misma fila */}
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-black/90 dark:text-white whitespace-nowrap">
                      {texts[lang].header.space}
                    </span>
                    <button
                      onClick={toggleSpaceMode}
                      role="switch"
                      aria-checked={spaceMode}
                      className={`relative h-6 w-11 rounded-full transition shadow-inner ${
                        spaceMode ? "bg-[#38563f]" : "bg-[#5c7c4d]"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                          spaceMode ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                      {/* Texto ON/OFF */}
                      <span className={`absolute top-1 text-[7px] font-bold transition-opacity ${
                        spaceMode ? "left-1 opacity-100" : "left-1 opacity-0"
                      }`}>
                        ON
                      </span>
                      <span className={`absolute top-1 text-[7px] font-bold transition-opacity ${
                        !spaceMode ? "right-1 opacity-100" : "right-1 opacity-0"
                      }`}>
                        OFF
                      </span>
                    </button>
                    
                    {/* Botón de idioma */}
                    <button
                      onClick={toggleLang}
                      className="w-8 h-8 rounded-full bg-[#5c7c4d] grid place-items-center hover:opacity-90 active:scale-95 transition"
                      aria-label={lang === "es" ? "Cambiar a inglés" : "Change to Spanish"}
                    >
                      <img
                        src={lang === "es" ? flagGB : flagES}
                        alt={lang === "es" ? "English flag" : "Bandera de España"}
                        className="w-5 h-5 rounded-full object-cover"
                        draggable="false"
                      />
                    </button>
                  </div>

                  {/* Botón de reserva */}
                  <a
                    href="#reserva"
                    onClick={scrollToId("reserva")}
                    className="w-[120px] px-2 py-1.5 bg-[#5c7c4d] text-white rounded-md text-[9px] font-bold hover:bg-[#4a6a3d] transition text-center leading-tight flex items-center justify-center"
                  >
                    {texts[lang].header.book.toUpperCase()}
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* ---- MOBILE: MODO MIXED REDISEÑADO ---- */}
          {mobileMode === "mixed" && (
            <div className="md:hidden px-1 py-1 relative">
              <div className="flex items-center justify-between gap-1">
                {/* Logo */}
                <img
                  src={logo}
                  alt="Jet Vets Logo"
                  className="h-14 w-14 flex-shrink-0"
                />

                {/* Botones principales centrados */}
                <div className="flex items-center gap-1.5 flex-1 justify-center">
                  {/* WhatsApp - Con flex-shrink-0 para evitar compresión */}
                  <a
                    href="https://wa.me/34666624057"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="w-11 h-11 flex-shrink-0 rounded-full active:scale-95 transition grid place-items-center"
                  >
                    <img src={whatsappIcon} alt="WhatsApp" className="w-11 h-11" />
                  </a>

                  {/* Instagram - Con flex-shrink-0 para evitar compresión */}
                  <a
                    href="https://www.instagram.com/jet.vets"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-11 h-11 flex-shrink-0 rounded-full hover:opacity-90 active:scale-95 transition grid place-items-center"
                  >
                    <img src={instagramIcon} alt="Instagram" className="w-11 h-11" />
                  </a>

                  {/* Reservar - Ancho y alto fijos, texto en múltiples líneas */}
                  <a
                    href="#reserva"
                    onClick={scrollToId("reserva")}
                    className="w-[110px] h-11 flex-shrink-0 px-1.5 bg-[#5c7c4d] hover:bg-[#4a6a3d] text-white rounded-full text-[8.5px] font-bold active:scale-95 transition text-center leading-[1.15] flex items-center justify-center"
                  >
                    {texts[lang].header.book}
                  </a>
                </div>

                {/* Menú "Más" mejorado */}
                <div className="relative flex-shrink-0 pr-1">
                  <button
                    onClick={() => setMoreOpen((v) => !v)}
                    aria-expanded={moreOpen}
                    aria-haspopup="menu"
                    className={`w-11 h-11 rounded-full bg-[#5c7c4d] hover:bg-[#4a6a3d] grid place-items-center text-white active:scale-95 transition ${
                      moreOpen ? "bg-[#4a6a3d]" : ""
                    }`}
                  >
                    <span className="pointer-events-none">
                      {moreOpen ? <X size={18} /> : <Menu size={18} />}
                    </span>
                  </button>

                  {/* Dropdown mejorado */}
                  {moreOpen && (
                    <div
                      role="menu"
                      className="absolute right-0 mt-2 w-55 bg-[#B09CBF] dark:bg-[#5c7c4d] rounded-2xl shadow-2xl border border-black/10 dark:border-white/10 z-50 overflow-hidden"
                    >
                      {/* Links de navegación */}
                      <div className="p-2 border-b border-black/5 dark:border-white/5">
                        <button
                          onClick={(e) => {
                            setMoreOpen(false);
                            scrollToId("nosotros")(e);
                          }}
                          role="menuitem"
                          className="text-[#F9F9F9] w-full text-left px-4 py-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 font-medium transition text-sm"
                        >
                          📖 {texts[lang].header.about}
                        </button>
                        <button
                          onClick={(e) => {
                            setMoreOpen(false);
                            scrollToId("servicios")(e);
                          }}
                          role="menuitem"
                          className="text-[#F9F9F9] w-full text-left px-4 py-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 font-medium transition text-sm"
                        >
                          ⚕️ {texts[lang].header.services}
                        </button>
                      </div>

                      {/* Controles */}
                      <div className="p-2">
                        {/* Modo espacial */}
                        <div className="text-[#F9F9F9] flex items-center justify-between px-4 py-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">🌌</span>
                            <span className="text-sm font-medium">
                              {texts[lang].header.space}
                            </span>
                          </div>
                          <button
                            onClick={toggleSpaceMode}
                            role="switch"
                            aria-checked={spaceMode}
                            className={`relative h-7 w-12 rounded-full transition shadow-inner ${
                              spaceMode ? "bg-[#38563f]" : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-white transition-transform shadow-sm ${
                                spaceMode ? "translate-x-5" : "translate-x-0"
                              }`}
                            />
                            {/* Texto ON/OFF */}
                            <span className={`absolute top-1.5 text-[7px] font-bold text-white transition-opacity ${
                              spaceMode ? "left-1.5 opacity-100" : "left-1.5 opacity-0"
                            }`}>
                              ON
                            </span>
                            <span className={`absolute top-1.5 text-[7px] font-bold text-gray-600 transition-opacity ${
                              !spaceMode ? "right-1.5 opacity-100" : "right-1.5 opacity-0"
                            }`}>
                              OFF
                            </span>
                          </button>
                        </div>

                        {/* Idioma */}
                        <button
                          onClick={() => {
                            toggleLang();
                            setMoreOpen(false);
                          }}
                          role="menuitem"
                          className="text-[#F9F9F9] w-full flex items-center justify-between ml-1.5 px-4 py-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 font-medium transition"
                        >
                          <div className="flex items-center gap-2">
                            {/* <span className="text-2xl">🌐</span> */}
                            <img
                            src={lang === "es" ? flagGB : flagES}
                            alt={lang === "es" ? "English flag" : "Bandera de España"}
                            className="w-6 h-6 rounded-full object-cover"
                            draggable="false"
                          />
                            <span className="text-sm">
                              {lang === "es" ? "English" : "Español"}
                            </span>
                          </div>
                        {/*   <img
                            src={lang === "es" ? flagGB : flagES}
                            alt={lang === "es" ? "English flag" : "Bandera de España"}
                            className="w-6 h-6 rounded-full object-cover"
                            draggable="false"
                          /> */}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}