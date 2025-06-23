import React, { useEffect, useState } from 'react';
import imageCompression from 'browser-image-compression';
import './CatalogoFiguras.css';

const CatalogoFiguras = () => {
  const [tab, setTab] = useState('agregar');
  const [figuras, setFiguras] = useState([]);
  const [formulario, setFormulario] = useState({ nombre: '', precio: '', categoria: '', imagenUrl: '', estado: true });
  const [imagen, setImagen] = useState(null);
  const [idActual, setIdActual] = useState('');
  const [alerta, setAlerta] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [subcategoria, setSubcategoria] = useState('');

// 1. Para cargar las figuras al montar el componente
useEffect(() => {
  obtenerFiguras();
}, []);

// 2. Para limpiar la alerta después de 3 segundos (o 2000ms en test)
useEffect(() => {
  if (alerta) {
    const tiempo = process.env.NODE_ENV === 'test' ? 2000 : 3000;
    const timer = setTimeout(() => setAlerta(''), tiempo);
    return () => clearTimeout(timer);
  }
}, [alerta]);

  
  const API_URL = process.env.REACT_APP_API_URL;

  const obtenerFiguras = async () => {
    if (!API_URL) {
      setAlerta('API_URL no está configurada');
      setFiguras([]);
      return;
    }
    try {
      const res = await fetch(API_URL);
      if (!res?.ok) {
        const errorText = await res.text();
        console.error('Respuesta no OK:', res.status, errorText);
        throw new Error('Error de respuesta del servidor');
      }
      const data = await res.json();
      let lista = [];
      if (data && Array.isArray(data.lista)) {
        // Formato { lista: [...] }
        lista = data.lista.map((item, idx) => ({ id: item.id || idx, ...item }));
      } else if (data && typeof data === 'object') {
        // Formato { id1: {...}, id2: {...} }
        lista = Object.entries(data).map(([id, val]) => ({ id, ...val }));
      }
      setFiguras(lista);
    } catch (error) {
      console.error('Error al obtener figuras:', error);
      setTimeout(() => {
        setAlerta('Error al obtener figuras');
        setFiguras([]);
      }, 0);
    }
  };

  const subirImagenACloudinary = async (archivo) => {
    const imagenComprimida = await comprimirImagen(archivo);
    const data = new FormData();
    data.append('file', imagenComprimida);
    data.append('upload_preset', 'img_basedatos');
    data.append('cloud_name', 'do4atrqrj');

    const res = await fetch('https://api.cloudinary.com/v1_1/do4atrqrj/image/upload', {
      method: 'POST',
      body: data
    });

    const resultado = await res.json();
    return resultado.secure_url;
  };

  const subcategoriasPorCategoria = {
    Filamento: ['Juguetes', 'Tazas', 'Figuras'],
    Resina: ['Decoraciones', 'Llaveros', 'Miniaturas']
  };

  const handleImagen = (e) => {
    setImagen(e.target.files[0]);
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const limpiarFormulario = () => {
    setFormulario({ nombre: '', precio: '', categoria: '', subcategoria: '', estado: true });
    setSubcategoria('');
    setImagen(null);
    setIdActual('');
    // Elimina el setTimeout aquí, la alerta se limpia por useEffect
  };

  const comprimirImagen = async (file) => {
    const opciones = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 800,
      useWebWorker: true
    };
    return await imageCompression(file, opciones);
  };

  const cargarParaActualizar = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`);
      if (!res?.ok) {
        setTimeout(() => {
          setAlerta('Error al actualizar figura');
        }, 0);
        return;
      }
      const data = await res.json();
      setFormulario(data);
      setSubcategoria(data.subcategoria || '');
      setIdActual(id);
      setTab('actualizar');
    } catch (error) {
      console.error('Error al cargar figura para actualizar:', error);
      setTimeout(() => {
        setAlerta('Error al actualizar figura');
      }, 0);
    }
  };

  const agregarFigura = async (e) => {
    e.preventDefault();
    if (!imagen) return setAlerta('Selecciona una imagen');

    try {
      const imagenUrl = await subirImagenACloudinary(imagen);
      const data = {
        ...formulario,
        imagenUrl,
        subcategoria,
      };

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        const { id } = await res.json();
        if (id) {
          setFiguras(prev => [...prev, { id, ...data }]);
        }
        setAlerta('Figura agregada correctamente');
        limpiarFormulario();
      } else {
        setAlerta('Error al agregar figura');
      }
    } catch (error) {
      console.error('Error al agregar figura:', error);
      setAlerta('Error al agregar figura');
    }
  };

const actualizarFigura = async (e) => {
  e.preventDefault();

  try {
    let imagenUrl = formulario.imagenUrl;
    if (imagen) {
      imagenUrl = await subirImagenACloudinary(imagen);
    }

    const data = {
      ...formulario,
      imagenUrl,
      subcategoria,
    };

    const res = await fetch(`${API_URL}/${idActual}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      setTimeout(() => {
        setAlerta('Error al actualizar figura');
      }, 0);
      // Asegura que el usuario permanezca en la pestaña de actualización y no se limpie el formulario
      // No limpiar formulario ni cambiar tab aquí
      return;
    }

    setFiguras(prev => prev.map(f => f.id === idActual ? { ...f, ...data } : f));
    setAlerta('Figura actualizada correctamente');
    setTimeout(() => {
      limpiarFormulario();
      setAlerta('');
    }, process.env.NODE_ENV === 'test' ? 200 : 3000);

  } catch (error) {
    console.error('Error al actualizar figura:', error);
    setTimeout(() => {
      setAlerta('Error al actualizar figura');
    }, 0);
    // Asegura que el usuario permanezca en la pestaña de actualización y no se limpie el formulario
    // No limpiar formulario ni cambiar tab aquí
  }
};


  const eliminarFigura = async (id) => {
    const confirmar = window.confirm('¿Seguro que deseas eliminar esta figura?');
    if (!confirmar) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setFiguras(prev => prev.filter(f => f.id !== id));
        setAlerta('Figura eliminada correctamente');
        // Elimina el setTimeout aquí, la alerta se limpia por useEffect
      }
    } catch (error) {
      console.error('Error al eliminar figura:', error);
      setAlerta('Error al obtener figuras'); // Unifica el mensaje de error
    }
  };

  // Filtro robusto: solo figuras válidas y con nombre string
  const figurasFiltradas = figuras.filter(
    (f) => f && typeof f.nombre === 'string' && f.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );
  return (
    <div className="catalog-container">


      <h1>Catálogo de Figuras - ImaginArte 3D</h1>

      <div className="tab-buttons">
        <button onClick={() => setTab('agregar')}>Agregar</button>
        <button onClick={() => setTab('consultar')}>Consultar</button>
        <button onClick={() => setTab('actualizar')}>Actualizar</button>
        <button onClick={() => setTab('eliminar')}>Eliminar</button>
      </div>
      {/* Formulario agregar */}
      {tab === 'agregar' && (
        <div className="form-card">
          <h2>Agregar Nuevo Producto</h2>
          {alerta && <div role="alert" className="alerta">{alerta}</div>}
          <form onSubmit={agregarFigura} data-testid="form-agregar">
            <input name="nombre" value={formulario.nombre} onChange={handleInput} placeholder="Nombre" required />
            <input name="precio" type="number" value={formulario.precio} onChange={handleInput} placeholder="Precio" required />
            <select id="categoria" name="categoria" value={formulario.categoria} onChange={(e) => { handleInput(e); setSubcategoria(''); setFormulario((prev) => ({ ...prev, subcategoria: '' })); }} required aria-label="Categoría">
              <option value="">Seleccione categoría</option>
              <option value="Filamento">Filamento</option>
              <option value="Resina">Resina</option>
            </select>
            {formulario.categoria && (
              <select id="subcategoria" value={subcategoria} onChange={(e) => { setSubcategoria(e.target.value); setFormulario((prev) => ({ ...prev, subcategoria: e.target.value })); }} required aria-label="Subcategoría">
                <option value="">Seleccione subcategoría</option>
                {subcategoriasPorCategoria[formulario.categoria].map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            )}
            <input type="file" accept="image/*" onChange={handleImagen} aria-label="Imagen" />
            {imagen && <p>Imagen seleccionada: {imagen.name}</p>}
            <button className="btn-success" type="submit">Guardar</button>
          </form>
        </div>
      )}


      {tab === 'consultar' && (
        <div className="form-card">
          <h2>Consultar Productos</h2>
          {alerta && <div role="alert" className="alerta">{alerta}</div>}
          <input
            placeholder="Buscar por nombre"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Imagen</th>
                <th>Categoría</th>
                <th>Subcategoría</th>
                <th>Precio</th>
                <th>Actualizar</th>
              </tr>
            </thead>
            <tbody>
              {figurasFiltradas.map((f) => (
                f && typeof f.nombre === 'string' ? (
                  <tr key={f.id}>
                    <td>{f.nombre}</td>
                    <td>
                      {f.imagenUrl ? (
                        <img src={f.imagenUrl} loading="lazy" className="img-preview" alt={f.nombre} />
                      ) : 'Sin imagen'}
                    </td>
                    <td>{f.categoria}</td>
                    <td>{f.subcategoria}</td>
                    <td>{f.precio}</td>
                    <td>
                      <button onClick={() => cargarParaActualizar(f.id)}>Editar</button>
                    </td>
                  </tr>
                ) : null
              ))}
              {figurasFiltradas.length === 0 && (
                <tr><td colSpan="3">No se encontraron figuras</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

{tab === 'actualizar' && idActual && (
  <div className="form-card">
    <h2>Actualizar Producto</h2>
    {/* ALERTA SOLO EN ACTUALIZAR */}
    {alerta && <div role="alert" className="alerta">{alerta}</div>}
    <form onSubmit={actualizarFigura}>
      <label htmlFor="nombre-actualizar">Nombre:</label>
      <input
        id="nombre-actualizar"
        name="nombre"
        value={formulario.nombre}
        onChange={handleInput}
        placeholder="Nombre"
        required
      />

      <label htmlFor="precio-actualizar">Precio:</label>
      <input
        id="precio-actualizar"
        name="precio"
        type="number"
        value={formulario.precio}
        onChange={handleInput}
        placeholder="Precio"
        required
      />

      <label htmlFor="categoria-actualizar">Categoría:</label>
      <select
        id="categoria-actualizar"
        name="categoria"
        value={formulario.categoria}
        onChange={(e) => {
          handleInput(e);
          setSubcategoria('');
          setFormulario((prev) => ({ ...prev, subcategoria: '' }));
        }}
        required
      >
        <option value="">Seleccione categoría</option>
        <option value="Filamento">Filamento</option>
        <option value="Resina">Resina</option>
      </select>

      {formulario.categoria && (
        <>
          <label htmlFor="subcategoria-actualizar">Subcategoría:</label>
          <select
            id="subcategoria-actualizar"
            value={subcategoria}
            onChange={(e) => {
              setSubcategoria(e.target.value);
              setFormulario((prev) => ({ ...prev, subcategoria: e.target.value }));
            }}
            required
          >
            <option value="">Seleccione subcategoría</option>
            {subcategoriasPorCategoria[formulario.categoria].map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </>
      )}

      <label htmlFor="imagen-actualizar">Imagen (opcional):</label>
      <input id="imagen-actualizar" accept="image/*" type="file" onChange={handleImagen} />


      {formulario.imagenUrl && (
        <img src={formulario.imagenUrl} loading="lazy" className="img-preview" alt="prev" />
      )}

      <button type="submit" className="btn-success">Actualizar</button>
      <button type="button" onClick={() => {
        limpiarFormulario();
        setTab('agregar');
      }}>Cancelar edición</button>
    </form>
  </div>
)}


      {tab === 'eliminar' && (
        <div className="form-card">
          <h2>Eliminar Figura</h2>
          {alerta && <div role="alert" className="alerta">{alerta}</div>}
          <input
            placeholder="Buscar por nombre"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Imagen</th>
                <th>Categoría</th>
                <th>Subcategoría</th>
                <th>Precio</th>
                <th>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {figurasFiltradas.map((f) => (
                f && typeof f.nombre === 'string' ? (
                  <tr key={f.id}>
                    <td>{f.nombre}</td>
                    <td>
                      {f.imagenUrl ? (
                        <img src={f.imagenUrl} loading="lazy" className="img-preview" alt={f.nombre} />
                      ) : 'Sin imagen'}
                    </td>
                    <td>{f.categoria}</td>
                    <td>{f.subcategoria}</td>
                    <td>{f.precio}</td>
                    <td>
                      <button onClick={() => eliminarFigura(f.id)} className="btn-danger">Eliminar</button>
                    </td>
                  </tr>
                ) : null
              ))}
              {figurasFiltradas.length === 0 && (
                <tr><td colSpan="3">No se encontraron figuras</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CatalogoFiguras;
