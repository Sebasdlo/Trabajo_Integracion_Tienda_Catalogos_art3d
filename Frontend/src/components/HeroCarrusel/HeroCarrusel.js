import { useEffect, useState } from 'react';
import './HeroCarrusel.css';
import banner1 from '../img-banner/banner1.jpg';
import banner2 from '../img-banner/banner2.jpg';
import banner3 from '../img-banner/banner3.jpg';

const imagenes = [banner1, banner2, banner3];

function HeroCarrusel() {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % imagenes.length);
  const prev = () => setIndex((prev) => (prev - 1 + imagenes.length) % imagenes.length);

  // 🕒 Autoplay: cambia cada 5 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      next();
    }, 15000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hero-carousel">
    <img src={imagenes[index]} alt={`Banner ${index + 1}`} />

    <button className="nav-btn hero-left" onClick={prev}>‹</button>
    <button className="nav-btn hero-right" onClick={next}>›</button>
    </div>
  );
}

export default HeroCarrusel;
