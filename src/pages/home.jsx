import Header from '../components/header';
import Hero from '../components/hero';
import Footer from '../components/footer';
import SobreNosotros from '../components/SobreNosotros';
import Servicios from '../components/Servicios';
import FormularioReserva from '../components/Formularioreseva';

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Servicios />
      <SobreNosotros />
      <FormularioReserva />
      <Footer />
    </>
  );
}

