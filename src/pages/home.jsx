import Header from '../components/header';
import Hero from '../components/hero';
import Footer from '../components/footer';
import SobreNosotros from '../components/SobreNosotros';
import Servicios from '../components/Servicios';
import FormularioReserva from '../components/Formularioreseva';
/* import LandingRocket from '../components/LandingRocket'; */

export default function Home({ spaceMode, toggleSpaceMode, lang, toggleLang }) {
  return (
    <>
      <Header spaceMode={spaceMode} toggleSpaceMode={toggleSpaceMode} lang={lang} toggleLang={toggleLang} />
      <Hero lang={lang} />
      <Servicios lang={lang} />
      <SobreNosotros lang={lang} />
      <FormularioReserva lang={lang} />
      {/* <LandingRocket /> */}
      <Footer lang={lang} />
    </>
  );
}

