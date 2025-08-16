import { useMemo } from "react";

export default function StarBackground({ count = 40 }) {
  const stars = useMemo(() => {
    return Array.from({ length: count }).map(() => {
      const size = Math.random() * 2 + 1; // 1-3px
      return {
        width: `${size}px`,
        height: `${size}px`,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 3}s`
      };
    });
  }, [count]);

  return (
    <div className="pointer-events-none fixed inset-0 z-40 mix-blend-screen">
      {stars.map((style, i) => (
        <span
          key={i}
          className="absolute bg-white rounded-full opacity-70 animate-twinkle"
          style={style}
        />
      ))}
    </div>
  );
}
