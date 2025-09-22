import { motion as Motion, useAnimation, useReducedMotion } from "framer-motion";
import { useEffect, useMemo } from "react";
import rocket from "../assets/cohete-nuevo.png";
import useIsMobile from "../hooks/useIsMobile";

export default function FloatingRocket() {
  const isMobile = useIsMobile();
  const controls = useAnimation();
  const prefersReduced = useReducedMotion();

  // Posición objetivo expresada en unidades relativas (no medimos window)
  const target = useMemo(() => {
    return isMobile
      ? { x: "35vw", y: -50, rot: 2 }   // móvil: más cerca del centro
      : { x: "47vw", y: 30, rot: 4 };  // desktop: a la derecha del texto
  }, [isMobile]);

  // Tamaño fijo para evitar CLS al cargar la imagen
  const pxWidth = isMobile ? 112 : 240;
  const pxHeight = Math.round(pxWidth * 1.6); // ajusta si tu PNG tiene otra proporción

  useEffect(() => {
    async function run() {
      if (prefersReduced) {
        // Sin animaciones para usuarios con "reduced motion"
        await controls.set({ x: target.x, y: target.y, opacity: 1, rotate: target.rot });
        return;
      }

      // 1) Entrada desde fuera del viewport (izquierda) hasta el target
      await controls.start({
        x: target.x,         // destino relativo al viewport
        y: target.y,
        rotate: target.rot,
        opacity: 1,
        transition: {
          duration: 1.4,
          ease: [0.23, 1, 0.36, 1], // easeOutCubic-ish
          type: "tween"
        }
      });

      // 2) Flotado sutil en loop (solo Y y pequeña rotación)
      controls.start({
        y: [target.y, target.y - 10, target.y],
        rotate: [target.rot - 1, target.rot + 1, target.rot - 1],
        transition: {
          duration: 4,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut"
        }
      });
    }
    run();
  }, [controls, target, prefersReduced]);

  return (
    <Motion.div
      // Arranca fuera de pantalla para “llegar”
      initial={{ x: "-40vw", y: -10, opacity: 0, rotate: 0 }}
      animate={controls}
      className="absolute inset-0 -z-10 pointer-events-none will-change-transform"
      style={{ contain: "layout paint size", transform: "translateZ(0)" }}
    >
      <img
        src={rocket}
        alt="Cohete Jet Vets flotando"
        width={pxWidth}
        height={pxHeight}
        className="select-none opacity-100 w-28 md:w-60"
        draggable={false}
      />
    </Motion.div>
  );
}
