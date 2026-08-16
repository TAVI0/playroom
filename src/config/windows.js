// Configuración centralizada de las ventanas del escritorio Win95: ancho,
// alto real (para calcular posiciones apiladas) y z-index. Única fuente de
// verdad — antes se repetía por partida doble en cada ventana y en Navbar.jsx.
export const WINDOWS = {
	welcome: { width: 640, height: 168 },
	aboutMe: { width: 500, height: 284 },
	social: { width: 320, height: 196 },
	skills: { width: 320, height: 140 },
	projects: { width: 640, height: 460 },
	cv: { width: 460, height: 600 },
};

// Capas semánticas de apilamiento, de más abajo a más arriba.
export const Z_INDEX = {
	desktopWindow: 40, // ventanas del escritorio (Bienvenido, AboutMe, CV, Proyectos, Skills, Redes)
	modal: 50, // modales por encima del escritorio (detalle de proyecto, contacto, lightbox de fotos)
	clippy: 60, // Clippy siempre por encima de todo
};
