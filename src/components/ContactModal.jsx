import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactModal({ open, onClose, clickPos }) {
	const modalRef = useRef(null);
	const [pos, setPos] = useState({
		x: window.innerWidth / 2 - 160,
		y: window.innerHeight / 2 - 100,
	});
	const [dragging, setDragging] = useState(false);
	const [offset, setOffset] = useState({ x: 0, y: 0 });

	useEffect(() => {
		const handleMouseMove = (e) => {
			if (!dragging) return;
			setPos({
				x: e.clientX - offset.x,
				y: e.clientY - offset.y,
			});
		};

		const handleMouseUp = () => setDragging(false);

		// se enganchan globalmente
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
					initial={{
						opacity: 0,
						scale: 0.4,
						x: window.innerWidth / 2 - 160,
						y: window.innerHeight / 2 - 100,
					}}
					animate={{ opacity: 1, scale: 1, x: pos.x, y: pos.y }}
					exit={{ opacity: 0, scale: 0.8 }}
					transition={{
						default: { type: "spring", stiffness: 200, damping: 22 },
						x: { type: "tween", duration: 0 },
						y: { type: "tween", duration: 0 },
					}}
					className="fixed z-50 w-80 border border-blue-700 shadow-xl rounded-sm text-sm font-sans bg-black text-white select-none"
					style={{ top: 0, left: 0 }}
				>
					{/* Barra superior */}
					<div
						className="flex items-center justify-between bg-gradient-to-r from-[#0a3c8a] to-[#3a7bd5] px-2 py-1 cursor-move"
						onMouseDown={handleMouseDown}
					>
						<span className="font-bold">Contacto</span>
						<button
							onClick={onClose}
							className="bg-gray-200 text-black border border-gray-400 w-5 h-5 text-xs leading-3 flex items-center justify-center"
						>
							x
						</button>
					</div>

					{/* Contenido */}
					<div className="bg-[#1b1b1b] p-3">
						<p>💬 Podés contactarme en:</p>
						<ul className="list-disc pl-5 mt-2 space-y-1">
							<li>
								Email:{" "}
								<a href="mailto:marcos@example.com" className="text-blue-400 underline">
									marcos@example.com
								</a>
							</li>
							<li>
								Instagram:{" "}
								<a href="https://instagram.com/marcos" target="_blank" className="text-blue-400 underline">
									@marcos
								</a>
							</li>
							<li>
								LinkedIn:{" "}
								<a href="https://linkedin.com/in/marcos" target="_blank" className="text-blue-400 underline">
									Marcos Tavio
								</a>
							</li>
						</ul>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
