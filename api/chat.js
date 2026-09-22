/**
 * Funcion serverless de Vercel: agente de LangChain.js sobre el CV/proyectos
 * de Marcos Tavio, con 2 tools -- el modelo decide cual (o ninguna) usar.
 *
 * Flujo por request: rate limit por IP -> se arma el historial + pregunta,
 * SIN correr retrieval de antemano -> el agente (createReactAgent) decide:
 *   - buscar_contexto_semantico: RAG por similaridad (embeddings de Voyage +
 *     coseno contra api/_data/embeddings.json), para preguntas puntuales.
 *   - listar_experiencia_completa: lee la fuente de verdad directo, para
 *     preguntas de listado/conteo exacto donde el RAG no garantiza traer
 *     TODO (ver Fase4-Aprendizajes.md, el bug de CFOTech afuera del top-k).
 * Antes el RAG corria SIEMPRE antes de invocar al modelo, aunque terminara
 * usando la otra tool -- desperdiciando la llamada a Voyage y metiendo
 * contexto de mas en el prompt sin necesidad. Convertirlo en tool deja que
 * el agente decida si hace falta, no que se corra a ciegas.
 *
 * Env vars necesarias en Vercel: ANTHROPIC_API_KEY, VOYAGE_API_KEY.
 */

import { ChatAnthropic } from "@langchain/anthropic";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { tool } from "@langchain/core/tools";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import { z } from "zod";
import embeddingsData from "./_data/embeddings.json" with { type: "json" };
import infoVerificada from "../scripts/data/informacion-verificada.json" with { type: "json" };

const MAX_PREGUNTAS_POR_VENTANA = 5;
const VENTANA_MS = 10 * 60 * 1000; // 10 minutos
const MAX_LARGO_PREGUNTA = 300; // caracteres -- evita que alguien mande un ensayo
const MAX_TURNOS_HISTORIAL = 6; // ultimos N mensajes (no todo el historial, acota tokens)

// Rate limit en memoria: vive mientras la funcion serverless este "caliente"
// (Vercel puede reciclarla entre invocaciones -- no es 100% a prueba de abuso
// deliberado, pero cubre el caso de uso real de un sitio personal).
const contadorPorIp = new Map();

function estaLimitado(ip) {
	const ahora = Date.now();
	const registro = contadorPorIp.get(ip);
	if (!registro || ahora - registro.desde > VENTANA_MS) {
		contadorPorIp.set(ip, { count: 1, desde: ahora });
		return false;
	}
	registro.count += 1;
	return registro.count > MAX_PREGUNTAS_POR_VENTANA;
}

function similaridadCoseno(a, b) {
	let dot = 0,
		normA = 0,
		normB = 0;
	for (let i = 0; i < a.length; i++) {
		dot += a[i] * b[i];
		normA += a[i] * a[i];
		normB += b[i] * b[i];
	}
	return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function embeddingDeTexto(texto) {
	const resp = await fetch("https://api.voyageai.com/v1/embeddings", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${process.env.VOYAGE_API_KEY}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ input: [texto], model: embeddingsData.modelo }),
	});
	if (!resp.ok) throw new Error(`Voyage API error: ${resp.status}`);
	const data = await resp.json();
	return data.data[0].embedding;
}

// topK=6 de 16 chunks totales -- ver Fase4-Aprendizajes.md para el porque
// de este numero (split identidad/detalle de la experiencia laboral).
function buscarChunksRelevantes(embeddingConsulta, topK = 6) {
	const rankeados = embeddingsData.chunks
		.map((c) => ({ texto: c.texto, score: similaridadCoseno(embeddingConsulta, c.embedding) }))
		.sort((a, b) => b.score - a.score);

	console.log(`Retrieval trajo ${rankeados.length} candidatos, usando top-${topK}:`);
	rankeados.forEach((c, i) => {
		const marca = i < topK ? "OK " : "n/a";
		console.log(`  [${marca}] score=${c.score.toFixed(4)} ${c.texto.slice(0, 80)}`);
	});

	return rankeados.slice(0, topK).map((c) => c.texto);
}

// RAG como TOOL, no como paso automatico -- el agente la llama solo si la
// pregunta necesita contexto semantico (la mayoria de los casos puntuales:
// skills, un proyecto especifico, un logro concreto).
const buscarContextoSemantico = tool(
	async ({ consulta }) => {
		console.log(`TOOL llamada: buscar_contexto_semantico("${consulta}")`);
		const embedding = await embeddingDeTexto(consulta);
		const chunks = buscarChunksRelevantes(embedding);
		console.log("TOOL resultado: chunks devueltos =", chunks.length);
		return chunks.map((c) => `- ${c}`).join("\n");
	},
	{
		name: "buscar_contexto_semantico",
		description:
			"Busca informacion relevante sobre Marcos Tavio (experiencia, skills, proyectos, " +
			"educacion) por similaridad semantica. Usar para preguntas puntuales o especificas. " +
			"NO usar para pedidos de listado completo -- para eso existe listar_experiencia_completa.",
		schema: z.object({
			consulta: z.string().describe("La consulta a buscar, en texto natural"),
		}),
	},
);

// Tool determinística: en vez de confiar en que el retrieval por similaridad
// "adivine bien" para preguntas de listado ("todas las empresas", "cuantos
// trabajos tuvo"), esta tool lee la fuente de verdad DIRECTO -- sin pasar
// por embeddings, sin riesgo de que algun chunk quede afuera del top-k.
const listarExperienciaCompleta = tool(
	async () => {
		console.log("TOOL llamada: listar_experiencia_completa (sin argumentos)");
		const lista = infoVerificada.experiencia.map(
			(j) => `${j.empresa} — ${j.puesto} (${j.periodo})`,
		);
		console.log("TOOL resultado:", lista);
		return JSON.stringify(lista);
	},
	{
		name: "listar_experiencia_completa",
		description:
			"Devuelve la lista COMPLETA y exacta de TODAS las empresas donde trabajó Marcos, " +
			"con puesto y período, ordenada de la más reciente a la más antigua. Usar SIEMPRE " +
			"que la pregunta pida un listado, un conteo total, o mencione 'todas'/'todos' " +
			"las empresas/experiencias -- no confiar solo en buscar_contexto_semantico para ese caso.",
		schema: z.object({}),
	},
);

const SYSTEM_PROMPT = `Sos un asistente que responde preguntas SOLO sobre Marcos Tavio: su experiencia laboral, formacion, skills tecnicos y proyectos personales, usando las tools disponibles para buscar la informacion que necesites -- no asumas nada que no venga de una tool.

Reglas estrictas:
- Antes de responder algo factico sobre Marcos, llamá a la tool que corresponda (buscar_contexto_semantico para preguntas puntuales, listar_experiencia_completa para listados/conteos completos). Si ya tenés lo necesario en el historial de la conversacion, no hace falta repetir la busqueda.
- Si te preguntan algo que no tiene relacion con Marcos Tavio (temas generales, otras personas, pedidos de codigo, etc.), rechazá amablemente y redirigí a preguntar sobre Marcos.
- Se breve: maximo 3-4 oraciones por respuesta.
- Hablá en tercera persona sobre Marcos ("Marcos trabajo en...", no "yo trabaje en...").
- Cuando listes experiencia laboral o proyectos, ordená SIEMPRE del mas reciente al mas antiguo.`;

const model = new ChatAnthropic({
	model: "claude-haiku-4-5",
	temperature: 0,
	maxTokens: 250,
	apiKey: process.env.ANTHROPIC_API_KEY,
});

const agente = createReactAgent({
	llm: model,
	tools: [buscarContextoSemantico, listarExperienciaCompleta],
});

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

		return res.status(200).json({ respuesta: ultimoMensaje.content });
	} catch (error) {
		console.error("Error en /api/chat:", error);
		return res.status(500).json({ error: "Error interno, intentá de nuevo." });
	}
}
