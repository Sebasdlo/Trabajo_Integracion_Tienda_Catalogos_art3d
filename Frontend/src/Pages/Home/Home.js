import { useEffect, useState } from 'react';
import './Home.css';
import ProductCard from '../../components/ProductCard/ProductCard';
import ProductCarrusel from '../../components/ProductCarrusel/ProductCarrusel';
import HeroCarrusel from '../../components/HeroCarrusel/HeroCarrusel';
import ContactBanner from '../../components/ContactBanner/ContactBanner';

function Home() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const API_URL = process.env.REACT_APP_API_URL;
        const res = await fetch(API_URL);
        const data = await res.json();

        const lista = Object.entries(data || {}).map(([id, val]) => ({
          id,
          nombre: val.nombre || 'Sin nombre',
          imagen: val.imagenUrl || '',
          precio: Number(val.precio || 0),
          categoria: val.categoria || '',
          subcategoria: val.subcategoria || '',
          createdAt: val.createdAt || '1970-01-01T00:00:00Z',
        }));

        const ordenados = lista.toSorted(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setProductos(ordenados);
      } catch (error) {
        console.error('Error al obtener productos:', error);
        setProductos([]);
      } finally {
        setLoading(false);
      }
    };

    obtenerProductos();
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <HeroCarrusel />
      </section>

      {!loading && productos.length > 0 && (
        <ProductCarrusel productos={productos.slice(0, 6)} titulo="Novedades" />
      )}

      <section className="destacados">
        <h2>Artículos Recientes</h2>
        <div className="grid">
          {productos.slice(0, 10).map((prod) => (
            <ProductCard
              key={prod.id}
              producto={prod}
            />
          ))}
        </div>
      </section>

      <ContactBanner />
    </div>
  );
}

export default Home;
