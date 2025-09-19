// src/components/Hero.jsx
import mascotas from '../assets/Ilustracion2_Clean_500.png';
import FloatingRocket from './FloatingRocket';
import { texts } from '../translations';

export default function Hero({ lang }) {
  const t = texts[lang].hero;
  return (
    <section className="relative isolate bg-[#B6BE9C] dark:bg-transparent w-full min-h-screen flex items-center overflow-x-clip">
      {/* Cohete animado (al fondo) */}
      <FloatingRocket />
 
      {/* Contenido */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 lg:px-20 grid grid-cols-1 md:grid-cols-2 gap-12 py-12">

        {/* Texto */}
        <div className="flex flex-col justify-center items-center md:items-end text-center md:text-right gap-2 md:gap-10">
          <h1 className="volkhov-bold text-[30px] lg:text-[50px] text-neutralDark dark:text-white leading-[1.2] tracking-tight">
            Jet Vets <br />
            <span className="text-primary">{t.subtitle}</span>
          </h1>
          <p className="volkhov-bold text-[16px] lg:text-[30px] text-neutralDark dark:text-white leading-tight">
            {t.description}
          </p>
{/*         <p className="volkhov-bold text-[20px] lg:text-[16px] text-neutralDark dark:text-white leading-tight">
Entendemos que tu peludo es parte de la familia, por ello llevamos nuestra antención con cariño y profesionalidad a su rincon favorito. Vuestro hogar. 
          </p>
          <p className="volkhov-bold text-[20px] lg:text-[16px] text-neutralDark dark:text-white leading-tight">
Despidete del estrés del trasportin, viaje y salas de espera. Nosotros nos adaptamos y aterrizamos en vuestra puerta. 
          </p> */}

        </div>

        {/* Imagen */}
        <div className="flex justify-center md:justify-end items-center">
          <img
            src={mascotas}
            alt="Astronauta Jet Vets"
            className="w-[330px] md:w-[380px] lg:w-[450px] md:translate-y-[-20px] md:translate-x-[-20px]"
          />
        </div>

      </div>
    </section>
  );
}
