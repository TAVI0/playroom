/**
 * Tools del agente. Cada una es una funcion sola, exportable e importable
 * suelta -- misma razon que rag.js: para poder testearlas/evaluarlas en
 * aislamiento en Fase 6, sin pasar por el handler HTTP.
 */

import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { embeddingDeTexto, buscarChunksRelevantes } from "./rag.js";
import infoVerificada from "../scripts/data/informacion-verificada.json" with { type: "json" };

// RAG como TOOL, no como paso automatico -- el agente la llama solo si la
// pregunta necesita contexto semantico (la mayoria de los casos puntuales:
// un proyecto especifico, un logro concreto). Antes corria SIEMPRE antes de
// invocar al modelo, desperdiciando la llamada a Voyage cuando terminaba
// usando otra tool.
export const buscarContextoSemantico = tool(
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
			"Busca informacion relevante sobre Marcos Tavio (experiencia, proyectos, educacion) " +
			"por similaridad semantica. Usar para preguntas puntuales o especificas. NO usar para " +
			"listados completos de experiencia (listar_experiencia_completa) ni de skills " +
			"(listar_skills_tecnicas) -- para eso existen esas tools dedicadas.",
		schema: z.object({
			consulta: z.string().describe("La consulta a buscar, en texto natural"),
		}),
	},
);

// Tool determinística: en vez de confiar en que el retrieval por similaridad
// "adivine bien" para preguntas de listado ("todas las empresas", "cuantos
// trabajos tuvo"), esta tool lee la fuente de verdad DIRECTO -- sin pasar
// por embeddings, sin riesgo de que algun chunk quede afuera del top-k.
export const listarExperienciaCompleta = tool(
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

// Misma logica que listarExperienciaCompleta, aplicada a habilidadesTecnicas:
// lectura directa de la fuente de verdad, categorizada, en vez de depender
// de que el retrieval traiga el chunk de "Habilidades tecnicas" completo.
export const listarSkillsTecnicas = tool(
	async () => {
		console.log("TOOL llamada: listar_skills_tecnicas (sin argumentos)");
		const resultado = infoVerificada.habilidadesTecnicas;
		console.log("TOOL resultado:", resultado);
		return JSON.stringify(resultado);
	},
	{
		name: "listar_skills_tecnicas",
		description:
			"Devuelve TODAS las habilidades técnicas de Marcos, categorizadas: lenguajes, " +
			"frameworks y librerías, bases de datos, seguridad, herramientas, build tools, " +
			"mensajería, servidores/CI-CD, cloud y metodologías. Usar cuando pregunten por su " +
			"stack técnico, lenguajes que maneja, o tecnologías que sabe -- listado exacto y " +
			"completo, no una selección parcial.",
		schema: z.object({}),
	},
);

export const TODAS_LAS_TOOLS = [
	buscarContextoSemantico,
	listarExperienciaCompleta,
	listarSkillsTecnicas,
];
