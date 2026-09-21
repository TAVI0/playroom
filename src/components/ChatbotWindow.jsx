import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { useDraggableWindow } from "../hooks/useDraggableWindow";
import { useHoverHint } from "../hooks/useHoverHint";
import { WINDOWS, Z_INDEX } from "../config/windows";

const { width: WINDOW_WIDTH } = WINDOWS.chatbot;

const MENSAJE_INICIAL = {
	autor: "bot",
	texto: "¡Hola! Preguntame lo que quieras sobre la experiencia, skills o proyectos de Marcos.",
};

// El bot responde en markdown (negrita, listas) -- estos overrides lo
// renderizan compacto, sin los margenes grandes por defecto de un articulo.
const MARKDOWN_COMPONENTS = {
	p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
	ul: ({ children }) => <ul className="list-disc pl-4 my-1 space-y-0.5">{children}</ul>,
	ol: ({ children }) => <ol className="list-decimal pl-4 my-1 space-y-0.5">{children}</ol>,
	li: ({ children }) => <li>{children}</li>,
	strong: ({ children }) => <strong className="font-bold">{children}</strong>,
};

export default function ChatbotWindow({ open, onClose, initialPos }) {
	const { modalRef, pos, handleMouseDown } = useDraggableWindow(open, initialPos);
	const hoverHint = useHoverHint("Probá mover las ventanas");

	const [mensajes, setMensajes] = useState([MENSAJE_INICIAL]);
	const [input, setInput] = useState("");
	const [cargando, setCargando] = useState(false);
	const listaRef = useRef(null);

	const enviar = async () => {
		const pregunta = input.trim();
		if (!pregunta || cargando) return;

		setMensajes((prev) => [...prev, { autor: "user", texto: pregunta }]);
		setInput("");
		setCargando(true);

		try {
			const resp = await fetch("/api/chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ pregunta }),
			});
			const data = await resp.json();
			const texto = resp.ok
				? data.respuesta
				: data.error || "Algo salió mal, intentá de nuevo.";
			setMensajes((prev) => [...prev, { autor: "bot", texto }]);
		} catch {
			setMensajes((prev) => [
				...prev,
				{ autor: "bot", texto: "No pude conectarme al chat. Intentá de nuevo en un rato." },
			]);
		} finally {
			setCargando(false);
			setTimeout(() => listaRef.current?.scrollTo({ top: listaRef.current.scrollHeight }), 50);
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter") enviar();
	};

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
					className="win95-window fixed w-[90vw] p-[3px] font-win95 select-none"
					style={{ top: 0, left: 0, maxWidth: WINDOW_WIDTH, zIndex: Z_INDEX.desktopWindow }}
				>
					<div className="win95-titlebar cursor-move" onMouseDown={handleMouseDown} {...hoverHint}>
						<span className="flex items-center gap-1 truncate">
							<span aria-hidden>🤖</span> PreguntaleAClippie.exe
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

					<div className="bg-win95-face p-3 flex flex-col gap-2">
						<div
							ref={listaRef}
							className="win95-inset bg-white text-black p-2 h-64 overflow-y-auto flex flex-col gap-2 text-sm select-text"
						>
							{mensajes.map((m, i) => (
								<div
									key={i}
									className={`max-w-[85%] px-2 py-1 ${
										m.autor === "user"
											? "self-end bg-win95-navy text-white"
											: "self-start bg-gray-100 text-black"
									}`}
								>
									{m.autor === "bot" ? (
										<ReactMarkdown components={MARKDOWN_COMPONENTS}>
											{m.texto}
										</ReactMarkdown>
									) : (
										m.texto
									)}
								</div>
							))}
							{cargando && (
								<div className="self-start bg-gray-100 text-gray-500 px-2 py-1 italic">
									escribiendo...
								</div>
							)}
						</div>

						<div className="flex gap-1">
							<input
								type="text"
								value={input}
								onChange={(e) => setInput(e.target.value)}
								onKeyDown={handleKeyDown}
								disabled={cargando}
								placeholder="Preguntá algo sobre Marcos..."
								maxLength={300}
								className="win95-inset flex-1 bg-white px-2 py-1 text-sm text-black outline-none"
							/>
							<button
								onClick={enviar}
								disabled={cargando}
								className="win95-btn px-3 py-1 text-sm disabled:opacity-50"
							>
								Enviar
							</button>
						</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
