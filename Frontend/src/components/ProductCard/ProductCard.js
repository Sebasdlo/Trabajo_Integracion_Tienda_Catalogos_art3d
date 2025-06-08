import './ProductCard.css';
import PropTypes from 'prop-types';

function ProductCard({ producto }) {
  return (
    <div className="product-card">
      <div className="image-wrapper">
        <img src={producto.imagen || producto.imagenUrl} alt={producto.nombre} />
      </div>
      <div className="info">
        <h3 className="nombre">{producto.nombre}</h3>
        <div className="detalles">
          <span className="categoria">{producto.categoria}</span>
          <span className="subcategoria">{producto.subcategoria}</span>
        </div>
        <p className="precio">${producto.precio.toLocaleString('es-CO')} COP</p>
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
