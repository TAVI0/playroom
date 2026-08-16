import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "../data/projects";
import { useWindows } from "../context/useWindows";
import { useDraggableWindow } from "../hooks/useDraggableWindow";
import { useHoverHint } from "../hooks/useHoverHint";
import ProjectModal from "./ProjectModal";
import { WINDOWS, Z_INDEX } from "../config/windows";
import { CLIPPY_MOOD } from "../data/clippyMoods";

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = WINDOWS.projects;

const getCenteredPos = () => ({
	x: Math.max((window.innerWidth - WINDOW_WIDTH) / 2, 16),
	y: Math.max((window.innerHeight - WINDOW_HEIGHT) / 2, 16),
});

export default function ProjectsWindow({ initialPos }) {
	const { showProjects, closeProjects, setClippyMessage, setClippyMood } = useWindows();
	const { modalRef, pos, handleMouseDown } = useDraggableWindow(
		showProjects,
		initialPos || getCenteredPos(),
	);
	const hoverHint = useHoverHint("Probá mover las ventanas");
	const [selected, setSelected] = useState(null);
	const [openWindows, setOpenWindows] = useState([]);

	const handleSelect = (project) => {
		setSelected(project.name);
		setClippyMood(CLIPPY_MOOD.DOUBLECLICK);
		setClippyMessage("¡Hacé doble clic!");
	};

	const handleOpenApp = (e, project) => {
		setSelected(project.name);
		setClippyMood(CLIPPY_MOOD.IDLE);
		setClippyMessage(null);
		const rect = e.currentTarget.getBoundingClientRect();
		setOpenWindows((prev) => {
			if (prev.some((w) => w.project.name === project.name)) return prev;
			const offsetIndex = prev.length;
			return [
				...prev,
				{
					id: `${project.name}-${Date.now()}`,
					project,
					clickPos: {
						x: Math.max(rect.left - 60 + offsetIndex * 30, 16),
						y: Math.max(rect.top - 80 + offsetIndex * 30, 16),
					},
				},
			];
		});
	};

	const closeWindow = (id) => {
		setOpenWindows((prev) => prev.filter((w) => w.id !== id));
	};

	return (
		<>
			<AnimatePresence>
				{showProjects && (
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
						onClick={() => setSelected(null)}
					>
						<div
							className="win95-titlebar cursor-move"
							onMouseDown={handleMouseDown}
							{...hoverHint}
						>
							<span className="flex items-center gap-1 truncate">
								<span aria-hidden>📁</span> Proyectos
							</span>
							<div className="flex items-center gap-[2px]">
								<button onClick={closeProjects} className="win95-title-btn">
									_
								</button>
								<span className="win95-title-btn">□</span>
								<button onClick={closeProjects} className="win95-title-btn">
									×
								</button>
							</div>
						</div>

						{/* Barra de menú */}
						<div className="bg-win95-face px-2 py-1 flex gap-3 text-xs border-b border-win95-dark">
							<span>Archivo</span>
							<span>Edición</span>
							<span>Ver</span>
							<span>Ayuda</span>
						</div>

						{/* Contenido: grilla de íconos */}
						<div
							className="win95-inset bg-white m-2 p-4 grid grid-cols-3 sm:grid-cols-4 gap-6 min-h-[280px] content-start"
							onClick={(e) => e.stopPropagation()}
						>
							{projects.map((project) => (
								<button
									key={project.name}
									onClick={() => handleSelect(project)}
									onDoubleClick={(e) => handleOpenApp(e, project)}
									onMouseEnter={() => {
										setClippyMood(CLIPPY_MOOD.IDLE);
										setClippyMessage(project.hoverMessage);
									}}
									onMouseLeave={() => {
										setClippyMood(CLIPPY_MOOD.IDLE);
										setClippyMessage(null);
									}}
									className={`flex flex-col items-center gap-1 p-2 rounded-sm text-center ${
										selected === project.name ? "bg-win95-navy text-white" : "text-black"
									}`}
								>
									<div className="w-14 h-14 overflow-hidden rounded-sm">
										<img
											src={project.image}
											alt={project.name}
											className="w-full h-full object-cover"
										/>
									</div>
									<span className="text-xs font-win95 leading-tight">{project.name}</span>
								</button>
							))}
						</div>

						{/* Barra de estado */}
						<div className="win95-inset bg-win95-face mx-2 mb-2 px-2 py-1 text-xs">
							{projects.length} objeto(s)
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{openWindows.map((w) => (
				<ProjectModal
					key={w.id}
					project={w.project}
					open
					onClose={() => closeWindow(w.id)}
					clickPos={w.clickPos}
				/>
			))}
		</>
	);
}
