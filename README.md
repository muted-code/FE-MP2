# Study Room - Frontend

"Study Room" es una aplicación web colaborativa en tiempo real diseñada para estudiantes. Este repositorio contiene únicamente el código del frontend.

## Stack Tecnológico
- **Core**: React + TypeScript
- **Herramienta de construcción**: Vite
- **Estilos**: Tailwind CSS v4 (@tailwindcss/vite)
- **Enrutamiento**: React Router v6
- **Cliente HTTP**: Axios

## Estructura del Proyecto (Sprint 0)
El proyecto sigue una estructura semántica y accesible:
- `src/components`: Componentes reutilizables de UI y Layout.
- `src/context`: Gestión de estado global (Autenticación).
- `src/pages`: Vistas principales (Login, Registro, Dashboard, Perfil, Salas).
- `src/router`: Configuración de rutas y protección de las mismas.
- `src/services`: Configuración de servicios externos y API.

## Configuración y Ejecución

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar variables de entorno**:
   Copia el archivo `.env.example` a `.env` y completa los valores necesarios.

3. **Ejecutar en modo desarrollo**:
   ```bash
   npm run dev
   ```

4. **Construir para producción**:
   ```bash
   npm run build
   ```

## Accesibilidad
Este proyecto prioriza la accesibilidad siguiendo las pautas **WCAG 2.2**:
- Navegación semántica mediante roles ARIA.
- Soporte para lectores de pantalla en formularios.
- Estados de carga comunicados mediante `aria-live`.

## Autor
Proyecto desarrollado para el Sprint 0 de Study Room.
