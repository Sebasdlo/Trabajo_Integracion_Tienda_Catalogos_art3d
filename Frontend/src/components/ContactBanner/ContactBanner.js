import './ContactBanner.css';
import { FaWhatsapp} from 'react-icons/fa';

function ContactBanner() {
  return (
    <section className="contact-banner-wrapper">
      <div className="text-content">
        <h2>
          Conectamos <span>Contigo</span>
        </h2>
        <p>
          Este catálogo presenta figuras únicas hechas con impresión 3D en resina y filamento.
          Diseños personalizados con alta calidad y detalle para decoración, regalos o colección.
        </p>
        <a
          href="https://wa.me/573001234567"
          target="_blank"
          rel="noopener noreferrer"
          className="cta-button"
        >
          <FaWhatsapp /> Contáctanos
        </a>
      </div>

      <div className="text-content legal">
        <p>© 2025 3DCatalog — Todos los derechos reservados</p>
      </div>
    </section>
  );
}

export default ContactBanner;
