import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ContactModal from "./ContactModal";
import SocialModal from "./SocialModal";
import ProjectsWindow from "./ProjectsWindow";
import CVWindow from "./CVWindow";
import Clippy from "./Clippy";
import { useWindows } from "../context/WindowsContext";

const SOCIAL_WIDTH = 320;
const TOP_ALIGN_Y = 24; // misma altura que la ventana "Bienvenido.exe"

export default function Navbar() {
  const [showContact, setShowContact] = useState(false);
  const [clock, setClock] = useState("");
  const { showSocial, toggleSocial, showProjects, toggleProjects, showCV, toggleCV } = useWindows();

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
      <nav className="fixed bottom-0 left-0 right-0 z-40 win95-raised bg-win95-face flex items-center gap-2 px-1 py-1 font-win95">
        <Link
          to="/"
          className="win95-btn flex items-center gap-1 px-2 py-1 text-sm font-bold"
        >
          🪟 Tavio's Playroom
        </Link>

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

        <div className="ml-auto win95-inset px-2 py-1 text-sm">{clock}</div>
      </nav>

      <ContactModal open={showContact} onClose={() => setShowContact(false)} clickPos={{ x: 0, y: 0 }} />
      <SocialModal
        open={showSocial}
        onClose={toggleSocial}
        initialPos={{ x: Math.max(window.innerWidth - SOCIAL_WIDTH - 24, 16), y: TOP_ALIGN_Y }}
      />
      <CVWindow
        open={showCV}
        onClose={toggleCV}
        initialPos={{ x: 24, y: TOP_ALIGN_Y }}
      />
      <ProjectsWindow />
      <Clippy />
    </>
  );
}
