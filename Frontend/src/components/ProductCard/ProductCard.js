import './ProductCard.css';
import PropTypes from 'prop-types';

function ProductCard({ producto }) {
  return (
    <div className="product-card">
      <div className="image-wrapper">
        <img src={producto.imagen || producto.imagenUrl} alt={producto.nombre} />
      </div>
      <div className="info">
        <h3>{producto.nombre}</h3>
        <p className="categoria">{producto.categoria} - {producto.subcategoria}</p>
        <p className="precio">${producto.precio.toLocaleString('es-CO')}</p>
        <p className="cuotas">
          <strong>3</strong> cuotas sin interés de{' '}
          <strong>${Math.round(producto.precio / 3).toLocaleString('es-CO')}</strong>
        </p>
      </div>
    </div>
  );
}

ProductCard.propTypes = {
  producto: PropTypes.shape({
    imagen: PropTypes.string.isRequired,
    imagenUrl: PropTypes.string,
    nombre: PropTypes.string.isRequired,
    precio: PropTypes.number.isRequired,
    categoria: PropTypes.string,
    subcategoria: PropTypes.string,
  }).isRequired,
};

export default ProductCard;
