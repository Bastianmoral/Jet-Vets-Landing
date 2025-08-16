import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Home from './pages/home';
import StarBackground from './components/StarBackground';

export default function App() {
  const [spaceMode, setSpaceMode] = useState(false);
  const toggleSpaceMode = () => setSpaceMode(!spaceMode);

  return (
    <div id="page" className={spaceMode ? 'dark' : ''}>
      {spaceMode && <StarBackground />}
      <div className="min-h-screen w-full overflow-x-clip relative bg-white text-neutralDark dark:bg-neutral-900 dark:text-white">
        <Routes>
          <Route path="/" element={<Home spaceMode={spaceMode} toggleSpaceMode={toggleSpaceMode} />} />
        </Routes>
      </div>

    <div id="page" className="min-h-screen w-full overflow-x-clip relative">
      <StarBackground />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}