import { AnimatePresence, motion } from "framer-motion";
import { useDraggableWindow } from "../hooks/useDraggableWindow";

const WINDOW_WIDTH = 500;

// TODO: datos de relleno — ajustar cuando definas el contenido final.
const skills = ["React", "TypeScript", "Java + Spring Boot", "PostgreSQL", "Docker", "AWS"];

export default function AboutMeWindow({ open, onClose, initialPos }) {
	const { modalRef, pos, handleMouseDown } = useDraggableWindow(open, initialPos);

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
					className="win95-window fixed z-40 w-[92vw] p-[3px] font-win95 select-none"
					style={{ top: 0, left: 0, maxWidth: WINDOW_WIDTH }}
				>
					<div className="win95-titlebar cursor-move" onMouseDown={handleMouseDown}>
						<span className="flex items-center gap-1 truncate">
							<span aria-hidden>🧑‍💻</span> AboutMe.exe
						</span>
						<div className="flex items-center gap-[2px]">
							<button onClick={onClose} className="win95-title-btn">
								_
							</button>
							<span className="win95-title-btn">□</span>
							<button onClick={onClose} className="win95-title-btn">
								×
							</button>
						</div>
					</div>

					<div className="bg-win95-face p-3">
						<div className="win95-inset bg-white text-black p-3">
							<p className="font-bold text-base mb-1">Marcos Tavio</p>
							<p className="text-sm text-gray-700 mb-3">Desarrollador Full Stack</p>

							<p className="text-sm text-gray-800 mb-3">
								Me gusta armar aplicaciones de punta a punta, del backend a la
								interfaz, y darle una vuelta de rosca divertida a cada proyecto
								(como este playroom).
							</p>

							<p className="text-xs font-bold text-gray-600 mb-1">Stack</p>
							<ul className="text-xs text-gray-700 grid grid-cols-2 gap-x-2 gap-y-0.5">
								{skills.map((s) => (
									<li key={s}>• {s}</li>
								))}
							</ul>
						</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
