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
  const [mobileMode, setMobileMode] = useState('full');

  return (
    <div id="page" className={spaceMode ? 'dark' : ''}>
      <div className="min-h-screen w-full overflow-x-clip relative bg-white text-neutralDark dark:bg-neutral-900 dark:text-white">
        {spaceMode && <StarBackground />}

        {/* Botón de testing */}
        <button 
          onClick={() => setMobileMode(m => m === 'full' ? 'mixed' : 'full')}
          className="fixed bottom-4 right-4 z-[9999] md:hidden bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg shadow-2xl font-bold text-sm"
        >
          MODO: {mobileMode.toUpperCase()}
        </button>

        <Routes>
          <Route
            path="/jetvet"
            element={
              <Home 
                spaceMode={spaceMode} 
                toggleSpaceMode={toggleSpaceMode} 
                lang={lang} 
                toggleLang={toggleLang}
                mobileMode={mobileMode}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
}