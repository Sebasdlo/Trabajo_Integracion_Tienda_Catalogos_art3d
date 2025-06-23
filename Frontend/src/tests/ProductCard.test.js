// Importa herramientas de pruebas
import { render, screen } from '@testing-library/react';
// Importa el componente que vamos a probar
import ProductCard from '../components/ProductCard/ProductCard';
import '@testing-library/jest-dom';


// Describe un grupo de pruebas para el componente ProductCard
describe('ProductCard', () => {
  // Datos simulados que usaremos para las pruebas
  const productoMock = {
    imagen: 'https://fakeurl.com/img.jpg',
    nombre: 'Figura decorativa',
    precio: 15000,
    categoria: 'Resina',
    subcategoria: 'Miniaturas',
  };

  // Prueba que se rendericen correctamente todos los datos
  test('renderiza correctamente los datos del producto', () => {
    // Renderiza el componente con el mock
    render(<ProductCard producto={productoMock} />);

    // Verifica que la imagen tenga el src y alt correctos
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', productoMock.imagen);
    expect(img).toHaveAttribute('alt', productoMock.nombre);

    // Verifica que el texto aparezca en el DOM
    expect(screen.getByText('Figura decorativa')).toBeInTheDocument();
    expect(screen.getByText('Resina')).toBeInTheDocument();
    expect(screen.getByText('Miniaturas')).toBeInTheDocument();
    expect(screen.getByText('$15.000 COP')).toBeInTheDocument(); // formato correcto
  });

  // Prueba que si vienen dos propiedades de imagen, use 'imagen' por encima de 'imagenUrl'
  test('usa imagen si ambas imagen e imagenUrl están presentes', () => {
    // Creamos un mock que tiene ambas propiedades
    const productoConAmbas = {
      ...productoMock,
      imagen: 'img1.jpg',
      imagenUrl: 'img2.jpg',
    };

    // Renderizamos con ambas imágenes
    render(<ProductCard producto={productoConAmbas} />);

    // Esperamos que se haya usado la imagen principal ('imagen')
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'img1.jpg');
  });
});
