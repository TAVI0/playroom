import { AnimatePresence, motion } from "framer-motion";
import { skills } from "../data/skills";
import { useDraggableWindow } from "../hooks/useDraggableWindow";
import { useHoverHint } from "../hooks/useHoverHint";
import { WINDOWS, Z_INDEX } from "../config/windows";

const { width: WINDOW_WIDTH } = WINDOWS.skills;

export default function SkillsWindow({ open, onClose, initialPos }) {
	const { modalRef, pos, handleMouseDown } = useDraggableWindow(open, initialPos);
	const hoverHint = useHoverHint("Probá mover las ventanas");

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
					className="win95-window fixed w-[92vw] p-[3px] font-win95 select-none"
					style={{ top: 0, left: 0, maxWidth: WINDOW_WIDTH, zIndex: Z_INDEX.desktopWindow }}
				>
					<div className="win95-titlebar cursor-move" onMouseDown={handleMouseDown} {...hoverHint}>
						<span className="flex items-center gap-1 truncate">
							<span aria-hidden>🧰</span> Skills
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

					{/* Barra de menú */}
					<div className="bg-win95-face px-2 py-1 flex gap-3 text-xs border-b border-win95-dark">
						<span>Archivo</span>
						<span>Ver</span>
					</div>

					{/* Contenido: grilla de íconos */}
					<div className="win95-inset bg-white m-2 p-3 grid grid-cols-3 gap-4 min-h-[140px] content-start">
						{skills.map((skill) => (
							<div key={skill.name} className="flex flex-col items-center gap-1 p-1 text-center">
								<span className="text-3xl" aria-hidden>
									{skill.icon}
								</span>
								<span className="text-xs font-win95 leading-tight text-black">{skill.name}</span>
							</div>
						))}
					</div>

					{/* Barra de estado */}
					<div className="win95-inset bg-win95-face mx-2 mb-2 px-2 py-1 text-xs">
						{skills.length} objeto(s)
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
