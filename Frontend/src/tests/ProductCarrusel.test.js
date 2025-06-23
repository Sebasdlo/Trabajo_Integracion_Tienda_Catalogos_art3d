import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductCarrusel from '../components/ProductCarrusel/ProductCarrusel';

import '@testing-library/jest-dom';

// Productos de prueba
const mockProductos = [
  {
    imagen: 'img1.jpg',
    nombre: 'Producto 1',
    precio: 10000,
    categoria: 'Filamento',
    subcategoria: 'Juguetes',
  },
  {
    imagen: 'img2.jpg',
    nombre: 'Producto 2',
    precio: 20000,
    categoria: 'Filamento',
    subcategoria: 'Tazas',
  },
];

describe('ProductCarrusel', () => {
  beforeEach(() => {
    // Mock scrollBy en todos los elementos
    window.HTMLElement.prototype.scrollBy = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza el título correctamente', () => {
    render(<ProductCarrusel productos={mockProductos} titulo="Novedades" />);
    expect(screen.getByText('Novedades')).toBeInTheDocument();
  });

  test('renderiza todos los productos como imágenes', () => {
    render(<ProductCarrusel productos={mockProductos} titulo="Novedades" />);
    const imagenes = screen.getAllByRole('img');
    expect(imagenes.length).toBe(2);
  });

  test('renderiza los botones de navegación', () => {
    render(<ProductCarrusel productos={mockProductos} titulo="Novedades" />);
    expect(screen.getByText('<')).toBeInTheDocument();
    expect(screen.getByText('>')).toBeInTheDocument();
  });
test('desplaza productos al hacer clic en botón derecho', async () => {
  render(<ProductCarrusel productos={mockProductos} titulo="Novedades" />);
  fireEvent.click(screen.getByText('>'));

  await waitFor(() => {
    const productoPrimero = screen.getAllByText(/Producto/i)[0];
    expect(productoPrimero).toHaveTextContent('Producto 2');
  }, { timeout: 500 });
});

test('desplaza productos al hacer clic en botón izquierdo', async () => {
  render(<ProductCarrusel productos={mockProductos} titulo="Novedades" />);
  fireEvent.click(screen.getByText('<'));

  await waitFor(() => {
    const productoPrimero = screen.getAllByText(/Producto/i)[0];
    expect(productoPrimero).toHaveTextContent('Producto 2');
  }, { timeout: 500 });
});

});