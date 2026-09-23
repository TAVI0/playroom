/**
 * Funcion serverless de Vercel: capa HTTP del chatbot. Toda la logica de
 * negocio (rate limit, RAG, tools, prompt, wiring del agente) vive en
 * lib/ -- este archivo solo valida el request, arma los mensajes, invoca
 * al agente, y devuelve la respuesta.
 *
 * Env vars necesarias en Vercel: ANTHROPIC_API_KEY, VOYAGE_API_KEY,
 * LANGSMITH_TRACING/LANGSMITH_API_KEY/LANGSMITH_PROJECT (opcionales, tracing).
 */

import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import { awaitAllCallbacks } from "@langchain/core/callbacks/promises";
import { estaLimitado, MAX_PREGUNTAS_POR_VENTANA } from "../lib/rate-limit.js";
import { agente } from "../lib/agent.js";
import { SYSTEM_PROMPT } from "../lib/prompts.js";

const MAX_LARGO_PREGUNTA = 300; // caracteres -- evita que alguien mande un ensayo
const MAX_TURNOS_HISTORIAL = 6; // ultimos N mensajes (no todo el historial, acota tokens)

// Convierte el historial que manda el cliente ({autor, texto}) a mensajes
// de LangChain. Se acota a los ultimos N turnos -- no mandar TODA la
// conversacion siempre, para no inflar tokens sin limite en charlas largas.
function historialAMensajesLangchain(historial) {
	if (!Array.isArray(historial)) return [];
	return historial
		.slice(-MAX_TURNOS_HISTORIAL)
		.map((m) => (m.autor === "user" ? new HumanMessage(m.texto) : new AIMessage(m.texto)));
}

export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Metodo no permitido" });
	}

	const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "desconocida";
	if (estaLimitado(ip)) {
		return res.status(429).json({
			error: `Limite de ${MAX_PREGUNTAS_POR_VENTANA} preguntas cada 10 minutos alcanzado. Probá de nuevo mas tarde.`,
		});
	}

	const { pregunta, historial } = req.body || {};
	if (!pregunta || typeof pregunta !== "string" || !pregunta.trim()) {
		return res.status(400).json({ error: "Falta el campo 'pregunta'." });
	}
	if (pregunta.length > MAX_LARGO_PREGUNTA) {
		return res
			.status(400)
			.json({ error: `La pregunta no puede superar los ${MAX_LARGO_PREGUNTA} caracteres.` });
	}

	try {
		const mensajes = [
			new SystemMessage(SYSTEM_PROMPT),
			...historialAMensajesLangchain(historial),
			new HumanMessage(pregunta),
		];

		const resultado = await agente.invoke({ messages: mensajes });
		const ultimoMensaje = resultado.messages[resultado.messages.length - 1];

		// Vercel puede congelar/matar el proceso apenas se manda la response --
		// el envio de la traza a LangSmith es async en segundo plano y puede
		// quedar cortado a mitad de camino si no se espera explicitamente antes
		// de retornar.
		await awaitAllCallbacks();

		return res.status(200).json({ respuesta: ultimoMensaje.content });
	} catch (error) {
		console.error("Error en /api/chat:", error);
		return res.status(500).json({ error: "Error interno, intentá de nuevo." });
	}
}
