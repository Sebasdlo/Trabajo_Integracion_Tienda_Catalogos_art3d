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
        const API_URL = process.env.REACT_APP_API_URL; // Ajusta tu API URL
        const res = await fetch(API_URL);
        const data = await res.json();
        const lista = Object.entries(data || {}).map(([id, val]) => ({
          id,
          ...val,
          imagen: val.imagenUrl,
          precio: Number(val.precio),
        }));
        setProductos(lista);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener productos:', error);
        setProductos([]);
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
        <ProductCarrusel productos={productos.slice(-6)} titulo="Novedades" />
      )}
      <section className="destacados">
        <h2>Artículos Recientes</h2>
        <div className="grid">
          {productos.map((prod) => (
            <ProductCard
              key={prod.id}
              producto={{
                imagen: prod.imagen,
                nombre: prod.nombre,
                precio: prod.precio,
                categoria: prod.categoria,
                subcategoria: prod.subcategoria,
              }}
            />
          ))}
        </div>
      </section>

      <ContactBanner />
    </div>
  );
}

export default Home;
