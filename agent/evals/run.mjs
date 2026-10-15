/**
 * Runner de evals del agente. Invoca el agente directo (agent/agent.js), sin
 * pasar por el handler HTTP ni el rate limit, y puntua cada caso de
 * agent/evals/dataset.json.
 *
 * Uso (las env vars se cargan con --env-file, ver script "evals" en package.json):
 *   npm run evals                      # todos los casos, 1 corrida, solo scoring deterministico
 *   npm run evals -- --only routing    # una categoria o un id exacto
 *   npm run evals -- --runs 3          # N corridas por caso (el caso pasa si pasan TODAS)
 *   npm run evals -- --judge           # suma LLM-as-judge (1 llamada extra por caso)
 *   npm run evals -- --pausa 20        # N segundos entre casos (evita el 429 de Voyage)
 *
 * Exit code: 0 todo PASS, 1 hay FAIL (regresion), 3 solo ERROR de infra.
 *
 * Por defecto NO usa juez: el scoring deterministico es gratis (no suma
 * llamadas al modelo mas alla de la del propio agente) y cubre routing,
 * hechos clave y formato.
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import { awaitAllCallbacks } from "@langchain/core/callbacks/promises";
import { agente } from "../agent.js";
import { SYSTEM_PROMPT } from "../prompts.js";

const dataset = JSON.parse(readFileSync(new URL("./dataset.json", import.meta.url), "utf8"));

// ---------- args ----------

function leerArgs(argv) {
	const args = { runs: 1, judge: false, only: null, pausa: 0 };
	for (let i = 0; i < argv.length; i++) {
		if (argv[i] === "--runs") args.runs = Math.max(1, Number(argv[++i]) || 1);
		else if (argv[i] === "--pausa") args.pausa = Math.max(0, Number(argv[++i]) || 0);
		else if (argv[i] === "--judge") args.judge = true;
		else if (argv[i] === "--only") args.only = argv[++i];
	}
	return args;
}

// ---------- ejecucion de un caso ----------

// Mismo mapeo que api/chat.js: el historial del cliente es {autor, texto}.
function aMensajes(caso) {
	const historial = (caso.historial || []).map((m) =>
		m.autor === "user" ? new HumanMessage(m.texto) : new AIMessage(m.texto),
	);
	return [new SystemMessage(SYSTEM_PROMPT), ...historial, new HumanMessage(caso.pregunta)];
}

// El contenido de un mensaje puede ser string o una lista de bloques.
function textoDe(content) {
	if (typeof content === "string") return content;
	if (Array.isArray(content)) {
		return content
			.map((b) => (typeof b === "string" ? b : b.type === "text" ? b.text : ""))
			.join("");
	}
	return "";
}

// Solo las tool calls de ESTE turno: los mensajes que vienen despues del
// ultimo HumanMessage (el historial del caso no cuenta).
function toolsLlamadas(mensajes) {
	let ultimoHumano = -1;
	mensajes.forEach((m, i) => {
		if (m._getType() === "human") ultimoHumano = i;
	});
	return mensajes
		.slice(ultimoHumano + 1)
		.filter((m) => m._getType() === "ai")
		.flatMap((m) => (m.tool_calls || []).map((t) => t.name));
}

// Errores de infraestructura: una tool que lanzo una excepcion (ej: Voyage
// con 429). LangGraph los captura y los devuelve como ToolMessage con
// status "error"; el agente sigue y contesta "problemas tecnicos". Eso NO es
// una regresion del agente, asi que se separa de los fallos de scoring.
function erroresDeTools(mensajes) {
	return mensajes
		.filter((m) => m._getType() === "tool" && m.status === "error")
		.map((m) => textoDe(m.content).slice(0, 200));
}

async function ejecutarCaso(caso) {
	const inicio = Date.now();
	try {
		const resultado = await agente.invoke({ messages: aMensajes(caso) });
		const ultimo = resultado.messages[resultado.messages.length - 1];
		return {
			respuesta: textoDe(ultimo.content),
			tools: toolsLlamadas(resultado.messages),
			errores: erroresDeTools(resultado.messages),
			ms: Date.now() - inicio,
		};
	} catch (error) {
		return { respuesta: "", tools: [], errores: [error.message], ms: Date.now() - inicio };
	}
}

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------- scoring deterministico ----------

const incluye = (texto, fragmento) => texto.toLowerCase().includes(fragmento.toLowerCase());

function puntuar(caso, { respuesta, tools }) {
	const fallos = [];

	for (const t of caso.tools_esperadas || []) {
		if (!tools.includes(t)) fallos.push(`falta tool esperada: ${t}`);
	}
	const alguna = caso.tools_esperadas_alguna || [];
	if (alguna.length && !alguna.some((t) => tools.includes(t))) {
		fallos.push(`ninguna de las tools esperadas: ${alguna.join(" | ")}`);
	}
	for (const t of caso.tools_prohibidas || []) {
		if (tools.includes(t)) fallos.push(`llamo tool prohibida: ${t}`);
	}
	for (const s of caso.debe_contener || []) {
		if (!incluye(respuesta, s)) fallos.push(`no contiene: "${s}"`);
	}
	for (const s of caso.no_debe_contener || []) {
		if (incluye(respuesta, s)) fallos.push(`contiene algo prohibido: "${s}"`);
	}
	return fallos;
}

// ---------- LLM-as-judge (opt-in) ----------

async function juzgar(caso, respuesta) {
	// Import perezoso: sin --judge no se instancia ningun modelo extra.
	const { ChatAnthropic } = await import("@langchain/anthropic");
	const juez = new ChatAnthropic({
		model: "claude-haiku-4-5",
		temperature: 0,
		maxTokens: 200,
		apiKey: process.env.ANTHROPIC_API_KEY,
	});
	const prompt = `Sos un evaluador estricto de un chatbot que responde SOLO sobre Marcos Tavio.
Puntuá la respuesta de 1 a 5 segun la rubrica. Respondé unicamente con JSON: {"score": <1-5>, "motivo": "<una frase>"}

Pregunta: ${caso.pregunta}
Rubrica: ${caso.rubrica_juez}
Respuesta a evaluar: ${respuesta}`;
	const resp = await juez.invoke(prompt);
	const match = textoDe(resp.content).match(/\{[\s\S]*\}/);
	if (!match) return { score: null, motivo: "el juez no devolvio JSON" };
	try {
		return JSON.parse(match[0]);
	} catch {
		return { score: null, motivo: "JSON del juez invalido" };
	}
}

const UMBRAL_JUEZ = 4;

// ---------- main ----------

async function main() {
	const args = leerArgs(process.argv.slice(2));

	const casos = dataset.casos.filter(
		(c) => !args.only || c.id === args.only || c.categoria === args.only,
	);
	if (!casos.length) {
		console.error(`Ningun caso coincide con --only "${args.only}"`);
		process.exit(2);
	}

	console.log(
		`Corriendo ${casos.length} casos x ${args.runs} corrida(s)${args.judge ? " + juez" : ""}\n`,
	);

	const resultados = [];
	for (const caso of casos) {
		const corridas = [];
		for (let r = 0; r < args.runs; r++) {
			const salida = await ejecutarCaso(caso);

			// Error de infra: no se puntua, no es culpa del agente. Sin reintentos
			// (cada uno cuesta una llamada al modelo); para re-correr, usar --only <id>.
			if (salida.errores.length) {
				corridas.push({ ...salida, fallos: [], juez: null });
				continue;
			}

			const fallos = puntuar(caso, salida);
			let juez = null;
			if (args.judge && caso.rubrica_juez) {
				juez = await juzgar(caso, salida.respuesta);
				if (juez.score === null || juez.score < UMBRAL_JUEZ) {
					fallos.push(`juez: ${juez.score ?? "?"}/5 (${juez.motivo})`);
				}
			}
			corridas.push({ ...salida, fallos, juez });
		}

		// FAIL pesa mas que ERROR: si alguna corrida fallo el scoring, es FAIL.
		const hayFail = corridas.some((c) => c.fallos.length > 0);
		const hayError = corridas.some((c) => c.errores.length > 0);
		const estado = hayFail ? "FAIL" : hayError ? "ERROR" : "PASS";
		resultados.push({ id: caso.id, categoria: caso.categoria, estado, corridas });

		console.log(`${estado.padEnd(5)} ${caso.id}  [${corridas[0].tools.join(", ") || "sin tools"}]`);
		if (estado !== "PASS") {
			corridas.forEach((c, i) => {
				c.errores.forEach((e) => console.log(`        corrida ${i + 1} (infra): ${e}`));
				c.fallos.forEach((f) => console.log(`        corrida ${i + 1}: ${f}`));
				console.log(`        respuesta: ${c.respuesta.slice(0, 160).replace(/\n/g, " ")}`);
			});
		}

		if (args.pausa) await dormir(args.pausa * 1000);
	}

	// ---------- resumen por categoria ----------
	// El porcentaje se calcula solo sobre casos que se pudieron evaluar:
	// un ERROR de infra ni suma ni resta.

	const porCategoria = {};
	for (const r of resultados) {
		const c = (porCategoria[r.categoria] ||= { total: 0, pasaron: 0, errores: 0 });
		if (r.estado === "ERROR") c.errores++;
		else {
			c.total++;
			if (r.estado === "PASS") c.pasaron++;
		}
	}
	console.log("\nResumen por categoria:");
	for (const [cat, { total, pasaron, errores }] of Object.entries(porCategoria)) {
		const pct = total ? `${Math.round((pasaron / total) * 100)}%` : "n/a";
		const nota = errores ? `  (+${errores} sin evaluar por error de infra)` : "";
		console.log(`  ${cat.padEnd(15)} ${pasaron}/${total}  (${pct})${nota}`);
	}
	const totalPasaron = resultados.filter((r) => r.estado === "PASS").length;
	const totalFail = resultados.filter((r) => r.estado === "FAIL").length;
	const totalError = resultados.filter((r) => r.estado === "ERROR").length;
	console.log(`\nTOTAL: ${totalPasaron} PASS, ${totalFail} FAIL, ${totalError} ERROR de ${resultados.length}`);

	// Guarda el detalle para comparar contra un baseline mas adelante.
	mkdirSync(new URL("./results/", import.meta.url), { recursive: true });
	writeFileSync(
		new URL("./results/latest.json", import.meta.url),
		JSON.stringify(
			{ fecha: new Date().toISOString(), args, porCategoria, resultados },
			null,
			2,
		),
	);

	// 1 = regresion real, 3 = solo errores de infra (el CI puede reintentar
	// en vez de bloquear el PR), 0 = todo bien.
	// Las trazas a LangSmith se mandan async en segundo plano: process.exit
	// las corta si no se esperan antes (mismo problema que en api/chat.js).
	await awaitAllCallbacks();
	process.exit(totalFail ? 1 : totalError ? 3 : 0);
}

main();
