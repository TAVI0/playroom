import { AnimatePresence, motion } from "framer-motion";
import { useDraggableWindow } from "../hooks/useDraggableWindow";
import { useHoverHint } from "../hooks/useHoverHint";
import { Z_INDEX } from "../config/windows";

export default function ContactModal({ open, onClose, clickPos }) {
	const hoverHint = useHoverHint("Probá mover las ventanas");
	const centeredPos = {
		x: window.innerWidth / 2 - 160,
		y: window.innerHeight / 2 - 100,
	};
	const { modalRef, pos, handleMouseDown, openFrom } = useDraggableWindow(
		open,
		centeredPos,
		clickPos,
	);

	return (
		<AnimatePresence>
			{open && (
				<motion.div
					ref={modalRef}
					initial={{
						opacity: 0,
						scale: 0.4,
						x: openFrom.x,
						y: openFrom.y,
					}}
					animate={{ opacity: 1, scale: 1, x: pos.x, y: pos.y }}
					exit={{ opacity: 0, scale: 0.8 }}
					transition={{
						default: { type: "spring", stiffness: 200, damping: 22 },
						x: { type: "tween", duration: 0 },
						y: { type: "tween", duration: 0 },
					}}
					className="win-window fixed w-80 p-[3px] font-win select-none"
					style={{ top: 0, left: 0, zIndex: Z_INDEX.modal }}
				>
					<div className="win-titlebar cursor-move" onMouseDown={handleMouseDown} {...hoverHint}>
						<span className="flex items-center gap-1">
							<span aria-hidden>💬</span> Contacto
						</span>
						<div className="flex items-center gap-[2px]">
							<button className="win-title-btn" tabIndex={-1}>
								_
							</button>
							<button className="win-title-btn" tabIndex={-1}>
								□
							</button>
							<button onClick={onClose} className="win-title-btn">
								×
							</button>
						</div>
					</div>

					<div className="bg-win-face p-3">
						<div className="win-inset bg-white text-black p-3">
							<p className="font-bold mb-2">Podés contactarme en:</p>
							<ul className="space-y-1.5">
								<li className="flex items-center gap-2">
									<span aria-hidden>✉️</span>
									<span className="text-gray-700">Email:</span>
									<a
										href="mailto:marcos@example.com"
										className="text-win-navy underline hover:text-win-navylight"
									>
										marcos@example.com
									</a>
								</li>
								<li className="flex items-center gap-2">
									<span aria-hidden>📷</span>
									<span className="text-gray-700">Instagram:</span>
									<a
										href="https://instagram.com/marcos"
										target="_blank"
										rel="noreferrer"
										className="text-win-navy underline hover:text-win-navylight"
									>
										@marcos
									</a>
								</li>
								<li className="flex items-center gap-2">
									<span aria-hidden>💼</span>
									<span className="text-gray-700">LinkedIn:</span>
									<a
										href="https://linkedin.com/in/marcos"
										target="_blank"
										rel="noreferrer"
										className="text-win-navy underline hover:text-win-navylight"
									>
										Marcos Tavio
									</a>
								</li>
							</ul>
						</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
