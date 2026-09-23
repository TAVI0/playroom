/**
 * RAG: embedding de un texto (Voyage) + similaridad coseno contra
 * api/_data/embeddings.json (precalculado offline, ver
 * scripts/generar-embeddings.mjs). Extraido aparte de api/chat.js para
 * poder importarlo suelto en evals/tests (Fase 6) sin arrastrar la capa
 * HTTP -- no se puede testear una funcion enterrada en un handler.
 */

import embeddingsData from "../api/_data/embeddings.json" with { type: "json" };

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

export async function embeddingDeTexto(texto) {
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
export function buscarChunksRelevantes(embeddingConsulta, topK = 6) {
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
