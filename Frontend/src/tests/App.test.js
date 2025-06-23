import { render, screen } from '@testing-library/react';
import App from '../App';
import '@testing-library/jest-dom';


describe('App', () => {
  beforeEach(() => {
    window.particlesJS = jest.fn();
  });

it('renderiza correctamente el componente Home por defecto', () => {
  window.history.pushState({}, '', '/');
  render(<App />);
  expect(
    screen.getByRole('heading', { name: /Conectamos\s*Contigo/i })
  ).toBeInTheDocument();
});


  it('renderiza correctamente la ruta /Diseño', () => {
    window.history.pushState({}, '', '/Diseño');
    render(<App />);
    expect(screen.getByText(/Página de diseño personalizada/i)).toBeInTheDocument();

  });

  it('renderiza correctamente la ruta /admin/catalogoDatabase', () => {
    window.history.pushState({}, '', '/admin/catalogoDatabase');
    render(<App />);
    expect(
      screen.getByText(/Agregar Nuevo Producto/i)
    ).toBeInTheDocument();
  });

  it('inicializa particlesJS una vez al montar', () => {
    render(<App />);
    expect(window.particlesJS).toHaveBeenCalledTimes(1);
  });
});
