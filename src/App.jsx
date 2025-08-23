// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Home from './pages/home';
import StarBackground from './components/StarBackground';

export default function App() {
  const [spaceMode, setSpaceMode] = useState(false);
  const toggleSpaceMode = () => setSpaceMode(!spaceMode);

  return (
    <div id="page" className={spaceMode ? 'dark' : ''}>
      {/* Fondo dinámico */}
      {spaceMode && <StarBackground />}

      <div className="min-h-screen w-full overflow-x-clip relative bg-white text-neutralDark dark:bg-neutral-900 dark:text-white">
        <Routes>
          <Route
            path="/jetvet"
            element={<Home spaceMode={spaceMode} toggleSpaceMode={toggleSpaceMode} />}
          />
        </Routes>
      </div>
    </div>
  );
}
