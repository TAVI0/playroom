import { LinkDescargaCV } from "../components/ClippyChatShared";

// TODO: reemplazar por GIFs/imagen propios de Clippy cuando estén listos.
export const CLIPPY_IDLE_GIF = "https://media.tenor.com/mFNhFzLedEsAAAAj/clippy.gif";
export const CLIPPY_TALK_GIF = "https://media.tenor.com/XrB7ZHYe6gQAAAAj/clippy.gif";
export const CLIPPY_SHOVEL_GIF = "https://media.tenor.com/ZWWKdW6k-VUAAAAj/clippy.gif";
export const CLIPPY_DOWNLOAD_GIF = "https://media.tenor.com/JqkNT68NBxgAAAAj/clippy.gif";
export const CLIPPY_READING_GIF = "https://media.tenor.com/63k8-8UipCwAAAAj/clippy.gif";
export const CLIPPY_DOUBLECLICK_GIF = "https://media.tenor.com/4HO0la4zISkAAAAj/clippy.gif";
export const CLIPPY_SPAWN_GIF = "https://media.tenor.com/V1tphaHNhW4AAAAj/clippy.gif";

// El bot responde en markdown (negrita, listas) -- overrides compactos para
// que entren bien en el panel chico, sin los margenes grandes de un articulo.
export const MARKDOWN_COMPONENTS = {
	p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
	ul: ({ children }) => <ul className="list-disc pl-4 my-1 space-y-0.5">{children}</ul>,
	ol: ({ children }) => <ol className="list-decimal pl-4 my-1 space-y-0.5">{children}</ol>,
	li: ({ children }) => <li>{children}</li>,
	strong: ({ children }) => <strong className="font-bold">{children}</strong>,
	a: ({ href, children }) =>
		href === "#cv-download" ? (
			<LinkDescargaCV>{children}</LinkDescargaCV>
		) : (
			<a href={href} target="_blank" rel="noreferrer" className="underline">
				{children}
			</a>
		),
};
