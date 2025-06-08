import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <header className="navbar">
      {/* Parte superior: contacto*/}
      <div className="top-bar">
        <div className="left-info">
          <span><strong>📍 ENTREGAS A DOMICILIO</strong> | <strong>LLÁMENOS</strong> 📞  305 7710162</span>
        </div>
      </div>

      {/* Medio: logo, buscador, redes */}
      <div className="middle-bar">
        <div className="logo">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>3DCatalog</Link>
        </div>
        <div className="search-wrapper">
        <input type="text" placeholder="Buscar..." />
        <button>
          <i className="fas fa-search"></i>
        </button>
  </div>
        <div className="right-icons">
        <a href="https://wa.me/123456789" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-whatsapp" style={{ color: '#25D366' }}></i>
        </a>
        </div>
      </div>

      {/* Inferior: navegación principal */}
      <nav className="main-nav">
        <Link to="/">Inicio</Link>
        <Link to="/">Productos</Link>
        <Link to="/Diseño">Diseño</Link>
      </nav>
    </header>
  );
}

export default Navbar;
