import { AnimatePresence, motion } from "framer-motion";
import { useDraggableWindow } from "../hooks/useDraggableWindow";
import { useWindows } from "../context/WindowsContext";
import { welcome } from "../data/content";

const WINDOW_WIDTH = 640;

export default function WelcomeWindow({ open, onClose, initialPos }) {
	const { modalRef, pos, handleMouseDown } = useDraggableWindow(open, initialPos);
	const { setClippyMood, setClippyMessage } = useWindows();

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
					<div
						className="win95-titlebar cursor-move"
						onMouseDown={handleMouseDown}
						onMouseEnter={() => {
							setClippyMood("idle");
							setClippyMessage("Probá mover las ventanas");
						}}
						onMouseLeave={() => {
							setClippyMood("idle");
							setClippyMessage(null);
						}}
					>
						<span className="flex items-center gap-1 truncate">
							<span aria-hidden>🖥️</span> Bienvenido.exe
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

					<div className="bg-win95-face p-4">
						<h1 className="text-2xl font-bold text-black mb-2 text-center">
							{welcome.title}
						</h1>
						<p className="text-gray-800 text-center text-sm">{welcome.text}</p>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
