import { useEffect, useRef, useState } from "react";

// Lógica compartida de arrastre + reseteo de posición al reabrir,
// usada por todas las ventanas estilo Win95 (Redes, CV, Proyectos, etc).
//
// startPos (opcional): punto de origen de la animación de apertura cuando
// difiere de la posición de reposo (initialPos) — por ejemplo, ventanas que
// "crecen" desde donde se hizo doble-click antes de terminar centradas.
export function useDraggableWindow(open, initialPos, startPos) {
	const modalRef = useRef(null);
	const [pos, setPos] = useState(initialPos);
	const [dragging, setDragging] = useState(false);
	const [offset, setOffset] = useState({ x: 0, y: 0 });

	// Al reabrirla, siempre vuelve a su rincón original (ignora dónde la dejó el usuario)
	useEffect(() => {
		if (open) setPos(initialPos);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open]);

	useEffect(() => {
		const handleMouseMove = (e) => {
			if (!dragging) return;
			setPos({
				x: e.clientX - offset.x,
				y: e.clientY - offset.y,
			});
		};

		const handleMouseUp = () => setDragging(false);

		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseup", handleMouseUp);

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", handleMouseUp);
		};
	}, [dragging, offset]);

	const handleMouseDown = (e) => {
		setDragging(true);
		const rect = modalRef.current.getBoundingClientRect();
		setOffset({
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
		});
	};

	return { modalRef, pos, handleMouseDown, openFrom: startPos ?? initialPos };
}
