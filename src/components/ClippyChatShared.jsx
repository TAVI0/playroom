import { useWindows } from "../context/useWindows";
import { CV_PATH, CV_FILENAME } from "../data/cv";

// El link "cv:download" que devuelve la tool descargar_cv (ver lib/tools.js)
// no navega a ningun lado -- dispara la descarga del PDF instantaneamente,
// igual que el boton de CVWindow, con el mismo flash de Clippy.
export function LinkDescargaCV({ children }) {
	const { triggerCVDownload } = useWindows();

	const handleClick = (e) => {
		e.preventDefault();
		const a = document.createElement("a");
		a.href = CV_PATH;
		a.download = CV_FILENAME;
		a.click();
		triggerCVDownload();
	};

	return (
		<button
			onClick={handleClick}
			className="font-bold text-win-navy underline decoration-2 hover:opacity-80"
		>
			{children}
		</button>
	);
}
