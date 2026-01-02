import { Link } from "react-router-dom";

export default function TaskTrackPage() {
	return (
		<div
			className="relative flex flex-col items-center justify-center min-h-screen bg-gray-950 text-gray-100 px-6 text-center overflow-hidden"
		>
			{/* Fondo con imagen */}
			<img
				src="https://imgur.com/cmXKarM.png"
				alt="TaskTrack background"
				className="absolute inset-0 w-full h-full object-cover opacity-15"
			/>

			{/* Capa oscura sutil para mejorar legibilidad */}
			<div className="absolute inset-0 bg-gray-950/60" />

			{/* Contenido principal */}
			<div className="relative z-10">
				<h1 className="text-4xl font-bold mb-4">TaskTrack</h1>
				<p className="max-w-md text-lg mb-8 text-gray-300">
					Una aplicación simple para anotar tareas y llevar un registro de tus avances.
					Crea listas, marca tus pendientes completados y visualiza tu progreso sin
					complicaciones.
				</p>
				{/* Tecnologías */}
				<div className="max-w-md mb-8 text-gray-400 text-sm">
					<p className="font-semibold text-gray-300 mb-2">
						Tecnologías utilizadas
					</p>
					<ul className="space-y-1">
						<li>• Frontend: TypeScript + React</li>
						<li>• Backend: Java + Spring Boot</li>
						<li>• Base de datos: PostgreSQL</li>
						<li>• Infraestructura: AWS (RDS para la BBDD, ECS para el backend)</li>
						<li>• Contenedorización: Docker</li>
					</ul>
				</div>

				<Link
					to="https://tasktrackapp.vercel.app"
					className="bg-gray-100 text-gray-900 px-6 py-3 rounded-xl font-medium hover:bg-white transition"
				>
					Ir a la app
				</Link>
			</div>
		</div>
	);
}
