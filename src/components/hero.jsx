// src/components/Hero.jsx
import mascotas from '../assets/Ilustracion2_Clean_500.png';
import FloatingRocket from './FloatingRocket';

export default function Hero() {
  return (
    <section className="relative isolate bg-[#F6E9DF] dark:bg-transparent w-full min-h-screen flex items-center overflow-x-clip">
      {/* Cohete animado */}
      <FloatingRocket />
      <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-20 grid grid-cols-1 md:grid-cols-2 gap-12 py-12">


        {/* Texto */}
        <div className="flex flex-col justify-center items-center md:items-end text-center md:text-right gap-6 md:gap-10">
          <h1 className="volkhov-bold text-[35px] sm:text-[45px] lg:text-[60px] text-neutralDark dark:text-white leading-[1.2] tracking-tight">

        {/* Texto */}
        <div className="flex flex-col justify-center items-center md:items-end text-center md:text-right gap-6 md:gap-10">
          <h1 className="volkhov-bold text-[35px] sm:text-[45px] lg:text-[60px] text-neutralDark leading-[1.2] tracking-tight">

            Jet Vets <br />
            <span className="text-primary">un servicio de otra galaxia </span><br />
            directo a tu hogar
          </h1>
          <p className="volkhov-bold text-[20px] lg:text-[30px] text-neutralDark dark:text-white leading-tight">
            Cuidamos la salud de tus mascotas con atención profesional.
          </p>
        </div>

        {/* Imagen */}
        <div className="flex justify-center md:justify-end items-center">
          <img
            src={mascotas}
            alt="Astronauta Jet Vets"
            className="w-[330px] md:w-[380px] lg:w-[500px] md:translate-y-[-30px] md:translate-x-[-60px]"
          />
        </div>
        
      </div>
    </section>
  );
}
