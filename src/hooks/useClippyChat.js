import { useEffect, useRef, useState } from "react";

export const MENSAJE_INICIAL = {
	autor: "bot",
	texto: "¡Hola! Preguntame lo que quieras sobre la experiencia, skills o proyectos de Marcos.",
};

// Lógica de conversación compartida entre el Clippy flotante/focused (desktop)
// y la sección de chat fija de MobileHome -- ambos hablan con el mismo
// /api/chat y necesitan el mismo historial, autoscroll y estado de "enviando".
export function useClippyChat() {
	const [mensajes, setMensajes] = useState([MENSAJE_INICIAL]);
	const [chatInput, setChatInput] = useState("");
	const [enviando, setEnviando] = useState(false);
	const listaRef = useRef(null);

	useEffect(() => {
		listaRef.current?.scrollTo({ top: listaRef.current.scrollHeight });
	}, [mensajes, enviando]);

	const preguntar = async () => {
		const pregunta = chatInput.trim();
		if (!pregunta || enviando) return;

		// Historial ANTES de agregar la pregunta nueva -- el server la recibe
		// aparte en "pregunta", no hace falta duplicarla en el array. Se filtra
		// el saludo inicial hardcodeado (MENSAJE_INICIAL): nunca lo genero el
		// modelo, mandarlo como si fuera un AIMessage real infla la traza de
		// LangSmith con un mensaje que el LLM nunca produjo.
		const historial = mensajes.filter((m) => m !== MENSAJE_INICIAL);
		setMensajes((prev) => [...prev, { autor: "user", texto: pregunta }]);
		setChatInput("");
		setEnviando(true);

		try {
			const resp = await fetch("/api/chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ pregunta, historial }),
			});
			const data = await resp.json();
			const texto = resp.ok ? data.respuesta : data.error || "Algo salió mal, intentá de nuevo.";
			setMensajes((prev) => [...prev, { autor: "bot", texto }]);
		} catch {
			setMensajes((prev) => [
				...prev,
				{ autor: "bot", texto: "No pude conectarme al chat. Intentá de nuevo en un rato." },
			]);
		} finally {
			setEnviando(false);
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter") preguntar();
	};

	return { mensajes, chatInput, setChatInput, enviando, listaRef, preguntar, handleKeyDown };
}
