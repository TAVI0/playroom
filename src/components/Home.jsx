import { Link } from "react-router-dom";

export default function Home() {
	const items = [
		{ name: "TavioCoin", image: "/images/coin.png", path: "/taviocoin" },
		{ name: "Fotos", image: "/images/foto1.JPG", path: "/fotos" },
	];

	// Repetimos 3 veces cada uno para llenar el tablero
	const projects = [...items, ...items, ...items];

	return (
		<div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-8">
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl">
				{projects.map((item, index) => (
					<Link
						key={index}
						to={item.path}
						className="group relative rounded-2xl overflow-hidden bg-[#1a1a1a] shadow-md hover:shadow-xl transform hover:scale-[1.03] transition-all duration-300"
					>
						<img
							src={item.image}
							alt={item.name}
							className="w-full h-48 object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
						<div className="absolute bottom-0 p-4 text-white font-semibold text-lg">
							{item.name}
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}
