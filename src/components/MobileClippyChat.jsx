import ReactMarkdown from "react-markdown";
import { useClippyChat } from "../hooks/useClippyChat";
import { CLIPPY_IDLE_GIF, CLIPPY_TALK_GIF, MARKDOWN_COMPONENTS } from "../data/clippyChat";

// Sección fija de MobileHome: a diferencia del Clippy flotante de desktop,
// acá no hay hints de otras ventanas ni animación de spawn -- solo la función
// de chateo, con Clippy al costado del panel en vez de arriba.
export default function MobileClippyChat() {
	const { mensajes, chatInput, setChatInput, enviando, listaRef, preguntar, handleKeyDown } =
		useClippyChat();

	return (
		<section className="win-window p-[3px] w-full">
			<div className="win-titlebar">
				<span className="flex items-center gap-1 truncate">
					<span aria-hidden>💬</span> Preguntale a Clippy
				</span>
			</div>
			<div className="bg-win-face p-3 flex gap-3">
				<img
					src={enviando ? CLIPPY_TALK_GIF : CLIPPY_IDLE_GIF}
					alt="Clippy"
					className="w-16 h-16 shrink-0 object-contain self-start"
				/>

				<div className="flex-1 min-w-0 flex flex-col gap-2">
					<div
						ref={listaRef}
						className="win-inset bg-white text-black h-72 overflow-y-auto flex flex-col gap-1.5 p-2 text-sm select-text"
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

					<div className="flex items-center gap-1">
						<input
							type="text"
							value={chatInput}
							onChange={(e) => setChatInput(e.target.value)}
							onKeyDown={handleKeyDown}
							disabled={enviando}
							placeholder="Preguntá algo sobre Marcos..."
							maxLength={300}
							className="win-inset min-w-0 flex-1 bg-white text-sm text-black outline-none px-2 py-1.5 placeholder:text-black/40"
						/>
						<button
							onClick={preguntar}
							disabled={enviando}
							className="win-btn shrink-0 px-3 py-1.5 text-lg leading-none disabled:opacity-40"
							aria-label="Enviar pregunta"
						>
							➤
						</button>
					</div>
				</div>
			</div>
		</section>
	);
}
