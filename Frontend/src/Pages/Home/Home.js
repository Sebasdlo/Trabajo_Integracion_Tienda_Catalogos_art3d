import React, { useState, useEffect } from 'react';

function App() {
  const [figuras, setFiguras] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => {
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setFiguras(data.figuras);
        setError(null);
      })
      .catch((err) => {
        console.error('Error:', err);
        setError(err.message);
      });
  }, []);

  const renderFiguras = () => {
    if (error) {
      return <p style={{ color: 'red' }}>Error: {error}</p>;
    } else if (figuras.length > 0) {
      return figuras.map((figura) => (
        <div key={figura.id}>
          <h3>{figura.nombre}</h3>
          <p>Precio: ${figura.precio}</p>
        </div>
      ));
    } else {
      return <p>Cargando figuras...</p>;
    }
  };

  return (
    <div className="App">
      <h1>Catálogo de Figuras 3D</h1>
      <p>Bienvenido a la tienda digital de impresión 3D.</p>
      {renderFiguras()}
    </div>
  );
}

export default App;
