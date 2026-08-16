import { useEffect, useState } from "react";

const QUERY = "(max-width: 767px)";

function getMatches() {
	return typeof window !== "undefined" && window.matchMedia(QUERY).matches;
}

// Detección reactiva de mobile (a diferencia de un window.innerWidth leído
// una sola vez, esto reacciona a resize/rotación del dispositivo).
export function useIsMobile() {
	const [isMobile, setIsMobile] = useState(getMatches);

	useEffect(() => {
		const mql = window.matchMedia(QUERY);
		const handler = (e) => setIsMobile(e.matches);
		mql.addEventListener("change", handler);
		return () => mql.removeEventListener("change", handler);
	}, []);

	return isMobile;
}
