import { useWindows } from "../context/useWindows";
import { CLIPPY_MOOD } from "../data/clippyMoods";

// Handlers de hover para mostrarle un mensaje a Clippie mientras el mouse
// está sobre un elemento (p.ej. la barra de título de una ventana), y
// limpiarlo al salir. Evita repetir el mismo par onMouseEnter/onMouseLeave
// en cada ventana draggable.
export function useHoverHint(message, mood = CLIPPY_MOOD.IDLE) {
	const { setClippyMood, setClippyMessage } = useWindows();

	return {
		onMouseEnter: () => {
			setClippyMood(mood);
			setClippyMessage(message);
		},
		onMouseLeave: () => {
			setClippyMood(CLIPPY_MOOD.IDLE);
			setClippyMessage(null);
		},
	};
}
