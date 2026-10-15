# Tavio's Playroom

Portfolio personal con estética Windows 95: un "escritorio" con ventanas arrastrables (Bienvenido, AboutMe, CV, Proyectos, Skills, Redes) y Clippie reaccionando a lo que el usuario hace. En mobile se reemplaza por una vista estática de una sola página (`MobileHome`).

## Stack

- [Vite](https://vitejs.dev/) + [React 19](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/) (paleta `win95` custom en `tailwind.config.js`)
- [Framer Motion](https://www.framer.com/motion/) para las animaciones de apertura/cierre de ventanas
- [react-router-dom](https://reactrouter.com/) para las rutas
- [ethers.js](https://docs.ethers.org/) para el flujo de wallet del proyecto TavioCoin

## Rutas

| Ruta         | Qué es                                          |
| ------------ | ----------------------------------------------- |
| `/`          | Escritorio principal (o `MobileHome` en mobile) |
| `/fotos`     | Galería de fotos                                |
| `/tasktrack` | Landing del proyecto TaskTrack                  |
| `/bookmark`  | Landing del proyecto BookMark                   |

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

## Agente (Clippy)

Todo el backend del chatbot vive en `agent/`. `api/chat.js` queda afuera porque Vercel solo publica funciones serverless desde `/api`, y es un adaptador HTTP fino: valida el request, aplica el rate limit e invoca al agente.

```
api/chat.js                  # adaptador HTTP (Vercel)
agent/
  agent.js                   # modelo + agente LangGraph (ReAct)
  tools.js                   # tools que el agente puede llamar
  rag.js                     # embeddings (Voyage) + similaridad coseno
  prompts.js                 # system prompt, separado del código
  rate-limit.js
  data/                      # fuente de verdad + embeddings precalculados
  scripts/                   # generación de embeddings
  evals/                     # dataset + runner de evals
```

Para regenerar los embeddings: `node agent/scripts/generar-embeddings.mjs` (`--dry-run` para verlos sin llamar a Voyage).

## Evals del agente

Suite de evals del chatbot (Clippy): 20 casos en `agent/evals/dataset.json`, repartidos en 5 categorías (`routing`, `grounding`, `formato`, `fuera_de_tema`, `multi_turno`). El runner (`agent/evals/run.mjs`) invoca el agente directo, sin pasar por el handler HTTP ni el rate limit. Carga las variables de `.env.local`.

Cada llamada gasta cuota de la API de Anthropic (y de Voyage si el caso usa el RAG), así que por defecto corre 1 vez por caso y sin juez.

```bash
npm run evals                                     # los 20 casos, 1 corrida, scoring determinístico
npm run evals -- --only routing                   # una categoría
npm run evals -- --only fuera-03-prompt-injection # un caso por id
npm run evals -- --only multi_turno --pausa 20    # pausa de N segundos entre casos (evita el 429 de Voyage)
npm run evals -- --runs 3                         # N corridas por caso (pasa solo si pasan todas)
npm run evals -- --judge                          # suma LLM-as-judge (1 llamada extra por caso)
```

Categorías para `--only`: `routing` (5), `grounding` (5), `formato` (3), `fuera_de_tema` (4), `multi_turno` (3).

Resultado por caso:

- `PASS`: cumplió todos los chequeos.
- `FAIL`: falló el scoring (regresión del agente).
- `ERROR`: falló la infraestructura (por ejemplo, una tool lanzó una excepción). No cuenta en el porcentaje. Para repetirlo: `--only <id>`.

Exit code: `0` todo PASS, `1` hay FAIL, `3` solo hubo ERROR de infra.

El detalle de la última corrida queda en `agent/evals/results/latest.json` (se sobrescribe en cada corrida).
