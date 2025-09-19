// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Home from './pages/home';
import StarBackground from './components/StarBackground';

export default function App() {
  const [spaceMode, setSpaceMode] = useState(false);
  const toggleSpaceMode = () => setSpaceMode(!spaceMode);
  const [lang, setLang] = useState('es');
  const toggleLang = () => setLang(lang === 'es' ? 'en' : 'es');

  return (
    <div id="page" className={spaceMode ? 'dark' : ''}>
      <div className="min-h-screen w-full overflow-x-clip relative bg-white text-neutralDark dark:bg-neutral-900 dark:text-white">
        {/* Fondo dinámico */}
        {spaceMode && <StarBackground />}

        <Routes>
          <Route
            path="/jetvet"
            element={<Home spaceMode={spaceMode} toggleSpaceMode={toggleSpaceMode} lang={lang} toggleLang={toggleLang} />}
          />
        </Routes>
      </div>
    </div>
  );
}
