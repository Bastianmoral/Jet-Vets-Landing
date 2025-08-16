import about_img from '../assets/JetVetIlustracion02_WIP2_500px.png';
import TitleWithClouds from './TitleWithClouds';

export default function SobreNosotros() {
  return (
    <section
      id="nosotros"
      className="min-h-screen px-6 py-16 bg-[#F6E9DF] md:bg-[#F6E9DF] dark:bg-transparent text-neutralDark dark:text-white"
    >
      {/* Contenedor responsivo */}
      <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 items-center gap-10">
  
  {/* Imagen: en mobile abajo (order-2), en desktop a la izquierda (lg:order-1) */}
  <div className="order-2 lg:order-1 flex justify-center lg:justify-start">
    <img
      src={about_img}
      alt="Astronauta Jet Vets"
      className="w-[320px] sm:w-[420px] lg:w-[500px] h-auto object-contain"
    />
  </div>

  {/* Texto: en mobile arriba (order-1), en desktop a la derecha (lg:order-2) */}
  <div className="order-1 lg:order-2 max-w-3xl mx-auto lg:mx-0 text-center lg:text-left">

    <TitleWithClouds as="h2" className="text-3xl lg:text-5xl volkhov-bold mb-5 dark:text-white">Sobre Nosotros</TitleWithClouds>

    <p className="text-lg lg:text-xl volkhov-regular">
      Jet Vets Quisque tincidunt diam eget tempus hendrerit. Suspendisse nibh urna,
      consectetur quis lectus ut, pharetra volutpat nulla. Integer ornare justo mauris,
      eleifend fermentum nisl varius tempus. Nulla facilisi. Etiam nisl augue, pharetra et
      metus nec, tempor laoreet sapien. Vivamus dignissim laoreet congue. In dictum risus
      quam, et auctor urna placerat condimentum. Nullam nec nisl sed purus facilisis
      volutpat vitae sit amet nisi. Donec rhoncus vulputate arcu eget euismod. Nam mi
      sapien, placerat ac aliquet id, mattis ut ligula. Donec convallis venenatis metus,
      eget tincidunt leo rutrum et. Interdum et malesuada fames ac ante ipsum primis in
      faucibus. Vivamus rhoncus quis lacus eget scelerisque. Curabitur ultrices augue vel
      ante venenatis, eu congue est vestibulum. Donec est orci, ultricies eget pretium id,
      tempor eu ex. Donec at elementum lorem, eu tristique augue.
    </p>
  </div>
</div>
    </section>
  );
}
