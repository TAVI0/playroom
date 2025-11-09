import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import photos from "../data/photos.json";

export default function Home() {
	const [currentPhoto, setCurrentPhoto] = useState(0);
    const IMAGE_TIME = 4000;

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentPhoto((prev) => (prev + 1) % photos.length);
		}, IMAGE_TIME); 
		return () => clearInterval(interval);
	}, []);

	const items = [
		{ name: "TavioCoin", image: "https://imgur.com/UDnfIkB.png", path: "/taviocoin" },
		{ name: "Fotos", image: photos[currentPhoto], path: "/fotos" },
        { name: "TaskTrack", image: "https://imgur.com/cmXKarM.png", path: "/tasktrack" },
	];

	const projects = [...items];

	return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-start p-8">
        {/* Sección de bienvenida */}
        <div className="w-full max-w-2xl text-center mt-16 mb-20">
            <h1 className="text-4xl font-bold text-white mb-4">Bienvenido a mi Playroom</h1>
            <p className="text-gray-400">
                Explorá mis proyectos y divertite con mis creaciones. Hacé clic en cualquiera de las tarjetas para descubrir más.
            </p>
        </div>

        {/* Sección de proyectos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl">
            {projects.map((item, index) => (
                <Link
                    key={index}
                    to={item.path}
                    className="group relative rounded-2xl overflow-hidden bg-[#1a1a1a] shadow-md hover:shadow-xl transform hover:scale-[1.03] transition-all duration-300"
                >
                    <div className="relative w-full h-48">
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={item.name === "Fotos" ? item.image : item.name + index}
                                src={item.image}
                                alt={item.name}
                                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1, ease: 'easeInOut' }}
                            />
                        </AnimatePresence>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 p-4 text-white font-semibold text-lg">
                        {item.name}
                    </div>
                </Link>
            ))}
        </div>
    </div>

	);
}
