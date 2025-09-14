import about_img from '../assets/JetVetIlustracion02_WIP2_500px.png';

import { texts } from '../translations';
export default function SobreNosotros({ lang }) {
  const t = texts[lang].about;
  return (
    <section
      id="nosotros"
      className="min-h-screen px-6 py-12 bg-[#B6BE9C] md:bg-[#B6BE9C] dark:bg-transparent text-neutralDark dark:text-white"
    >
      {/* Contenedor responsivo */}
      <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 items-center gap-2">
  
  {/* Imagen: en mobile abajo (order-2), en desktop a la izquierda (lg:order-1) */}
  <div className="order-2 lg:order-1 flex justify-center lg:justify-start">
    <img
      src={about_img}
      alt="Astronauta Jet Vets"
      className="w-[320px] sm:w-[420px] lg:w-[600px] h-auto lg:h-[400px] object-contain"
    />
  </div>

  {/* Texto: en mobile arriba (order-1), en desktop a la derecha (lg:order-2) */}
  <div className="order-1 lg:order-2 max-w-3xl mx-auto lg:mx-0 text-center lg:text-right">


    <h2 className="text-3xl lg:text-5xl volkhov-bold mb-5 dark:text-white">{t.title}</h2>


    <p className="text-[14px] lg:text-xl volkhov-regular">{t.body}</p>
  </div>
</div>
    </section>
  );
}
