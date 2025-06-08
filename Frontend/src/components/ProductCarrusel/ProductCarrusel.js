import './ProductCarrusel.css';
import ProductCard from '../ProductCard/ProductCard';
import PropTypes from 'prop-types';
import { useState } from 'react';

function ProductCarrusel({ productos: iniciales, titulo }) {
  const [productos, setProductos] = useState(iniciales);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState(null);


  const handleScroll = (dir) => {
    if (isAnimating) return;

    setDirection(dir);
    setIsAnimating(true);

    setTimeout(() => {
      setProductos((prev) => {
        if (dir === 'right') {
          const [first, ...rest] = prev;
          return [...rest, first];
        } else {
          const last = prev[prev.length - 1];
          return [last, ...prev.slice(0, -1)];
        }
      });
      setIsAnimating(false);
      setDirection(null);
    }, 300); // igual que la duración de la animación
  };

  return (
    <div className="carousel-container">
      <h2>{titulo}</h2>
      <div className="carousel-wrapper">
        <button className="scroll-btn left" onClick={() => handleScroll('left')}>&lt;</button>

        <div className={`carousel ${direction === 'left' ? 'animate-left' : ''} ${direction === 'right' ? 'animate-right' : ''}`}>
          {productos.map((p, idx) => (
            <div className="slide-item" key={idx}>
              <ProductCard producto={p} />
            </div>
          ))}
        </div>

        <button className="scroll-btn right" onClick={() => handleScroll('right')}>&gt;</button>
      </div>
    </div>
  );
}

ProductCarrusel.propTypes = {
  productos: PropTypes.array.isRequired,
  titulo: PropTypes.string.isRequired,
};

export default ProductCarrusel;
