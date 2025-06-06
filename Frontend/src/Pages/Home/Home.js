import './Home.css';
import ProductCard from '../../components/ProductCard/ProductCard';
import ProductCarrusel from '../../components/ProductCarrusel/ProductCarrusel';
import HeroCarrusel from '../../components/HeroCarrusel/HeroCarrusel';
import ContactBanner from '../../components/ContactBanner/ContactBanner';

function Home() {
  const productos = [
    { id: 1, nombre: 'Figura Gato Rison', imagen: '/img/gato.jpg', precio: 30000 },
    { id: 2, nombre: 'Jarra Un poco de ruido 1L', imagen: '/img/jarra.jpg', precio: 35700 },
    { id: 3, nombre: 'Soporte Deadpool', imagen: '/img/deadpool.jpg', precio: 22000 },
    { id: 4, nombre: 'Soporte Stitch', imagen: '/img/stitch.jpg', precio: 27000 },
    { id: 5, nombre: 'Soporte Deadpool', imagen: '/img/deadpool.jpg', precio: 22000 },
    { id: 6, nombre: 'Soporte Stitch', imagen: '/img/stitch.jpg', precio: 27000 },
  ];

  return (
    <div className="home">
      <section className="hero">
        <HeroCarrusel />
      </section>
      {/* Carrusel de novedades */}
      <ProductCarrusel productos={productos} titulo="Novedades" />

      {/* Grid de artículos recientes */}
      <section className="destacados">
        <h2>Artículos Recientes</h2>
        <div className="grid">
          {productos.map((prod) => (
            <ProductCard key={prod.id} producto={prod} />
          ))}
        </div>
      </section>
      <ContactBanner />
    </div>
  );
}

export default Home;
