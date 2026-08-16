# Tavio's Playroom

Portfolio personal con estética Windows 95: un "escritorio" con ventanas arrastrables (Bienvenido, AboutMe, CV, Proyectos, Skills, Redes) y Clippie reaccionando a lo que el usuario hace. En mobile se reemplaza por una vista estática de una sola página (`MobileHome`).

## Stack

- [Vite](https://vitejs.dev/) + [React 19](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/) (paleta `win95` custom en `tailwind.config.js`)
- [Framer Motion](https://www.framer.com/motion/) para las animaciones de apertura/cierre de ventanas
- [react-router-dom](https://reactrouter.com/) para las rutas
- [ethers.js](https://docs.ethers.org/) para el flujo de wallet del proyecto TavioCoin

## Rutas

| Ruta         | Qué es                                                    |
| ------------ | ----------------------------------------------------------- |
| `/`          | Escritorio principal (o `MobileHome` en mobile)              |
| `/fotos`     | Galería de fotos                                             |
| `/tasktrack` | Landing del proyecto TaskTrack                               |
| `/bookmark`  | Landing del proyecto BookMark                                |

El proyecto **TavioCoin** no tiene ruta propia: se abre como una ventana más desde el escritorio (`ProjectsWindow` → `ProjectModal`), con un botón de conectar wallet + claim del token directamente en el modal (`project.isWeb3` en `src/data/projects.js`).

## Arquitectura de ventanas

- `src/context/WindowsContext.jsx` centraliza qué ventanas están abiertas y el estado de Clippie (`clippyMessage`, `clippyMood`). Se consume vía el hook `src/context/useWindows.js`.
- `src/hooks/useDraggableWindow.js` es la lógica compartida de arrastre + reseteo de posición al reabrir, usada por todas las ventanas.
- `src/hooks/useHoverHint.js` maneja el patrón repetido de "mostrarle un mensaje a Clippie al pasar el mouse".
- `src/config/windows.js` centraliza ancho/alto/z-index de cada ventana (única fuente de verdad, usada tanto por cada ventana como por `Navbar.jsx` para calcular posiciones iniciales apiladas).
- `src/data/clippyMoods.js` define los estados posibles de Clippie (`CLIPPY_MOOD`).

## Variables de entorno

- `VITE_TASKTRACK_API_URL` (opcional): URL del backend de TaskTrack en Render. Si no se define, usa `https://tasktrack-go4j.onrender.com`. Se usa en `src/wakeTaskTrack.js` para "despertar" el backend (cold start de Render) apenas se carga el Playroom.

## Scripts

```bash
npm run dev      # servidor de desarrollo
npm run build    # build de producción
npm run preview  # preview del build
npm run lint     # ESLint
npm run format   # Prettier (escribe los cambios)
```
