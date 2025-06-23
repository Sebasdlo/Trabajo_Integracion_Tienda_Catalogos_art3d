import { render, screen, fireEvent } from '@testing-library/react';
import HeroCarrusel from '../components/HeroCarrusel/HeroCarrusel';
import '@testing-library/jest-dom'; // Import necesario


// Mock imágenes
jest.mock('../components/img-banner/banner1.jpg', () => 'banner1.jpg');
jest.mock('../components/img-banner/banner2.jpg', () => 'banner2.jpg');
jest.mock('../components/img-banner/banner3.jpg', () => 'banner3.jpg');

jest.useFakeTimers();
import { act } from 'react-dom/test-utils'; // Necesario para manipular timers

describe('HeroCarrusel', () => {
  test('renderiza la imagen inicial (banner1)', () => {
    render(<HeroCarrusel />);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img.src).toContain('banner1.jpg');
  });

  test('avanza al siguiente banner con el botón derecho', () => {
    render(<HeroCarrusel />);
    const btnNext = screen.getByRole('button', { name: '›' });
    fireEvent.click(btnNext);
    const img = screen.getByRole('img');
    expect(img.src).toContain('banner2.jpg');
  });

  test('retrocede al banner anterior con el botón izquierdo', () => {
    render(<HeroCarrusel />);
    const btnPrev = screen.getByRole('button', { name: '‹' });
    fireEvent.click(btnPrev);
    const img = screen.getByRole('img');
    expect(img.src).toContain('banner3.jpg'); // ya que de 0 a -1 da vuelta al último
  });

  test('cambia automáticamente al siguiente banner después de 15 segundos', () => {
    render(<HeroCarrusel />);
    expect(screen.getByRole('img').src).toContain('banner1.jpg');

    act(() => {
      jest.advanceTimersByTime(15000); // Avanza tiempo para activar el setInterval
    });

    expect(screen.getByRole('img').src).toContain('banner2.jpg');
  });
});
