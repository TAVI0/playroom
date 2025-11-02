import { useState } from "react";
import photos from "../data/photos.json"; // Ajustá la ruta según tu estructura

export default function PhotoGalleryPage() {
	const [lightboxOpen, setLightboxOpen] = useState(false);
	const [currentPhoto, setCurrentPhoto] = useState(null);

	const openLightbox = (src) => {
		setCurrentPhoto(src);
		setLightboxOpen(true);
	};

	const closeLightbox = () => {
		setLightboxOpen(false);
		setCurrentPhoto(null);
	};

	return (
		<div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-[#0f0f12] to-[#1b1c22] text-gray-100 flex flex-col items-center py-12 px-6">
			<h2 className="text-3xl font-bold mb-8 text-center text-white">Galería de Fotos</h2>

			<div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl w-full">
				{photos.map((src, i) => (
					<div
						key={i}
						className="overflow-hidden rounded-lg shadow-lg hover:scale-105 transition-transform duration-200 cursor-pointer"
					>
						<img
							src={src}
							alt={`Foto ${i + 1}`}
							className="w-full h-64 object-contain bg-[#1f2025]"
							onClick={() => openLightbox(src)}
						/>
					</div>
				))}
			</div>

			{/* Lightbox */}
			{lightboxOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 cursor-zoom-out"
					onClick={closeLightbox}
				>
					<img
						src={currentPhoto}
						alt="Foto ampliada"
						className="max-h-[90%] max-w-[90%] rounded-lg shadow-2xl"
					/>
				</div>
			)}
		</div>
	);
}
