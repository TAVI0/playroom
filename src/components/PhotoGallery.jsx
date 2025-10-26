import { useState } from "react";

export default function PhotoGallery() {
	const photos = [
		"/images/foto2.JPG",
		"/images/foto3.JPG",
		"/images/foto4.JPG",
		"/images/foto5.JPG",
        "/images/foto6.JPG",
        "/images/foto7.JPG",
	];

	
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
		<div className="pt-10 px-6 max-w-5xl mx-auto">
			<h2 className="text-2xl font-bold mb-6 text-center">Fotos</h2>
			<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
				{photos.map((src, i) => (
					<img
						key={i}
						src={src}
						alt={`Foto ${i + 1}`}
						className="w-full cursor-pointer rounded-lg shadow-md"
						style={{ objectFit: "contain", height: "250px" }}
						onClick={() => openLightbox(src)}
					/>
				))}
			</div>

			{/* Lightbox */}
			{lightboxOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
					onClick={closeLightbox}
				>
					<img
						src={currentPhoto}
						alt="Foto ampliada"
						className="max-h-full max-w-full rounded-lg"
					/>
				</div>
			)}
		</div>
	);
}