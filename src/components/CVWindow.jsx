import { AnimatePresence, motion } from "framer-motion";
import { useWindows } from "../context/useWindows";
import { useDraggableWindow } from "../hooks/useDraggableWindow";
import { useHoverHint } from "../hooks/useHoverHint";
import { CV_PATH, CV_FILENAME } from "../data/cv";
import { WINDOWS, Z_INDEX } from "../config/windows";
import { CLIPPY_MOOD } from "../data/clippyMoods";

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = WINDOWS.cv;
const READING_HINT = "¿Algo que te llame la atención?";

export default function CVWindow({ open, onClose, initialPos }) {
	const { triggerCVDownload, setClippyMood, setClippyMessage } = useWindows();
	const fallbackPos = {
		x: Math.max((window.innerWidth - WINDOW_WIDTH) / 2, 16),
		y: Math.max((window.innerHeight - WINDOW_HEIGHT) / 2, 16),
	};
	const { modalRef, pos, handleMouseDown } = useDraggableWindow(open, initialPos || fallbackPos);
	const windowHoverHint = useHoverHint(READING_HINT, CLIPPY_MOOD.READING);

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
					{...windowHoverHint}
				>
					{/* Barra de título */}
					<div
						className="win95-titlebar cursor-move"
						onMouseDown={handleMouseDown}
						onMouseEnter={() => {
							setClippyMood(CLIPPY_MOOD.IDLE);
							setClippyMessage("Probá mover las ventanas");
						}}
						onMouseLeave={() => {
							setClippyMood(CLIPPY_MOOD.READING);
							setClippyMessage(READING_HINT);
						}}
					>
						<span className="flex items-center gap-1 truncate">
							<span aria-hidden>📄</span> Marcos Tavio CV.pdf - Visor
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

					{/* Barra de menú, como un visor de verdad */}
					<div className="bg-win95-face px-2 py-1 flex gap-3 text-xs border-b border-win95-dark">
						<span>Archivo</span>
						<span>Ver</span>
						<span>Ventana</span>
					</div>

					{/* Contenido: "página" del visor */}
					<div className="bg-win95-face p-2">
						<div className="win95-inset bg-white" style={{ height: WINDOW_HEIGHT - 140 }}>
							<iframe
								src={`${CV_PATH}#toolbar=0&navpanes=0`}
								title="Vista previa del CV"
								className="w-full h-full"
							/>
						</div>
					</div>

					{/* Barra de acciones */}
					<div className="flex justify-between items-center px-2 pb-2">
						<span className="text-xs text-black/70">1 página</span>
						<a
							href={CV_PATH}
							download={CV_FILENAME}
							onMouseEnter={() => {
								setClippyMood(CLIPPY_MOOD.DOWNLOAD);
								setClippyMessage("¿Te llevás una copia?");
							}}
							onMouseLeave={() => {
								setClippyMood(CLIPPY_MOOD.READING);
								setClippyMessage(READING_HINT);
							}}
							onClick={triggerCVDownload}
							className="win95-btn px-4 py-1 text-sm font-win95"
						>
							Descargar
						</a>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
