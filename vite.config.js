import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			// En local, las funciones serverless (api/) las sirve "vercel dev"
			// aparte (puerto 3000) -- "vercel dev" y el Vite normal no conviven
			// bien en el mismo puerto por el rewrite catch-all de vercel.json
			// (rompe los modulos internos de Vite con MIME type incorrecto).
			// Se navega por este Vite (5173); solo /api viaja al otro proceso.
			"/api": "http://localhost:3000",
		},
	},
});
