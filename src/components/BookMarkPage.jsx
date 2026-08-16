import { Link } from "react-router-dom";

export default function BookMarkPage() {
	return (
		<div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-950 text-gray-100 px-6 text-center overflow-hidden">
			{/* Fondo con imagen */}
			<img
				src="https://imgur.com/ZcRTRRr.png"
				alt="BookMark background"
				className="absolute inset-0 w-full h-full object-cover opacity-15"
			/>

			{/* Capa oscura sutil para mejorar legibilidad */}
			<div className="absolute inset-0 bg-gray-950/60" />

			{/* Contenido principal */}
			<div className="relative z-10">
				<h1 className="text-4xl font-bold mb-4">BookMark</h1>
				<p className="max-w-md text-lg mb-8 text-gray-300">
					Red social para compartir las reseñas, puntuaciones y llevar un registro de los libros los
					cuales estan leyendo con tus amigos
				</p>
				{/* Tecnologías */}
				<div className="max-w-md mb-8 text-gray-400 text-sm">
					<p className="font-semibold text-gray-300 mb-2">Tecnologías utilizadas</p>
					<ul className="space-y-1">
						<li>• Frontend: Javascript + React</li>
						<li>• Backend: Java + Spring Boot</li>
						<li>• Base de datos: PostgreSQL</li>
						<li>• Infraestructura: Neon para BBDD, Render para Backend, Vercel para Frontend</li>
						{/* 
							<li>• Contenedorización: Docker</li>
						*/}
					</ul>
				</div>

				<Link
					to="https://bookmark-gamma-puce.vercel.app/"
					className="bg-gray-100 text-gray-900 px-6 py-3 rounded-xl font-medium hover:bg-white transition"
				>
					Ir a la app
				</Link>
			</div>
		</div>
	);
}
