import { motion as Motion, useReducedMotion } from "framer-motion";
import rocket from "../assets/cohete-nuevo.png";
import useIsMobile from "../hooks/useIsMobile";

export default function LandingRocket() {
  const isMobile = useIsMobile();
  const prefersReduced = useReducedMotion();

  if (isMobile) return null;

  return (
    <div className="relative h-64 overflow-visible">
      <Motion.img
        src={rocket}
        alt="Cohete aterrizando"
        className="absolute left-1/2 -translate-x-1/2 w-40"
        initial={prefersReduced ? { y: 0, rotate: 180, opacity: 1 } : { y: -200, rotate: 180, opacity: 0 }}
        whileInView={{ y: 0, rotate: 180, opacity: 1 }}
        transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
      />
    </div>
  );
}
