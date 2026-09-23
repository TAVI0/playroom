// Convencion de assets por proyecto: public/projects/<slug-minuscula>/
//   icon.png              -- image (icono cuadrado, se ve en la grilla de "Proyectos", 56x56)
//   screenshot-1.jpeg, -2, -3... -- images (carrusel dentro del modal del proyecto)
// CashTrack todavia usa placeholder de TaskTrack -- reemplazar cuando haya assets propios.
export const projects = [
	{
		name: "Clippie",
		icon: "📎",
		// Clippie se explica a sí mismo con sus propios gifs, no necesita assets propios.
		image: "https://media.tenor.com/mFNhFzLedEsAAAAj/clippy.gif",
		images: [
			"https://media.tenor.com/mFNhFzLedEsAAAAj/clippy.gif",
			"https://media.tenor.com/XrB7ZHYe6gQAAAAj/clippy.gif",
		],
		description:
			"El propio asistente de este portfolio: un agente conversacional con LangChain.js que responde preguntas sobre la experiencia, skills y proyectos de Marcos, con RAG sobre el CV como una tool más del agente y memoria de la conversación. Tiene su propio modo pantalla completa en /chat.",
		tech: [
			"LangChain.js (agente con memoria + tools)",
			"RAG sobre CV/proyectos como tool del agente",
			"Claude Haiku (Anthropic API)",
			"LangSmith (trazas del agente)",
			"Vercel Serverless Functions (api/chat.js)",
		],
		href: "/chat",
		hoverMessage: "¡Soy yo! ¿Querés hablar?",
	},
	{
		name: "CashTrack",
		icon: "🧾",
		image: "/projects/cashtrack/icon.png",
		images: [
			"/projects/cashtrack/1.jpeg",
			"/projects/cashtrack/2.jpeg",
			"/projects/cashtrack/3.jpeg",
			"/projects/cashtrack/4.jpeg",
		],
		description:
			"App móvil offline-first para capturar comprobantes de pago argentinos (recibos, transferencias, MercadoPago) y extraer sus datos automáticamente con Claude usando visión, armando un registro financiero propio sin carga manual.",
		tech: [
			"React Native + Expo (Expo Router)",
			"TypeScript",
			"SQLite (expo-sqlite) offline-first",
			"Claude API con visión (extracción de comprobantes)",
			"Supabase (sync multi-dispositivo)",
		],
		href: "https://github.com/TAVI0/cashtrack",
		hoverMessage: "¿Subís un comprobante?",
	},
	{
		name: "HabitTracker",
		icon: "🔁",
		image: "/projects/habittracker/icon.png",
		images: [
			"/projects/habittracker/screenshot-1.jpeg",
			"/projects/habittracker/screenshot-2.jpeg",
			"/projects/habittracker/screenshot-3.jpeg",
			"/projects/habittracker/screenshot-4.jpeg",
		],
		description:
			"App móvil de seguimiento de hábitos: creá hábitos, marcalos día a día, seguí tus rachas y reordená tu lista con drag & drop. Con recordatorios locales y días libres configurables por hábito.",
		tech: [
			"React Native + Expo (Expo Router)",
			"TypeScript",
			"Drizzle ORM + SQLite (expo-sqlite)",
			"Notificaciones locales (expo-notifications)",
			"Drag & drop (react-native-draggable-flatlist)",
		],
		href: "https://github.com/TAVI0/habitTracker",
		hoverMessage: "¿Vas a trackear algún hábito?",
	},
	{
		name: "BookMark",
		icon: "📚",
		image: "https://imgur.com/ZcRTRRr.png",
		images: [
			"https://imgur.com/ZcRTRRr.png",
			"https://imgur.com/ZcRTRRr.png",
			"https://imgur.com/ZcRTRRr.png",
			"https://imgur.com/ZcRTRRr.png",
		],
		description:
			"Red social para compartir reseñas, puntuaciones y llevar un registro de los libros que estás leyendo con tus amigos.",
		tech: [
			"Frontend: JavaScript + React",
			"Backend: Java + Spring Boot",
			"Base de datos: PostgreSQL",
			"Infraestructura: Neon + Render + Vercel",
		],
		href: "https://bookmark-gamma-puce.vercel.app/",
		hoverMessage: "¿Buscás tu próxima lectura?",
	},
	{
		name: "TaskTrack",
		icon: "✅",
		image: "https://imgur.com/cmXKarM.png",
		images: [
			"https://imgur.com/cmXKarM.png",
			"https://imgur.com/cmXKarM.png",
			"https://imgur.com/cmXKarM.png",
			"https://imgur.com/cmXKarM.png",
		],
		description:
			"Una aplicación simple para anotar tareas y llevar un registro de tus avances. Crea listas, marca tus pendientes completados y visualiza tu progreso sin complicaciones.",
		tech: [
			"Frontend: TypeScript + React",
			"Backend: Java + Spring Boot",
			"Base de datos: PostgreSQL",
			"Infraestructura: AWS (RDS + ECS)",
			"Contenedorización: Docker",
		],
		href: "https://tasktrackapp.vercel.app",
		hoverMessage: "¿Vas a anotar alguna tarea?",
	},
	{
		name: "TavioCoin",
		icon: "🪙",
		isWeb3: true,
		image: "https://imgur.com/UDnfIkB.png",
		images: [
			"https://imgur.com/UDnfIkB.png",
			"https://imgur.com/UDnfIkB.png",
			"https://imgur.com/UDnfIkB.png",
			"https://imgur.com/UDnfIkB.png",
		],
		description:
			"El token del que está hablando todo el mundo. Reclamalo gratis conectando tu wallet.",
		tech: ["Solidity", "Ethers.js", "React"],
		hoverMessage: "¿Vas a reclamar tu token?",
	},
];
