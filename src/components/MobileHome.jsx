import { useState } from "react";
import { welcome, aboutMe } from "../data/content";
import { projects } from "../data/projects";
import { skills } from "../data/skills";
import { links } from "../data/social";
import { CV_PATH, CV_FILENAME } from "../data/cv";
import ProjectModal from "./ProjectModal";

// Panel Win95 estático (sin drag, sin botones de control): a diferencia de
// las ventanas de desktop, en mobile son solo secciones fijas de una página
// que se scrollea.
function MobileSection({ title, icon, children }) {
	return (
		<section className="win95-window p-[3px] w-full">
			<div className="win95-titlebar">
				<span className="flex items-center gap-1 truncate">
					<span aria-hidden>{icon}</span> {title}
				</span>
			</div>
			<div className="bg-win95-face p-3">{children}</div>
		</section>
	);
}

export default function MobileHome() {
	const [openProject, setOpenProject] = useState(null);

	return (
		<div className="min-h-screen bg-win95-desktop flex flex-col gap-4 p-3 font-win95">
			{/* 1. Bienvenido */}
			<MobileSection title="Bienvenido.exe" icon="🖥️">
				<h1 className="text-xl font-bold text-black mb-2 text-center">
					{welcome.title}
				</h1>
				<p className="text-gray-800 text-center text-sm">{welcome.text}</p>
			</MobileSection>

			{/* 2. AboutMe */}
			<MobileSection title="AboutMe.exe" icon="🧑‍💻">
				<div className="win95-inset bg-white text-black p-3">
					<p className="font-bold text-base mb-1">{aboutMe.name}</p>
					<p className="text-sm text-gray-700 mb-3">{aboutMe.role}</p>
					<p className="text-sm text-gray-800">{aboutMe.bio}</p>
				</div>
			</MobileSection>

			{/* 3. Botón de descarga de CV */}
			<a
				href={CV_PATH}
				download={CV_FILENAME}
				className="win95-btn flex items-center justify-center gap-2 py-3 text-base font-win95"
			>
				📄 Descargar CV
			</a>

			{/* 4. Proyectos */}
			<MobileSection title="Proyectos" icon="📁">
				<div className="win95-inset bg-white p-3 grid grid-cols-3 gap-4">
					{projects.map((project) => (
						<button
							key={project.name}
							onClick={() => setOpenProject(project)}
							className="flex flex-col items-center gap-1 p-1 text-center text-black"
						>
							<div className="w-14 h-14 overflow-hidden rounded-sm">
								<img
									src={project.image}
									alt={project.name}
									className="w-full h-full object-cover"
								/>
							</div>
							<span className="text-xs font-win95 leading-tight">
								{project.name}
							</span>
						</button>
					))}
				</div>
			</MobileSection>

			{/* 5. Skills */}
			<MobileSection title="Skills" icon="🧰">
				<div className="win95-inset bg-white p-3 grid grid-cols-3 gap-4">
					{skills.map((skill) => (
						<div
							key={skill.name}
							className="flex flex-col items-center gap-1 p-1 text-center"
						>
							<span className="text-3xl" aria-hidden>
								{skill.icon}
							</span>
							<span className="text-xs font-win95 leading-tight text-black">
								{skill.name}
							</span>
						</div>
					))}
				</div>
			</MobileSection>

			{/* 6. Redes */}
			<MobileSection title="Redes" icon="🌐">
				<div className="win95-inset bg-white text-black p-3">
					<p className="font-bold mb-2">Podés encontrarme en:</p>
					<ul className="space-y-1.5">
						{links.map((link) => (
							<li key={link.label} className="flex items-center gap-2">
								<span aria-hidden>{link.icon}</span>
								<span className="text-gray-700">{link.label}:</span>
								<a
									href={link.href}
									target="_blank"
									rel="noreferrer"
									className="text-win95-navy underline"
								>
									{link.value}
								</a>
							</li>
						))}
					</ul>
				</div>
			</MobileSection>

			<ProjectModal
				project={openProject}
				open={!!openProject}
				onClose={() => setOpenProject(null)}
			/>
		</div>
	);
}
