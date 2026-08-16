import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useWindows } from "../context/useWindows";
import { Z_INDEX } from "../config/windows";
import { CLIPPY_MOOD } from "../data/clippyMoods";

// TODO: reemplazar por GIFs/imagen propios de Clippie cuando estén listos.
const CLIPPY_IDLE_GIF = "https://media.tenor.com/mFNhFzLedEsAAAAj/clippy.gif";
const CLIPPY_TALK_GIF = "https://media.tenor.com/XrB7ZHYe6gQAAAAj/clippy.gif";
const CLIPPY_SHOVEL_GIF = "https://media.tenor.com/ZWWKdW6k-VUAAAAj/clippy.gif";
const CLIPPY_DOWNLOAD_GIF = "https://media.tenor.com/JqkNT68NBxgAAAAj/clippy.gif";
const CLIPPY_READING_GIF = "https://media.tenor.com/63k8-8UipCwAAAAj/clippy.gif";
const CLIPPY_DOUBLECLICK_GIF = "https://media.tenor.com/4HO0la4zISkAAAAj/clippy.gif";
const CLIPPY_SPAWN_GIF = "https://media.tenor.com/V1tphaHNhW4AAAAj/clippy.gif";
const SPAWN_GIF_DURATION = 550; // dura exactamente un loop del gif, para que no se repita
const SPAWN_MESSAGE_DURATION = SPAWN_GIF_DURATION + 3000; // el saludo queda 3s más en pantalla

export default function Clippy() {
	const { clippyMessage, clippyMood } = useWindows();
	const [spawning, setSpawning] = useState(true);
	const [spawnMessageVisible, setSpawnMessageVisible] = useState(true);

	useEffect(() => {
		const gifTimer = setTimeout(() => setSpawning(false), SPAWN_GIF_DURATION);
		const messageTimer = setTimeout(() => setSpawnMessageVisible(false), SPAWN_MESSAGE_DURATION);
		return () => {
			clearTimeout(gifTimer);
			clearTimeout(messageTimer);
		};
	}, []);

	const gif = spawning
		? CLIPPY_SPAWN_GIF
		: clippyMood === CLIPPY_MOOD.DOWNLOAD
			? CLIPPY_DOWNLOAD_GIF
			: clippyMood === CLIPPY_MOOD.SHOVEL
				? CLIPPY_SHOVEL_GIF
				: clippyMood === CLIPPY_MOOD.READING
					? CLIPPY_READING_GIF
					: clippyMood === CLIPPY_MOOD.DOUBLECLICK
						? CLIPPY_DOUBLECLICK_GIF
						: clippyMessage
							? CLIPPY_TALK_GIF
							: CLIPPY_IDLE_GIF;
	const message = spawnMessageVisible ? "¡Hola! Soy Clippie" : clippyMessage;

	return (
		<div
			className="fixed bottom-16 right-4 flex flex-col items-end gap-1 font-win95"
			style={{ zIndex: Z_INDEX.clippy }}
		>
			<AnimatePresence>
				{message && (
					<motion.div
						initial={{ opacity: 0, scale: 0.7, y: 8 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.7, y: 8 }}
						transition={{ type: "spring", stiffness: 320, damping: 22 }}
						className="relative bg-[#ffffe1] text-black text-sm px-3 py-2 border border-black shadow-[2px_2px_0_0_rgba(0,0,0,0.4)] max-w-[220px] mr-2"
					>
						{message}
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
					key={
						spawning
							? "spawn"
							: clippyMood !== CLIPPY_MOOD.IDLE
								? clippyMood
								: clippyMessage
									? "talk"
									: "idle"
					}
					src={gif}
					alt="Clippie"
					className="w-full h-full object-contain"
				/>
			</div>
		</div>
	);
}
