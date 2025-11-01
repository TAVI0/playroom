import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import TavioCoinPage from "./components/TavioCoinPage";
import PhotoGalleryPage from "./components/PhotoGalleryPage";
import Home from "./components/Home";

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

