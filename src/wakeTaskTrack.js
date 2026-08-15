const TASKTRACK_API_URL = import.meta.env.VITE_TASKTRACK_API_URL || "https://tasktrack-go4j.onrender.com";

/**
 * Dispara un ping fire-and-forget al /health del backend de TaskTrack en Render.
 * Objetivo: que el servicio empiece a despertar del cold start apenas alguien
 * entra al Playroom, mucho antes de que llegue a /tasktrack.
 *
 * mode: "no-cors" porque no nos interesa leer la respuesta (el back solo
 * permite CORS desde tasktrackapp.vercel.app) — solo que la request llegue.
 */
export function wakeTaskTrackBackend() {
	fetch(`${TASKTRACK_API_URL}/health`, { mode: "no-cors", cache: "no-store" }).catch(() => {
		// Silencioso a propósito: si Render está caído o tarda, no rompemos la UX del Playroom.
	});
}
