import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { links } from "../data/social";

const WINDOW_WIDTH = 320;

export default function SocialModal({ open, onClose, initialPos }) {
	const modalRef = useRef(null);
	const [pos, setPos] = useState(
		initialPos || {
			x: window.innerWidth / 2 - WINDOW_WIDTH / 2,
			y: window.innerHeight / 2 - 100,
		}
	);
	const [dragging, setDragging] = useState(false);
	const [offset, setOffset] = useState({ x: 0, y: 0 });

	// Al reabrirla, siempre vuelve a su rincón original (ignora dónde la dejó el usuario)
	useEffect(() => {
		if (open) setPos(initialPos || pos);
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

	return (
		<AnimatePresence>
			{open && (
				<motion.div
					ref={modalRef}
					initial={{ opacity: 0, scale: 0.4, x: pos.x, y: pos.y }}
					animate={{ opacity: 1, scale: 1, x: pos.x, y: pos.y }}
					exit={{ opacity: 0, scale: 0.8 }}
					transition={{
						default: { type: "spring", stiffness: 200, damping: 22 },
						x: { type: "tween", duration: 0 },
						y: { type: "tween", duration: 0 },
					}}
					className="win95-window fixed z-40 w-80 p-[3px] font-win95 select-none"
					style={{ top: 0, left: 0 }}
				>
					{/* Barra de título */}
					<div
						className="win95-titlebar cursor-move"
						onMouseDown={handleMouseDown}
						onDoubleClick={(e) => e.preventDefault()}
					>
						<span className="flex items-center gap-1">
							<span aria-hidden>🌐</span> Redes
						</span>
						<div className="flex items-center gap-[2px]">
							<button onClick={onClose} className="win95-title-btn">
								_
							</button>
							<button className="win95-title-btn" tabIndex={-1}>
								□
							</button>
							<button onClick={onClose} className="win95-title-btn">
								×
							</button>
						</div>
					</div>

					{/* Contenido */}
					<div className="bg-win95-face p-3">
						<div className="win95-inset bg-white text-black p-3">
							<p className="font-bold mb-2">Podés encontrarme en:</p>
							<ul className="space-y-1.5">
								{links.map((link) => (
									<li key={link.label} className="flex items-center gap-2">
										<span aria-hidden>{link.icon}</span>
										<span className="text-gray-700">{link.label}:</span>
										<a
											href={link.href}
											target="_blank"
											rel="noreferrer"
											className="text-win95-navy underline hover:text-win95-navylight"
										>
											{link.value}
										</a>
									</li>
								))}
							</ul>
						</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
