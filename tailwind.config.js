/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				win: {
					// Paleta Windows XP (tema Luna azul), reemplaza la gris plana de Win95.
					face: "#ece9d8", // beige/plata de fondo de ventanas y paneles
					dark: "#aca899",
					darker: "#716f64",
					light: "#ffffff",
					light2: "#f4f2e8",
					navy: "#0054e3", // azul de la barra de titulo
					navylight: "#3d95ff",
					desktop: "#5a7edc", // fondo de escritorio (azul cielo XP en vez de teal 95)
					close: "#e81123", // rojo del boton cerrar
					start: "#3c8f1f", // verde del boton Inicio
				},
			},
			fontFamily: {
				win: ['"Tahoma"', '"MS Sans Serif"', '"Segoe UI"', "sans-serif"],
			},
		},
	},
	plugins: [],
};
