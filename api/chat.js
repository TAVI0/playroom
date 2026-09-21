/**
 * Funcion serverless de Vercel: chatbot RAG sobre el CV/proyectos de Marcos Tavio.
 *
 * Flujo por request: rate limit por IP -> embedding de la pregunta (Voyage) ->
 * similaridad coseno contra api/_data/embeddings.json (precalculado offline,
 * ver scripts/generar-embeddings.mjs) -> contexto + pregunta a Claude Haiku
 * con system prompt acotado -> respuesta.
 *
 * Env vars necesarias en Vercel: ANTHROPIC_API_KEY, VOYAGE_API_KEY.
 */

import embeddingsData from "./_data/embeddings.json" with { type: "json" };

const MAX_PREGUNTAS_POR_VENTANA = 5;
const VENTANA_MS = 10 * 60 * 1000; // 10 minutos
const MAX_LARGO_PREGUNTA = 300; // caracteres -- evita que alguien mande un ensayo

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
	let dot = 0, normA = 0, normB = 0;
	for (let i = 0; i < a.length; i++) {
		dot += a[i] * b[i];
		normA += a[i] * a[i];
		normB += b[i] * b[i];
	}
	return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function embeddingDePregunta(texto) {
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

// topK alto (6 de 12 chunks totales) a proposito: el corpus es chico, el
// costo extra de contexto es insignificante, y evita el problema real que
// se vio en produccion -- preguntas genericas tipo "las empresas donde
// trabajo" dejaban afuera algun chunk de trabajo con topK=3 (ver
// Fase4-Aprendizajes.md, seccion recall@k, para el mismo fenomeno medido).
function buscarChunksRelevantes(embeddingPregunta, topK = 6) {
	return embeddingsData.chunks
		.map((c) => ({ texto: c.texto, score: similaridadCoseno(embeddingPregunta, c.embedding) }))
		.sort((a, b) => b.score - a.score)
		.slice(0, topK)
		.map((c) => c.texto);
}

const SYSTEM_PROMPT = `Sos un asistente que responde preguntas SOLO sobre Marcos Tavio: su experiencia laboral, formacion, skills tecnicos y proyectos personales, en base a la informacion que se te da como contexto.

Reglas estrictas:
- Respondé UNICAMENTE en base al contexto provisto. Si la pregunta no se puede responder con ese contexto, decí que no tenés esa informacion.
- Si te preguntan algo que no tiene relacion con Marcos Tavio (temas generales, otras personas, pedidos de codigo, etc.), rechazá amablemente y redirigí a preguntar sobre Marcos.
- Se breve: maximo 3-4 oraciones por respuesta.
- Hablá en tercera persona sobre Marcos ("Marcos trabajo en...", no "yo trabaje en...").`;

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

	const { pregunta } = req.body || {};
	if (!pregunta || typeof pregunta !== "string" || !pregunta.trim()) {
		return res.status(400).json({ error: "Falta el campo 'pregunta'." });
	}
	if (pregunta.length > MAX_LARGO_PREGUNTA) {
		return res.status(400).json({ error: `La pregunta no puede superar los ${MAX_LARGO_PREGUNTA} caracteres.` });
	}

	try {
		const embeddingPregunta = await embeddingDePregunta(pregunta);
		const chunks = buscarChunksRelevantes(embeddingPregunta);
		const contexto = chunks.map((c) => `- ${c}`).join("\n");

		const respuestaAnthropic = await fetch("https://api.anthropic.com/v1/messages", {
			method: "POST",
			headers: {
				"x-api-key": process.env.ANTHROPIC_API_KEY,
				"anthropic-version": "2023-06-01",
				"content-type": "application/json",
			},
			body: JSON.stringify({
				model: "claude-haiku-4-5",
				max_tokens: 250,
				temperature: 0,
				system: SYSTEM_PROMPT,
				messages: [{
					role: "user",
					content: `Contexto sobre Marcos Tavio:\n${contexto}\n\nPregunta: ${pregunta}`,
				}],
			}),
		});

		if (!respuestaAnthropic.ok) {
			throw new Error(`Anthropic API error: ${respuestaAnthropic.status}`);
		}
		const data = await respuestaAnthropic.json();
		return res.status(200).json({ respuesta: data.content[0].text });
	} catch (error) {
		console.error("Error en /api/chat:", error);
		return res.status(500).json({ error: "Error interno, intentá de nuevo." });
	}
}
