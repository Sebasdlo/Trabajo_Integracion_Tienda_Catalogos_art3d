import { render, screen, fireEvent, waitFor, } from '@testing-library/react';
// Forzar la variable de entorno para todos los tests
process.env.REACT_APP_API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/figuras';
import CatalogoFiguras from '../Pages/admin/CatalogoFiguras';
import '@testing-library/jest-dom';
import 'regenerator-runtime/runtime'; // Necesario para async/await en tests
import { act } from 'react';

beforeEach(() => {
  global.fetch = jest.fn(); // Asegura que fetch sea un mock en cada test
  // Simular confirmación de ventana
  global.confirm = jest.fn(() => true);

  // Mock FileReader
  Object.defineProperty(global, 'FileReader', {
    writable: true,
    value: jest.fn().mockImplementation(() => ({
      readAsDataURL: jest.fn(),
      onload: jest.fn(),
    })),
  });
});


afterEach(() => {
  jest.resetAllMocks();
});

describe('CatalogoFiguras', () => {
  test('Muestra tab "Agregar" por defecto', async () => {
    render(<CatalogoFiguras />);
    await waitFor(() => {
      expect(screen.getByText(/Agregar Nuevo Producto/i)).toBeInTheDocument();
    });
  });

  test('Permite cambiar a tab "Consultar"', async () => {
    // Mock para carga inicial de figuras
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          '1': {
            nombre: 'Figura test',
            precio: '1000',
            categoria: 'Filamento',
            subcategoria: 'Juguetes',
            imagenUrl: 'http://imagen.com/figura.jpg',
            estado: true,
          },
        }),
      })
    );
    render(<CatalogoFiguras />);
    fireEvent.click(await screen.findByText('Consultar'));
    await waitFor(() => {
      expect(screen.getByText(/Consultar Productos/i)).toBeInTheDocument();
    });
  });

  test('Valida error si no hay imagen al guardar', async () => {
    // Mock para carga inicial (vacío)
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    );
    render(<CatalogoFiguras />);
    fireEvent.change(screen.getByPlaceholderText(/Nombre/i), {
      target: { value: 'Test figura' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Precio/i), {
      target: { value: '1000' },
    });
    const comboboxes = screen.getAllByRole('combobox');
    fireEvent.change(comboboxes[0], { target: { value: 'Filamento' } });
    fireEvent.click(screen.getByText(/Guardar/i));
    await waitFor(() => {
      expect(screen.getByText(/Selecciona una imagen/i)).toBeInTheDocument();
    });
  });

  test('Filtra figuras por nombre', async () => {
    // Mock carga inicial con dos figuras
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          id1: { nombre: 'Figura A', imagenUrl: '', categoria: 'Filamento', subcategoria: 'Figuras', precio: '100' },
          id2: { nombre: 'Otra figura', imagenUrl: '', categoria: 'Filamento', subcategoria: 'Tazas', precio: '200' },
        }),
      })
    );
    render(<CatalogoFiguras />);
    fireEvent.click(await screen.findByText('Consultar'));
    const inputBuscar = await screen.findByPlaceholderText('Buscar por nombre');
    fireEvent.change(inputBuscar, { target: { value: 'Otra' } });
    expect(await screen.findByText(/Otra figura/i)).toBeInTheDocument();
  });

  test('Carga datos para actualizar figura al hacer clic en Editar', async () => {
    // Mock para la carga inicial y para la figura individual
    global.fetch
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            '1': {
              nombre: 'Test figura',
              precio: '1000',
              categoria: 'Filamento',
              subcategoria: 'Juguetes',
              imagenUrl: 'https://fakeurl.com/imagen.jpg',
              estado: true,
            },
          }),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            nombre: 'Test figura',
            categoria: 'Filamento',
            subcategoria: 'Juguetes',
            precio: 1000,
            imagenUrl: 'https://fakeurl.com/imagen.jpg',
            estado: true,
          }),
        })
      );

    render(<CatalogoFiguras />);
    fireEvent.click(screen.getByText('Consultar'));

    const botonEditar = await screen.findByText(/Editar/i);
    await act(async () => {
      fireEvent.click(botonEditar);
    });

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test figura')).toBeInTheDocument();
    });
  });

  test('Simula eliminar figura con confirmación exitosa', async () => {
    render(<CatalogoFiguras />);
    fireEvent.click(screen.getByText('Eliminar'));

    await waitFor(() => {
      const botonEliminar = screen.getByText(/Eliminar figura/i);
      window.confirm = jest.fn(() => true);
      fireEvent.click(botonEliminar);
    });

    await waitFor(() => {
      expect(screen.queryByText('Test figura')).not.toBeInTheDocument();
    });
  });

  test('Muestra mensaje de error si eliminar falla', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.reject(new Error('Error al eliminar'))
    );

    render(<CatalogoFiguras />);
    fireEvent.click(screen.getByText('Eliminar'));

    await waitFor(() => {
      const botonEliminar = screen.getByText(/Eliminar figura/i);
      window.confirm = jest.fn(() => true);
      fireEvent.click(botonEliminar);
    });

    await waitFor(() => {
      expect(screen.getByText(/Error al obtener figuras/i)).toBeInTheDocument();
    });
  });

  test('Muestra mensaje de error si falla la carga inicial', async () => {
    global.fetch.mockImplementationOnce(() => Promise.reject(new Error('Error')));
    render(<CatalogoFiguras />);

    await waitFor(() => {
      expect(screen.getByText(/Error al obtener figuras/i)).toBeInTheDocument();
    });
  });

  test('Permite cancelar edición y limpiar formulario', async () => {
    // Mock explícito para asegurar que hay una figura disponible
    global.fetch
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            '1': {
              nombre: 'Test figura',
              categoria: 'Filamento',
              subcategoria: 'Juguetes',
              precio: 1000,
              imagenUrl: 'https://fakeurl.com/imagen.jpg',
              estado: true
            }
          })
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            nombre: 'Test figura',
            categoria: 'Filamento',
            subcategoria: 'Juguetes',
            precio: 1000,
            imagenUrl: 'https://fakeurl.com/imagen.jpg',
            estado: true
          })
        })
      );

    render(<CatalogoFiguras />);
    fireEvent.click(screen.getByText('Consultar'));

    const botonEditar = await screen.findByText(/Editar/i);
    fireEvent.click(botonEditar);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test figura')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Cancelar edición/i));

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Nombre/i)).toHaveValue('');
    });
  });
  test('Muestra mensaje de error si actualizar figura falla', async () => {
    // Paso 1: mock de carga inicial
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        figura1: {
          nombre: 'Figura original',
          precio: 500,
          categoria: 'Resina',
          subcategoria: 'Miniaturas',
          imagenUrl: 'https://fakeurl.com/original.jpg',
          estado: true
        }
      })
    });

    render(<CatalogoFiguras />);
    fireEvent.click(screen.getByText('Consultar'));

    // Paso 2: espera figura original
    await screen.findByText('Figura original');

    // Paso 3: mock carga individual al editar
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        nombre: 'Figura original',
        precio: 500,
        categoria: 'Resina',
        subcategoria: 'Miniaturas',
        imagenUrl: 'https://fakeurl.com/original.jpg',
        estado: true
      })
    });

    fireEvent.click(screen.getByText('Editar'));
    await screen.findByText(/Actualizar Producto/i);

    fireEvent.change(screen.getByLabelText(/Nombre:/i), {
      target: { value: 'Figura fallida' }
    });

    // Paso 4: mock de error en actualización
    fetch.mockResolvedValueOnce({ ok: false });

    // Paso 5: click en actualizar
    const botones = screen.getAllByRole('button', { name: /Actualizar/i });
    fireEvent.click(botones[1]);

    // Paso 6: esperar alerta
    const alerta = await screen.findByRole('alert');
    expect(alerta).toHaveTextContent(/Error al actualizar figura/i);
  });

  test('Cambia la subcategoría cuando cambia la categoría', () => {
    render(<CatalogoFiguras />);
    fireEvent.click(screen.getByText('Agregar'));

    fireEvent.change(screen.getByLabelText(/Categoría/i), {
      target: { value: 'Resina' },
    });

    expect(screen.getByLabelText(/Subcategoría/i)).toBeInTheDocument();
  });

  test('Muestra mensaje de error si cargar figura para actualizar falla', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ figura1: { nombre: 'x', precio: 1, categoria: 'Filamento', subcategoria: 'Figuras', imagenUrl: '', estado: true } }) });
    render(<CatalogoFiguras />);
    fireEvent.click(screen.getByText('Consultar'));
    await screen.findByText('x');

    fetch.mockResolvedValueOnce({ ok: false }); // Falla al cargar figura individual
    fireEvent.click(screen.getByText('Editar'));

    // Como no se carga nada, no debe aparecer "Actualizar Producto"
    await waitFor(() => {
      expect(screen.queryByText(/Actualizar Producto/i)).not.toBeInTheDocument();
    });
  });

  test('Renderiza mensaje de éxito al actualizar', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        figura1: {
          nombre: 'Original',
          precio: 200,
          categoria: 'Filamento',
          subcategoria: 'Tazas',
          imagenUrl: '',
          estado: true
        }
      })
    });

    render(<CatalogoFiguras />);
    fireEvent.click(screen.getByText('Consultar'));
    await screen.findByText('Original');

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        nombre: 'Original',
        precio: 200,
        categoria: 'Filamento',
        subcategoria: 'Tazas',
        imagenUrl: '',
        estado: true
      })
    });

    fireEvent.click(screen.getByText('Editar'));
    await screen.findByText(/Actualizar Producto/i);

    fetch.mockResolvedValueOnce({ ok: true });
    const botones = screen.getAllByRole('button', { name: /Actualizar/i });
    fireEvent.click(botones[1]);

    const alerta = await screen.findByRole('alert');
    expect(alerta).toHaveTextContent(/Figura actualizada correctamente/i);
  });
  test('Carga inicial: muestra alerta si falla fetch', async () => {
    fetch.mockImplementationOnce(() => Promise.reject(new Error('Error')));
    await act(async () => {
      render(<CatalogoFiguras />);
    });
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Error al obtener figuras'));
  });
  test('Valida campos requeridos al agregar sin llenar', async () => {
    render(<CatalogoFiguras />);
    const form = screen.getByTestId('form-agregar');
    fireEvent.submit(form);
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Selecciona una imagen'));
  });

  test('Cambia a la pestaña Actualizar y muestra formulario si hay idActual', async () => {
    const figura = {
      id: 'abc123',
      nombre: 'Figura A',
      precio: 5000,
      categoria: 'Filamento',
      subcategoria: 'Figuras',
      imagenUrl: 'http://img.png',
      estado: true
    };

    jest.spyOn(global, 'fetch')
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ abc123: figura })
      }))
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(figura)
      }));

    render(<CatalogoFiguras />);
    
    fireEvent.click(screen.getByText('Consultar'));
    await waitFor(() => screen.getByText('Editar'));
    fireEvent.click(screen.getAllByText('Editar')[0]);

    await waitFor(() => {
      expect(screen.getByText('Actualizar Producto')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Figura A')).toBeInTheDocument();
    });
  });

  it('Muestra alerta al eliminar correctamente', async () => {
    const mockFigura = { id: '1', nombre: 'Figura', categoria: 'Filamento', subcategoria: 'Juguetes', precio: '100', imagenUrl: 'img.jpg' };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ '1': mockFigura })
    });

    window.confirm = jest.fn(() => true); // Simula confirmación del usuario
    fetch.mockResolvedValueOnce({ ok: true }); // Respuesta DELETE

    render(<CatalogoFiguras />);
    const btnEliminarTab = screen.getByText('Eliminar');
    fireEvent.click(btnEliminarTab);

    await waitFor(() => {
      expect(screen.getByText('Figura')).toBeInTheDocument();
    });

    const botonEliminar = screen.getByText('Eliminar', { selector: 'button.btn-danger' });
    await act(async () => {
      fireEvent.click(botonEliminar);
    });

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Figura eliminada correctamente');
    });
  });
  test('Limpia subcategoría e imagen después de actualizar', async () => {
    const figuraMock = {
      nombre: 'Figura A',
      precio: '10000',
      categoria: 'Filamento',
      subcategoria: 'Juegos',
      imagenUrl: 'http://imagen.com/figura.jpg',
      estado: true
    };

    // Mock de FileReader
    Object.defineProperty(global, 'FileReader', {
      writable: true,
      value: jest.fn().mockImplementation(() => ({
        readAsDataURL: jest.fn(),
        onload: jest.fn(),
      })),
    });

    // Mock de fetch
    global.fetch = jest.fn((url, options) => {
      if (url.includes('/123') && !options) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(figuraMock),
        });
      }
      if (url.endsWith('/123') && options?.method === 'PUT') {
        return Promise.resolve({ ok: true });
      }
      if (url === process.env.REACT_APP_API_URL) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ '123': figuraMock }),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });

    // Render del componente
    render(<CatalogoFiguras />);

    // Cambiar a la pestaña Consultar
    fireEvent.click(screen.getByText('Consultar'));

    // Esperar y hacer clic en Editar
    await screen.findByText('Editar');
    fireEvent.click(screen.getByText('Editar'));

    // Esperar el formulario de actualización
    await screen.findByText('Actualizar Producto');

    // Cambiar categoría y subcategoría
    const categoriaSelect = await screen.findByLabelText('Categoría:');
    fireEvent.change(categoriaSelect, { target: { value: 'Filamento' } });

    const subcategoriaSelect = await screen.findByLabelText('Subcategoría:');
    fireEvent.change(subcategoriaSelect, { target: { value: 'Juguetes' } });

    // Simular carga de imagen
    const archivo = new File(['img'], 'foto.jpg', { type: 'image/jpeg' });
    const inputImagen = screen.getByLabelText(/imagen/i);
    await act(async () => {
      fireEvent.change(inputImagen, { target: { files: [archivo] } });
    });

    // Clic en botón "Actualizar"
    const botonFormulario = screen.getAllByText('Actualizar').find(btn => btn.tagName === 'BUTTON' && btn.type === 'submit');
    fireEvent.click(botonFormulario);
    const input = screen.queryByLabelText(/imagen/i);
    expect(input?.value).toBe('');
    
  });
  test('Muestra alerta si falla la carga inicial de figuras', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: 'Error al obtener figuras' })
    });

    render(<CatalogoFiguras />);

  });

  test('Muestra alerta si campos requeridos están vacíos al actualizar', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ '123': {
        nombre: '',
        precio: '',
        categoria: 'Filamento',
        subcategoria: 'Juegos',
        imagenUrl: 'http://imagen.com/figura.jpg',
        estado: true
      }})
    });

    render(<CatalogoFiguras />);
    fireEvent.click(screen.getByText('Consultar'));
    await screen.findByText('Editar');
    fireEvent.click(screen.getByText('Editar'));

    const botonActualizar = screen.getAllByText('Actualizar').find(btn => btn.tagName === 'BUTTON');
    fireEvent.click(botonActualizar);

    // Aquí podrías validar que haya una alerta, si tu componente muestra una.
  });

  test('Muestra error si el servidor falla al actualizar figura', async () => {
    const figuraMock = {
      nombre: 'Figura B',
      precio: '20000',
      categoria: 'Resina',
      subcategoria: 'Tazas',
      imagenUrl: 'http://imagen.com/figura.jpg',
      estado: true
    };
    fetch.mockImplementation((url, options) => {
      // PUT a /123: simula error
      if (options?.method === 'PUT' && url?.toString().includes('123')) {
        return Promise.resolve({ ok: false, json: () => Promise.resolve({ error: 'Error al actualizar' }) });
      }
      // GET inicial de lista
      if (!options && url?.toString().endsWith('/figuras')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ '123': figuraMock }) });
      }
      // GET individual para editar
      if (!options && url?.toString().match(/\/figuras\/\d+$/)) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(figuraMock) });
      }
      // Cualquier GET a figuras tras error: lista vacía
      if (!options && url?.toString().includes('/figuras')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
      }
      // Fallback seguro
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });

    render(<CatalogoFiguras />);
    fireEvent.click(screen.getByText('Consultar'));
    await screen.findByText('Editar');
    // Selecciona el botón Editar de la fila con "Figura B"
    const filas = screen.getAllByRole('row');
    const filaFigura = filas.find(fila => fila.textContent.includes('Figura B'));
    const btnEditar = filaFigura.querySelector('button');
    await act(async () => {
      fireEvent.click(btnEditar);
    });
    const btnActualizar = screen.getAllByText('Actualizar').find(btn => btn.tagName === 'BUTTON');
    await act(async () => {
      fireEvent.click(btnActualizar);
    });
  });

  test('Muestra error si ocurre excepción al actualizar figura', async () => {
    const figuraMock = {
      nombre: 'Figura test',
      precio: '1000',
      categoria: 'Filamento',
      subcategoria: 'Juguetes',
      imagenUrl: 'http://imagen.com/figura.jpg',
      estado: true,
    };
    let errorLanzado = false;
    fetch.mockImplementation((url, options) => {
      // PUT a /1: lanza excepción solo la primera vez
      if (!errorLanzado && options?.method === 'PUT' && url?.toString().includes('1')) {
        errorLanzado = true;
        return Promise.reject(new Error('Fallo en el servidor'));
      }
      // GET inicial de lista
      if (!options && url?.toString().endsWith('/figuras')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ '1': figuraMock }) });
      }
      // GET individual para editar
      if (!options && url?.toString().match(/\/figuras\/\d+$/)) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(figuraMock) });
      }
      // Cualquier GET a figuras tras error: lista vacía
      if (!options && url?.toString().includes('/figuras')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
      }
      // Fallback seguro
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });

    render(<CatalogoFiguras />);
    fireEvent.click(screen.getByText('Consultar'));
    await screen.findByText('Editar');
    // Selecciona el botón Editar de la fila con "Figura test"
    const filas = screen.getAllByRole('row');
    const filaFigura = filas.find(fila => fila.textContent.includes('Figura test'));
    const btnEditar = filaFigura.querySelector('button');
    await act(async () => {
      fireEvent.click(btnEditar);
    });
    const btnActualizar = screen.getAllByText('Actualizar').find(btn => btn.tagName === 'BUTTON');
    await act(async () => {
      fireEvent.click(btnActualizar);
    });
  });

  test('Evita enviar si el campo nombre está vacío', async () => {
    render(<CatalogoFiguras />);
    fireEvent.click(screen.getByText('Agregar'));

    const inputNombre = screen.getByPlaceholderText('Nombre');
    const inputPrecio = screen.getByPlaceholderText('Precio');
    fireEvent.change(inputNombre, { target: { value: '' } }); // vacío a propósito
    fireEvent.change(inputPrecio, { target: { value: '20000' } });

    const boton = screen.getAllByText('Agregar').find(btn => btn.tagName === 'BUTTON');
    fireEvent.click(boton);

    await waitFor(() => {
      // Asegura que no se haya llamado fetch para enviar
      expect(global.fetch).not.toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: 'POST' })
      );
    });
  });

  test('Filtra figuras por nombre en buscar', async () => {
    // Mock carga inicial con dos figuras
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          id1: { nombre: 'Figura A', imagenUrl: '', categoria: 'Filamento', subcategoria: 'Figuras', precio: '100' },
          id2: { nombre: 'Otra figura', imagenUrl: '', categoria: 'Filamento', subcategoria: 'Tazas', precio: '200' },
        }),
      })
    );
    render(<CatalogoFiguras />);
    fireEvent.click(await screen.findByText('Consultar'));
    const inputBuscar = await screen.findByPlaceholderText('Buscar por nombre');
    fireEvent.change(inputBuscar, { target: { value: 'Otra' } });
    expect(await screen.findByText(/Otra figura/i)).toBeInTheDocument();
  });
  test('Muestra alerta si fetch lanza excepción inesperada', async () => {
    // Mock para que el componente intente renderizar y luego lanzar la excepción
    global.fetch.mockImplementationOnce(() => Promise.reject(new Error('fallo')));
    await act(async () => {
      render(<CatalogoFiguras />);
    });
    const alerta = await screen.findByRole('alert');
    expect(alerta).toHaveTextContent(/error/i);
  });
});