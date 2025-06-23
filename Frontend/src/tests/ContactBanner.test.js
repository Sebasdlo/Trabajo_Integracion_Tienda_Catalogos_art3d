import { render, screen } from '@testing-library/react';
import ContactBanner from '../components/ContactBanner/ContactBanner';
import '@testing-library/jest-dom';

describe('ContactBanner', () => {
  beforeEach(() => {
    render(<ContactBanner />);
  });

  it('muestra el título principal con palabra destacada', () => {
    expect(screen.getByText(/Conectamos/i)).toBeInTheDocument();
    expect(screen.getByText('Contigo')).toBeInTheDocument();
  });

  it('muestra la descripción del catálogo', () => {
    expect(screen.getByText(/Este catálogo presenta figuras únicas/i)).toBeInTheDocument();
  });

  it('tiene un botón de contacto que redirige a WhatsApp', () => {
    const contactLink = screen.getByRole('link', { name: /Contáctanos/i });
    expect(contactLink).toBeInTheDocument();
    expect(contactLink).toHaveAttribute('href', expect.stringContaining('wa.me'));
    expect(contactLink).toHaveAttribute('target', '_blank');
  });

  it('muestra el pie de página con derechos reservados', () => {
    expect(screen.getByText(/Todos los derechos reservados/i)).toBeInTheDocument();
  });
});
