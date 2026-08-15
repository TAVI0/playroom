import { AnimatePresence, motion } from "framer-motion";
import { useWindows } from "../context/WindowsContext";

// TODO: reemplazar por GIFs/imagen propios de Clippie cuando estén listos.
const CLIPPY_IDLE_GIF = "https://media.tenor.com/mFNhFzLedEsAAAAj/clippy.gif";
const CLIPPY_TALK_GIF = "https://media.tenor.com/XrB7ZHYe6gQAAAAj/clippy.gif";
const CLIPPY_SHOVEL_GIF = "https://media.tenor.com/ZWWKdW6k-VUAAAAj/clippy.gif";
const CLIPPY_DOWNLOAD_GIF = "https://media.tenor.com/JqkNT68NBxgAAAAj/clippy.gif";

export default function Clippy() {
	const { clippyMessage, clippyMood } = useWindows();
	const gif =
		clippyMood === "download"
			? CLIPPY_DOWNLOAD_GIF
			: clippyMood === "shovel"
			? CLIPPY_SHOVEL_GIF
			: clippyMessage
			? CLIPPY_TALK_GIF
			: CLIPPY_IDLE_GIF;

	return (
		<div className="fixed bottom-16 right-4 z-[60] flex flex-col items-end gap-1 font-win95">
			<AnimatePresence>
				{clippyMessage && (
					<motion.div
						initial={{ opacity: 0, scale: 0.7, y: 8 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.7, y: 8 }}
						transition={{ type: "spring", stiffness: 320, damping: 22 }}
						className="relative bg-[#ffffe1] text-black text-sm px-3 py-2 border border-black shadow-[2px_2px_0_0_rgba(0,0,0,0.4)] max-w-[220px] mr-2"
					>
						{clippyMessage}
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
				)}
			</AnimatePresence>

			<div className="w-28 h-28 flex items-center justify-center text-8xl select-none">
				<img
					key={clippyMood !== "idle" ? clippyMood : clippyMessage ? "talk" : "idle"}
					src={gif}
					alt="Clippie"
					className="w-full h-full object-contain"
				/>
			</div>
		</div>
	);
}
