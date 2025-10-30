import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import TavioCoinPage from "./components/TavioCoinPage";
import PhotoGalleryPage from "./components/PhotoGalleryPage";

export default function App() {
	return (
		<div className="min-h-screen bg-gray-50 text-gray-900">
			<Navbar />

			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/taviocoin" element={<TavioCoinPage />} />
				<Route path="/fotos" element={<PhotoGalleryPage />} />
			</Routes>
		</div>
	);
}

function Home() {
	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-2">Bienvenido al Playroom</h1>
			<p className="text-gray-600">Usá la barra superior para navegar a TavioCoin o Fotos.</p>
		</div>
	);
}
