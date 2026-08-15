import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectModal({ project, open, onClose, clickPos }) {
	const modalRef = useRef(null);
	const [pos, setPos] = useState({
		x: window.innerWidth / 2 - 260,
		y: window.innerHeight / 2 - 200,
	});
	const [dragging, setDragging] = useState(false);
	const [offset, setOffset] = useState({ x: 0, y: 0 });
	const [imageIndex, setImageIndex] = useState(0);

	const images = project?.images?.length ? project.images : project?.image ? [project.image] : [];

	useEffect(() => {
		if (!open) return;
		setPos({
			x: clickPos?.x ?? window.innerWidth / 2 - 260,
			y: clickPos?.y ?? window.innerHeight / 2 - 200,
		});
	}, [open, clickPos]);

	// Al cambiar de proyecto, siempre arranca en la primera imagen
	useEffect(() => {
		setImageIndex(0);
	}, [project?.name]);

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

	const prevImage = () => setImageIndex((i) => (i - 1 + images.length) % images.length);
	const nextImage = () => setImageIndex((i) => (i + 1) % images.length);

	if (!project) return null;

	return (
		<AnimatePresence>
			{open && (
				<motion.div
					ref={modalRef}
					initial={{
						opacity: 0,
						scale: 0.4,
						x: clickPos?.x ?? window.innerWidth / 2 - 260,
						y: clickPos?.y ?? window.innerHeight / 2 - 200,
					}}
					animate={{ opacity: 1, scale: 1, x: pos.x, y: pos.y }}
					exit={{ opacity: 0, scale: 0.8 }}
					transition={{
						default: { type: "spring", stiffness: 200, damping: 22 },
						x: { type: "tween", duration: 0 },
						y: { type: "tween", duration: 0 },
					}}
					className="win95-window fixed z-50 w-[92vw] max-w-lg p-[3px] font-win95 select-none"
					style={{ top: 0, left: 0 }}
				>
					{/* Barra de título */}
					<div className="win95-titlebar cursor-move" onMouseDown={handleMouseDown}>
						<span className="flex items-center gap-1 truncate">
							<span aria-hidden>{project.icon}</span> {project.name}.exe
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
					<div className="bg-win95-face p-3 max-h-[85vh] overflow-y-auto">
						{/* Galería */}
						<div className="win95-inset bg-black w-full h-64 sm:h-72 overflow-hidden mb-1 relative">
							<img
								key={images[imageIndex]}
								src={images[imageIndex]}
								alt={`${project.name} captura ${imageIndex + 1}`}
								className="w-full h-full object-cover"
							/>

							{images.length > 1 && (
								<>
									<button
										onClick={prevImage}
										className="win95-btn absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-sm"
									>
										‹
									</button>
									<button
										onClick={nextImage}
										className="win95-btn absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-sm"
									>
										›
									</button>
								</>
							)}
						</div>

						{images.length > 1 && (
							<div className="flex justify-center gap-1.5 mb-3">
								{images.map((_, i) => (
									<button
										key={i}
										onClick={() => setImageIndex(i)}
										aria-label={`Ver imagen ${i + 1}`}
										className={`w-2.5 h-2.5 border border-black ${
											i === imageIndex ? "bg-win95-navy" : "bg-win95-face"
										}`}
									/>
								))}
							</div>
						)}

						<div className="win95-inset bg-white text-black p-3">
							<p className="font-bold mb-2">{project.name}</p>
							<p className="text-sm text-gray-800 mb-3">{project.description}</p>

							{project.tech && (
								<>
									<p className="text-xs font-bold text-gray-600 mb-1">
										Tecnologías utilizadas
									</p>
									<ul className="text-xs text-gray-700 space-y-0.5 mb-1">
										{project.tech.map((t) => (
											<li key={t}>• {t}</li>
										))}
									</ul>
								</>
							)}
						</div>

						{project.href && (
							<div className="flex justify-end mt-3">
								<a
									href={project.href}
									target="_blank"
									rel="noreferrer"
									className="win95-btn px-4 py-1 text-sm font-win95"
								>
									Ir a la app
								</a>
							</div>
						)}
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
