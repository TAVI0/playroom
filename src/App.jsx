import Navbar from "./components/Navbar";
import PhotoGallery from "./components/PhotoGallery";

export default function App() {
	return (
		<div className="min-h-screen  bg-zinc-950 text-white">
			<Navbar />
			
			<div className="pt-20 text-center">
				<h1 className="text-4xl font-bold">Bienvenido</h1>
				<text className="text-lg mt-4 block">Un apartado de bites en el internet para mostrar mis cosas</text>
			</div>
			
		
			<PhotoGallery />
		</div>
	);
}
