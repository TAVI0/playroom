import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ContactModal from "./ContactModal";
import SocialModal from "./SocialModal";
import ProjectsWindow from "./ProjectsWindow";
import CVWindow from "./CVWindow";
import WelcomeWindow from "./WelcomeWindow";
import AboutMeWindow from "./AboutMeWindow";
import SkillsWindow from "./SkillsWindow";
import Clippy from "./Clippy";
import { useWindows } from "../context/useWindows";
import { WINDOWS, Z_INDEX } from "../config/windows";

const TOP_ALIGN_Y = 24; // misma altura que la ventana "Bienvenido.exe"
const WINDOW_GAP = 42; // separación vertical entre ventanas apiladas
const ABOUT_ALIGN_Y = TOP_ALIGN_Y + WINDOWS.welcome.height + WINDOW_GAP; // debajo de Bienvenido
const PROJECTS_ALIGN_Y = ABOUT_ALIGN_Y + WINDOWS.aboutMe.height + WINDOW_GAP; // debajo de AboutMe
const SKILLS_ALIGN_Y = TOP_ALIGN_Y + WINDOWS.social.height + WINDOW_GAP; // debajo de Redes

export default function Navbar() {
	const [showContact, setShowContact] = useState(false);
	const [clock, setClock] = useState("");
	const {
		showWelcome,
		toggleWelcome,
		showAboutMe,
		toggleAboutMe,
		showSocial,
		toggleSocial,
		showSkills,
		toggleSkills,
		showProjects,
		toggleProjects,
		showCV,
		toggleCV,
	} = useWindows();

	useEffect(() => {
		const update = () =>
			setClock(new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }));
		update();
		const interval = setInterval(update, 1000 * 30);
		return () => clearInterval(interval);
	}, []);

	return (
		<>
			{/* Barra de tareas estilo Windows 95 */}
			<nav
				className="fixed bottom-0 left-0 right-0 win95-raised bg-win95-face flex items-center gap-2 px-1 py-1 font-win95"
				style={{ zIndex: Z_INDEX.desktopWindow }}
			>
				<Link to="/" className="win95-btn flex items-center gap-1 px-2 py-1 text-sm font-bold">
					🪟 Tavio's Playroom
				</Link>

				<button
					onClick={toggleWelcome}
					className={`flex items-center gap-1 px-2 py-1 text-sm ${
						showWelcome ? "win95-btn-pressed" : "win95-btn"
					}`}
				>
					🖥️ Bienvenido
				</button>

				<button
					onClick={toggleAboutMe}
					className={`flex items-center gap-1 px-2 py-1 text-sm ${
						showAboutMe ? "win95-btn-pressed" : "win95-btn"
					}`}
				>
					🧑‍💻 AboutMe
				</button>

				<button
					onClick={toggleCV}
					className={`flex items-center gap-1 px-2 py-1 text-sm ${
						showCV ? "win95-btn-pressed" : "win95-btn"
					}`}
				>
					📄 CV
				</button>

				<button
					onClick={toggleProjects}
					className={`flex items-center gap-1 px-2 py-1 text-sm ${
						showProjects ? "win95-btn-pressed" : "win95-btn"
					}`}
				>
					📁 Proyectos
				</button>

				<button
					onClick={toggleSocial}
					className={`flex items-center gap-1 px-2 py-1 text-sm ${
						showSocial ? "win95-btn-pressed" : "win95-btn"
					}`}
				>
					🌐 Redes
				</button>

				<button
					onClick={toggleSkills}
					className={`flex items-center gap-1 px-2 py-1 text-sm ${
						showSkills ? "win95-btn-pressed" : "win95-btn"
					}`}
				>
					🧰 Skills
				</button>

				<div className="ml-auto win95-inset px-2 py-1 text-sm">{clock}</div>
			</nav>

			<ContactModal
				open={showContact}
				onClose={() => setShowContact(false)}
				clickPos={{ x: 0, y: 0 }}
			/>
			<WelcomeWindow
				open={showWelcome}
				onClose={toggleWelcome}
				initialPos={{
					x: Math.max((window.innerWidth - WINDOWS.welcome.width) / 2, 16),
					y: TOP_ALIGN_Y,
				}}
			/>
			<SocialModal
				open={showSocial}
				onClose={toggleSocial}
				initialPos={{
					x: Math.max(window.innerWidth - WINDOWS.social.width - 24, 16),
					y: TOP_ALIGN_Y,
				}}
			/>
			<CVWindow open={showCV} onClose={toggleCV} initialPos={{ x: 24, y: TOP_ALIGN_Y }} />
			<ProjectsWindow
				initialPos={{
					x: Math.max((window.innerWidth - WINDOWS.projects.width) / 2, 16),
					y: PROJECTS_ALIGN_Y,
				}}
			/>
			<SkillsWindow
				open={showSkills}
				onClose={toggleSkills}
				initialPos={{
					x: Math.max(window.innerWidth - WINDOWS.skills.width - 24, 16),
					y: SKILLS_ALIGN_Y,
				}}
			/>
			<AboutMeWindow
				open={showAboutMe}
				onClose={toggleAboutMe}
				initialPos={{
					x: Math.max((window.innerWidth - WINDOWS.aboutMe.width) / 2, 16),
					y: ABOUT_ALIGN_Y,
				}}
			/>
			<Clippy />
		</>
	);
}
