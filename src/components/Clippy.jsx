import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { useWindows } from "../context/useWindows";
import { Z_INDEX } from "../config/windows";
import { CLIPPY_MOOD } from "../data/clippyMoods";
import { useClippyChat } from "../hooks/useClippyChat";
import {
	CLIPPY_IDLE_GIF,
	CLIPPY_TALK_GIF,
	CLIPPY_SHOVEL_GIF,
	CLIPPY_DOWNLOAD_GIF,
	CLIPPY_READING_GIF,
	CLIPPY_DOUBLECLICK_GIF,
	CLIPPY_SPAWN_GIF,
	MARKDOWN_COMPONENTS,
} from "../data/clippyChat";

const SPAWN_GIF_DURATION = 550; // dura exactamente un loop del gif, para que no se repita
const SPAWN_MESSAGE_DURATION = SPAWN_GIF_DURATION + 3000; // el saludo queda 3s más en pantalla

export default function Clippy() {
	// clippyMessage/clippyMood: SOLO para hover-hints de otras ventanas (ver
	// useHoverHint) -- el chat NO los toca, vive en estado local propio para
	// que la conversacion persista sin importar que pase con los hints.
	const { clippyMessage, clippyMood } = useWindows();
	// Modo foco: en /chatbot, Clippy pasa de ser un widget flotante a ser
	// el protagonista de la pantalla, centrado sobre un fondo gris.
	const focused = useLocation().pathname === "/chat";
	const [spawning, setSpawning] = useState(true);
	const [spawnMessageVisible, setSpawnMessageVisible] = useState(true);

	const { mensajes, chatInput, setChatInput, enviando, listaRef, preguntar, handleKeyDown } =
		useClippyChat();

	// El hint de otra ventana (hover) pisa momentaneamente al chat -- solo
	// mientras dura el hover, el propio useHoverHint lo limpia al salir. En
	// modo foco (/chat) se ignora: Clippy no puede quedar en otro estado que
	// no sea el chat mientras es el protagonista de la pantalla.
	const hayHint = !focused && !spawnMessageVisible && Boolean(clippyMessage);

	useEffect(() => {
		const gifTimer = setTimeout(() => setSpawning(false), SPAWN_GIF_DURATION);
		const messageTimer = setTimeout(() => setSpawnMessageVisible(false), SPAWN_MESSAGE_DURATION);
		return () => {
			clearTimeout(gifTimer);
			clearTimeout(messageTimer);
		};
	}, []);

	// Autoscroll de la lista de mensajes cada vez que cambia la conversacion,
	// y tambien cuando el panel de chat vuelve a aparecer despues de un hint
	// -- se desmonta/remonta (AnimatePresence), asi que el scrollTop nace en
	// 0 de nuevo cada vez y hay que reposicionarlo al fondo explicitamente.
	useEffect(() => {
		listaRef.current?.scrollTo({ top: listaRef.current.scrollHeight });
	}, [mensajes, enviando, hayHint]);

	const mensajeHint = spawnMessageVisible ? "¡Hola! Soy Clippy" : clippyMessage;

	const gif = spawning
		? CLIPPY_SPAWN_GIF
		: focused
			? hayHint || spawnMessageVisible
				? CLIPPY_TALK_GIF
				: CLIPPY_IDLE_GIF
			: clippyMood === CLIPPY_MOOD.DOWNLOAD
				? CLIPPY_DOWNLOAD_GIF
				: clippyMood === CLIPPY_MOOD.SHOVEL
					? CLIPPY_SHOVEL_GIF
					: clippyMood === CLIPPY_MOOD.READING
						? CLIPPY_READING_GIF
						: clippyMood === CLIPPY_MOOD.DOUBLECLICK
							? CLIPPY_DOUBLECLICK_GIF
							: hayHint || spawnMessageVisible
								? CLIPPY_TALK_GIF
								: CLIPPY_IDLE_GIF;

	const imgKey = spawning
		? "spawn"
		: !focused && clippyMood !== CLIPPY_MOOD.IDLE
			? clippyMood
			: hayHint
				? "talk"
				: "idle";

	return (
		<>
			{focused && (
				<>
					<div className="fixed inset-0 bg-gray-400/90" style={{ zIndex: Z_INDEX.clippy - 1 }} />
					<Link
						to="/"
						className="fixed top-4 right-4 w-9 h-9 flex items-center justify-center bg-[#ffffe1] border border-black shadow-[2px_2px_0_0_rgba(0,0,0,0.4)] text-black font-bold hover:bg-white"
						style={{ zIndex: Z_INDEX.clippy + 1 }}
						aria-label="Volver al modo normal"
						title="Volver al modo normal"
					>
						✕
					</Link>
				</>
			)}
			<div
				className={
					focused
						? "fixed inset-0 flex flex-col items-center justify-center gap-3 font-win"
						: "fixed bottom-16 right-4 flex flex-col items-end gap-1 font-win"
				}
				style={{ zIndex: Z_INDEX.clippy }}
			>
				<AnimatePresence mode="wait">
					{spawnMessageVisible || hayHint ? (
						<motion.div
							key="hint"
							initial={{ opacity: 0, scale: 0.7, y: 8 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.7, y: 8 }}
							transition={{ type: "spring", stiffness: 320, damping: 22 }}
							className="relative bg-[#ffffe1] text-black text-sm px-3 py-2 border border-black shadow-[2px_2px_0_0_rgba(0,0,0,0.4)] max-w-[260px] mr-2"
						>
							{mensajeHint}
							{/* Colita del globo, apuntando al clip */}
							<svg
								className="absolute -bottom-[9px] right-5"
								width="16"
								height="10"
								viewBox="0 0 16 10"
							>
								<polygon points="0,0 16,0 4,10" fill="#ffffe1" stroke="black" strokeWidth="1" />
							</svg>
						</motion.div>
					) : (
						<motion.div
							key="chat"
							initial={{ opacity: 0, scale: 0.7, y: 8 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.7, y: 8 }}
							transition={{ type: "spring", stiffness: 320, damping: 22 }}
							className={
								focused
									? "relative bg-[#ffffe1] border border-black shadow-[2px_2px_0_0_rgba(0,0,0,0.4)] w-[520px] flex flex-col p-3 gap-2"
									: "relative bg-[#ffffe1] border border-black shadow-[2px_2px_0_0_rgba(0,0,0,0.4)] mr-2 w-[280px] flex flex-col p-2 gap-2"
							}
						>
							{!focused && (
								<Link
									to="/chat"
									className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-[#ffffe1] border border-black text-black text-[10px] leading-none hover:bg-white"
									aria-label="Agrandar el chat"
									title="Agrandar el chat"
								>
									⛶
								</Link>
							)}
							<div
								ref={listaRef}
								className={
									focused
										? "text-black h-96 overflow-y-auto flex flex-col gap-1.5 text-base select-text"
										: "text-black h-56 overflow-y-auto flex flex-col gap-1.5 text-sm select-text"
								}
							>
								{mensajes.map((m, i) => (
									<div
										key={i}
										className={`max-w-[90%] min-w-0 break-words ${
											m.autor === "user"
												? "self-end text-right text-win-navy font-semibold"
												: "self-start text-black"
										}`}
									>
										{m.autor === "bot" ? (
											<ReactMarkdown components={MARKDOWN_COMPONENTS}>{m.texto}</ReactMarkdown>
										) : (
											m.texto
										)}
									</div>
								))}
								{enviando && <div className="self-start text-gray-500 italic">escribiendo...</div>}
							</div>

							<div className="flex items-center gap-1 border-t border-black/30 pt-1.5">
								<input
									type="text"
									value={chatInput}
									onChange={(e) => setChatInput(e.target.value)}
									onKeyDown={handleKeyDown}
									disabled={enviando}
									placeholder="Preguntá algo sobre Marcos..."
									maxLength={300}
									className="min-w-0 flex-1 bg-transparent text-sm text-black outline-none placeholder:text-black/40"
								/>
								<button
									onClick={preguntar}
									disabled={enviando}
									className="shrink-0 text-lg leading-none disabled:opacity-40"
									aria-label="Enviar pregunta"
								>
									➤
								</button>
							</div>

							{/* Colita del globo, igual que en el hint -- misma identidad visual */}
							<svg
								className="absolute -bottom-[9px] right-5"
								width="16"
								height="10"
								viewBox="0 0 16 10"
							>
								<polygon points="0,0 16,0 4,10" fill="#ffffe1" stroke="black" strokeWidth="1" />
							</svg>
						</motion.div>
					)}
				</AnimatePresence>

				{focused ? (
					<motion.div
						layout
						layoutId="clippy-avatar"
						transition={{ type: "spring", stiffness: 200, damping: 24 }}
						className="w-48 h-48 flex items-center justify-center select-none"
						title="Clippy"
					>
						<img key={imgKey} src={gif} alt="Clippy" className="w-full h-full object-contain" />
					</motion.div>
				) : (
					<motion.div
						layout
						layoutId="clippy-avatar"
						transition={{ type: "spring", stiffness: 200, damping: 24 }}
						className="w-28 h-28 select-none"
					>
						<Link
							to="/chat"
							className="w-full h-full flex items-center justify-center text-8xl"
							title="Agrandar el chat"
							aria-label="Agrandar el chat"
						>
							<img key={imgKey} src={gif} alt="Clippy" className="w-full h-full object-contain" />
						</Link>
					</motion.div>
				)}
			</div>
		</>
	);
}
