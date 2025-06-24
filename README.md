[![CI](https://github.com/Sebasdlo/Trabajo_Integracion_Tienda_Catalogos_art3d/actions/workflows/ci.yml/badge.svg)](https://github.com/Sebasdlo/Trabajo_Integracion_Tienda_Catalogos_art3d/actions)
[![codecov](https://codecov.io/gh/Sebasdlo/Trabajo_Integracion_Tienda_Catalogos_art3d/branch/main/graph/badge.svg)](https://codecov.io/gh/Sebasdlo/Trabajo_Integracion_Tienda_Catalogos_art3d)

# Trabajo_Integracion_Tienda_Catalogos_art3d

## Descripción

Plataforma web para la administración y visualización de catálogos de productos art3d. Permite a los administradores gestionar productos de forma sencilla y a los usuarios explorar el catálogo mediante una interfaz moderna, responsiva y fácil de usar. El proyecto está preparado para ser desplegado fácilmente en cualquier entorno gracias al uso de Docker y cuenta con integración continua y pruebas automatizadas.

## ¿Qué incluye este proyecto?

- Backend en Python (Flask) con integración a Firebase y Cloudinary
- Frontend en React con interfaz moderna y responsiva
- Sección administrativa para gestión de productos (CRUD)
- Visualización de catálogos de productos art3d
- Dockerización de backend y frontend para despliegue sencillo
- Pruebas automatizadas para ambos módulos
- Pipeline de CI/CD integrado
- CI con GitHub Actions y Jenkins
- Reportes de cobertura en Codecov

## Estructura del repositorio
```
├── Backend/           # API REST en Python (Flask)
│   ├── app.py         # Punto de entrada del backend
│   ├── firebase_service.py  # Integración con Firebase
│   ├── Dockerfile            # Imagen Docker del backend
│   ├── Requirements.txt     # Dependencias del backend
│   └── test/          # Pruebas unitarias del backend
├── Frontend/          # Aplicación web en React
│   ├── src/           # Código fuente del frontend
│   │   ├── components/    # Componentes reutilizables (Navbar, Carruseles, Tarjetas, Banners)
│   │   ├── Pages/         # Páginas principales (Home, Productos, Diseño, Admin)
│   │   └── tests/         # Pruebas unitarias de componentes y páginas
│   ├── public/        # Archivos públicos
│   ├── tests/         # Pruebas unitarias del frontend
│   ├── package.json          # Dependencias del frontend
│   ├── Dockerfile            # Imagen Docker del frontend
│   ├── nginx.conf            # Configuración de Nginx para producción
│   ├── .env                  # Variables de entorno para los contrenedores
│   └── .env.development      # Variables de entorno para desarrollo 
├── .codecov.yml              # Configuración de Codecov
├── .gitignore                # Exclusiones de Git
├── Jenkinsfile               # Pipeline de CI/CD para Jenkins
├── README.md                 # Este archivo
├── docker-compose.yml        # Orquestación de contenedores
```

## Instalación y ejecución local

### Backend (Python)
1. Ve a la carpeta `Backend`:
   ```bash
   cd Backend
   ```
2. Instala las dependencias:
   ```bash
   pip install -r Requirements.txt
   ```
3. Configura las credenciales de Firebase y Cloudinary según la documentación interna.
4. Ejecuta el servidor:
   ```bash
   python app.py
   ```

### Frontend (React)
1. Ve a la carpeta `Frontend`:
   ```bash
   cd Frontend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Ejecuta la aplicación:
   ```bash
   npm start
   ```

## Pruebas

### Backend
Desde la carpeta `Backend`:
```bash
pytest --cov=src --cov-report=xml
```

### Frontend
Desde la carpeta `Frontend`:
```bash
npm test -- --coverage --watchAll=false

```

### Subir cobertura a Codecov

Asegúrate de tener configurado el token de Codecov en tu entorno o CI/CD.

#### Backend (Python)
1. Ejecuta las pruebas y genera el reporte de cobertura:
   ```bash
   coverage run -m pytest
   coverage xml
   ```
2. Sube el reporte a Codecov:
   ```bash
   codecov -t <tu_token_codecov>
   ```

#### Frontend (React)
1. Ejecuta las pruebas para generar el reporte de cobertura:
   ```bash
   npm test -- --coverage --watchAll=false   
   ```
2. Sube el reporte a Codecov:
   ```bash
    codecov -f coverage/lcov.info <tu_token_codecov>
   ```

## Uso con Docker

1. Asegúrate de tener Docker y Docker Compose instalados.
2. Desde la raíz del proyecto, ejecuta:
   ```bash
   docker-compose up --build
   ```
3. El backend y frontend estarán disponibles en los puertos configurados en los Dockerfiles y `docker-compose.yml`.
