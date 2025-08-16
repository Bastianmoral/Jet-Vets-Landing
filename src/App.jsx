import { Routes, Route } from 'react-router-dom';
import Home from './pages/home';

export default function App() {
  return (
    <div id="page" className="min-h-screen w-full overflow-x-clip">
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}