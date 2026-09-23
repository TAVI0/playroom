import { AnimatePresence, motion } from "framer-motion";
import { skillCategories } from "../data/skills";
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
					className="win-window fixed w-[92vw] p-[3px] font-win select-none"
					style={{ top: 0, left: 0, maxWidth: WINDOW_WIDTH, zIndex: Z_INDEX.desktopWindow }}
				>
					<div className="win-titlebar cursor-move" onMouseDown={handleMouseDown} {...hoverHint}>
						<span className="flex items-center gap-1 truncate">
							<span aria-hidden>🧰</span> Skills
						</span>
						<div className="flex items-center gap-[2px]">
							<button onClick={onClose} className="win-title-btn">
								_
							</button>
							<span className="win-title-btn">□</span>
							<button onClick={onClose} className="win-title-btn">
								×
							</button>
						</div>
					</div>

					{/* Barra de menú */}
					<div className="bg-win-face px-2 py-1 flex gap-3 text-xs border-b border-win-dark">
						<span>Archivo</span>
						<span>Ver</span>
					</div>

					{/* Contenido: categorías con las skills como chips, no una grilla de íconos --
					    se lee mas y se ve menos "cargado" que un ícono grande por skill. */}
					<div className="win-inset bg-white m-2 p-3 space-y-3">
						{skillCategories.map((category) => (
							<div key={category.label}>
								<p className="text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1">
									<span aria-hidden>{category.icon}</span> {category.label}
								</p>
								<div className="flex flex-wrap gap-1.5">
									{category.items.map((item) => (
										<span
											key={item}
											className="win-inset bg-win-face px-2 py-0.5 text-xs font-win text-black"
										>
											{item}
										</span>
									))}
								</div>
							</div>
						))}
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
