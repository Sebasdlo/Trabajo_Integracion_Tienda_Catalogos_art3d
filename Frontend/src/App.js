import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home/Home';
import Diseño from './Pages/Design/Design';
import Navbar from './components/Navbar/Navbar';
import './App.css';

function App() {
  useEffect(() => {
    window.particlesJS('particles-container', {
      particles: {
        number: { value: 40 },
        color: { value: '#00ff00' },
        shape: { type: 'circle' },
        opacity: { value: 0.5 },
        size: { value: 3 },
        line_linked: {
          enable: true,
          distance: 150,
          color: '#00ff00',
          opacity: 0.4,
          width: 1,
        },
        move: { enable: true, speed: 1 },
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: { enable: true, mode: 'repulse' },
        },
      },
      retina_detect: true,
    });
  }, []);

  return (
    <div id="particles-container" className="particles-container">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Diseño" element={<Diseño />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
