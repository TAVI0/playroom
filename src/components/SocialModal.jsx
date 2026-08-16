import { AnimatePresence, motion } from "framer-motion";
import { links } from "../data/social";
import { useDraggableWindow } from "../hooks/useDraggableWindow";
import { useHoverHint } from "../hooks/useHoverHint";
import { WINDOWS, Z_INDEX } from "../config/windows";

const { width: WINDOW_WIDTH } = WINDOWS.social;

export default function SocialModal({ open, onClose, initialPos }) {
	const hoverHint = useHoverHint("Probá mover las ventanas");
	const fallbackPos = {
		x: window.innerWidth / 2 - WINDOW_WIDTH / 2,
		y: window.innerHeight / 2 - 100,
	};
	const { modalRef, pos, handleMouseDown } = useDraggableWindow(open, initialPos || fallbackPos);

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
					className="win95-window fixed w-80 p-[3px] font-win95 select-none"
					style={{ top: 0, left: 0, zIndex: Z_INDEX.desktopWindow }}
				>
					{/* Barra de título */}
					<div
						className="win95-titlebar cursor-move"
						onMouseDown={handleMouseDown}
						onDoubleClick={(e) => e.preventDefault()}
						{...hoverHint}
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
