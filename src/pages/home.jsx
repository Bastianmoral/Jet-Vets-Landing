import Header from '../components/header';
import Hero from '../components/hero';
import Footer from '../components/footer';
import SobreNosotros from '../components/SobreNosotros';
import Servicios from '../components/Servicios';
import FormularioReserva from '../components/Formularioreseva';
import LandingRocket from '../components/LandingRocket';

export default function Home({ spaceMode, toggleSpaceMode }) {
  return (
    <>
      <Header spaceMode={spaceMode} toggleSpaceMode={toggleSpaceMode} />
      <Hero />
      <Servicios />
      <SobreNosotros />
      <FormularioReserva />
      <LandingRocket />
      <Footer />
    </>
  );
}

