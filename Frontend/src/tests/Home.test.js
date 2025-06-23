import { render, screen, waitFor } from '@testing-library/react';
import Home from '../Pages/Home/Home';
import React from 'react';
import '@testing-library/jest-dom';

// Mocks de componentes hijos
jest.mock('../components/HeroCarrusel/HeroCarrusel', () => () => <div data-testid="hero-carrusel">HeroCarrusel</div>);
jest.mock('../components/ContactBanner/ContactBanner', () => () => <div data-testid="contact-banner">Contacto</div>);

jest.mock('../components/ProductCarrusel/ProductCarrusel', () => () => (
  <div data-testid="product-carrusel">Carrusel Mock</div>
));

jest.mock('../components/ProductCard/ProductCard', () => () => (
  <div data-testid="product-card">Card Mock</div>
));

describe('Componente Home', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        id1: {
          nombre: 'Producto 1',
          precio: '10000',
          imagenUrl: 'url1',
          categoria: 'Resina',
          subcategoria: 'Llaveros',
        },
        id2: {
          nombre: 'Producto 2',
          precio: '15000',
          imagenUrl: 'url2',
          categoria: 'Filamento',
          subcategoria: 'Figuras',
        }
      })
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renderiza correctamente los componentes principales', async () => {
    render(<Home />);
    await waitFor(() => {
      expect(screen.getByTestId('hero-carrusel')).toBeInTheDocument();
      expect(screen.getByTestId('product-carrusel')).toBeInTheDocument();
      expect(screen.getAllByTestId('product-card').length).toBe(2);
      expect(screen.getByTestId('contact-banner')).toBeInTheDocument();
    });
  });

  test('maneja correctamente errores de fetch', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Error al cargar'));
    render(<Home />);
    await waitFor(() => {
      expect(screen.getByTestId('hero-carrusel')).toBeInTheDocument();
      expect(screen.getByTestId('contact-banner')).toBeInTheDocument();
      expect(screen.queryByTestId('product-carrusel')).not.toBeInTheDocument();
      expect(screen.queryByTestId('product-card')).not.toBeInTheDocument();
    });
  });
});
