import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import TavioCoinPage from "./components/TavioCoinPage";
import PhotoGalleryPage from "./components/PhotoGalleryPage";
import Home from "./components/Home";
import TaskTrackPage from "./components/TaskTrackPage";
import BookMarkPage from "./components/BookMarkPage";
import MobileHome from "./components/MobileHome";
import { wakeTaskTrackBackend } from "./wakeTaskTrack";
import { WindowsProvider } from "./context/WindowsContext";
import { useIsMobile } from "./hooks/useIsMobile";

export default function App() {
	// Se dispara una sola vez al montar el Playroom, sin importar la ruta,
	// para que el backend de TaskTrack en Render ya esté despertando
	// mientras el usuario todavía está navegando el portfolio.
	useEffect(() => {
		wakeTaskTrackBackend();
	}, []);

	const isMobile = useIsMobile();

	// En mobile no hay escritorio de ventanas ni taskbar: una sola página
	// estática que se scrollea de arriba a abajo.
	if (isMobile) {
		return <MobileHome />;
	}

	return (
		<WindowsProvider>
			<div className="h-screen overflow-hidden bg-win95-desktop text-gray-900 font-win95 flex flex-col">
				<div className="flex-1 overflow-y-auto pb-14">
					<Routes>
					 	<Route path="/" element={<Home />} />
						<Route path="/taviocoin" element={<TavioCoinPage />} />
						<Route path="/fotos" element={<PhotoGalleryPage />} />
						<Route path="/tasktrack" element={<TaskTrackPage />} />
						<Route path="/bookmark" element={<BookMarkPage />} />
					</Routes>
				</div>

				<Navbar />
			</div>
		</WindowsProvider>
	);
}
