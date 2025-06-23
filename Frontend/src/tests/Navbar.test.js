import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import '@testing-library/jest-dom';


describe('Navbar', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
  });

  it('muestra la información de contacto en la parte superior', () => {
    expect(screen.getByText(/ENTREGAS A DOMICILIO/i)).toBeInTheDocument();
    expect(screen.getByText(/305 7710162/i)).toBeInTheDocument();
  });

  it('muestra el logo con enlace a la ruta raíz', () => {
    const logo = screen.getByText('3DCatalog');
    expect(logo).toBeInTheDocument();
    expect(logo.closest('a')).toHaveAttribute('href', '/');
  });

  it('muestra el campo de búsqueda', () => {
    expect(screen.getByPlaceholderText('Buscar...')).toBeInTheDocument();
  });

  it('muestra el ícono de WhatsApp con enlace correcto', () => {
    const whatsappLink = screen.getByRole('link', { name: '' }); // no tiene texto visible
    expect(whatsappLink).toHaveAttribute('href', expect.stringContaining('wa.me'));
  });

  it('renderiza enlaces de navegación', () => {
    expect(screen.getByText('Inicio')).toHaveAttribute('href', '/');
    expect(screen.getByText('Productos')).toHaveAttribute('href', '/');
    expect(screen.getByText('Diseño')).toHaveAttribute('href', '/Diseño');
  });
});
