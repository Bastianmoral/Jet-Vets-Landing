// src/components/Footer.jsx
import { texts } from '../translations';

export default function Footer({ lang }) {
  return (
    <footer className="bg-[#B6BE9C]/70 md:bg-[#B6BE9C] dark:bg-transparent text-gray dark:text-white text-center g-full pt-10 py-8 text-sm">
      <p>{texts[lang].footer.rights}</p>
    </footer>
  );
}
