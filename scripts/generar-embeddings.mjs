/**
 * Script offline: chunkea el CV + proyectos + skills, genera embeddings con
 * Voyage AI, y guarda todo en api/_data/embeddings.json.
 *
 * Se corre UNA VEZ (o cada vez que cambia el CV/proyectos), no en cada
 * request -- la funcion serverless de api/chat.js solo LEE ese JSON.
 *
 * Requiere: variable de entorno VOYAGE_API_KEY seteada (en esta terminal).
 * Correr con: node scripts/generar-embeddings.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const VOYAGE_API_KEY = process.env.VOYAGE_API_KEY;
if (!VOYAGE_API_KEY) {
	throw new Error("Falta VOYAGE_API_KEY en el entorno.");
}

// Fuente de verdad: el JSON verificado a mano (ver
// scripts/data/informacion-verificada.json), NO el HTML del CV original.
// El HTML se scrapeaba con regex y era fragil (ver Fase4-Aprendizajes.md del
// vault, gotcha 3: un regex de cierre balanceado se comio silenciosamente
// las 4 experiencias laborales, sin tirar error). El JSON verificado ya paso
// por revision humana, asi que se lee directo, sin parseo de HTML de por
// medio -- y es el lugar donde se va a ir sumando info nueva (proyectos,
// datos adicionales) a medida que se decida que el chatbot deberia saberla.
const RUTA_INFO_VERIFICADA = path.join(__dirname, "data/informacion-verificada.json");

function chunkearCV() {
	const cv = JSON.parse(readFileSync(RUTA_INFO_VERIFICADA, "utf-8"));
	const chunks = [];

	chunks.push(`Perfil profesional de Marcos Tavio: ${cv.perfilProfesional}`);

	const h = cv.habilidadesTecnicas;
	chunks.push(
		`Habilidades tecnicas de Marcos Tavio: ` +
			`Lenguajes: ${h.lenguajes.join(", ")}. ` +
			`Frameworks y librerias: ${h.frameworksYLibrerias.join(", ")}. ` +
			`Bases de datos: ${h.basesDeDatos.join(", ")}. ` +
			`Seguridad: ${h.seguridad.join(", ")}. ` +
			`Herramientas: ${h.herramientas.join(", ")}. ` +
			`Build tools: ${h.buildTools.join(", ")}. ` +
			`Mensajeria: ${h.mensajeria.join(", ")}. ` +
			`Servidores y CI/CD: ${h.servidoresYCicd.join(", ")}. ` +
			`Cloud: ${h.cloud.join(", ")}. ` +
			`Metodologias: ${h.metodologias.join(", ")}.`,
	);

	// cada experiencia laboral es su propio chunk -- respeta el limite natural
	// de la idea (una experiencia = un tema), como aprendimos en Fase 4.
	for (const job of cv.experiencia) {
		chunks.push(
			`Experiencia laboral de Marcos Tavio: ${job.empresa} — ${job.puesto} ` +
				`(${job.periodo}). ${job.logros.join(" ")}`,
		);
	}

	chunks.push(`Educacion de Marcos Tavio: ${cv.educacion.join(" ")}`);

	chunks.push(
		`Idiomas de Marcos Tavio: Español: ${cv.idiomas.español}, Ingles: ${cv.idiomas.ingles}.`,
	);

	return chunks;
}

async function chunkearProyectos() {
	// import() dinamico exige file:// URL en Windows, no una ruta cruda C:\...
	const url = pathToFileURL(path.join(__dirname, "../src/data/projects.js"));
	const mod = await import(url.href);
	return mod.projects.map(
		(p) =>
			`Proyecto personal "${p.name}" de Marcos Tavio: ${p.description} ` +
			`Tecnologias usadas: ${p.tech.join(", ")}.` +
			(p.href ? ` Disponible en: ${p.href}.` : ""),
	);
}

async function chunkearSkills() {
	const url = pathToFileURL(path.join(__dirname, "../src/data/skills.js"));
	const mod = await import(url.href);
	const nombres = mod.skills.map((s) => s.name).join(", ");
	return [`Stack tecnologico general de Marcos Tavio: ${nombres}.`];
}

async function generarEmbeddings(textos) {
	// Un solo request con todos los textos -- la API de Voyage acepta un array
	// en "input". Evita pegarle al rate limit de cuentas sin metodo de pago
	// (3 requests/minuto), que si haciamos 1 llamada por chunk se agotaba rapido.
	const resp = await fetch("https://api.voyageai.com/v1/embeddings", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${VOYAGE_API_KEY}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ input: textos, model: "voyage-4-lite" }),
	});
	if (!resp.ok) {
		throw new Error(`Voyage API error: ${resp.status} ${await resp.text()}`);
	}
	const data = await resp.json();
	return data.data.map((d) => d.embedding);
}

async function main() {
	const chunksTexto = [
		...chunkearCV(),
		...(await chunkearProyectos()),
		...(await chunkearSkills()),
	];

	console.log(`Generando embeddings para ${chunksTexto.length} chunks (1 sola llamada a Voyage)...`);
	const embeddings = await generarEmbeddings(chunksTexto);
	const chunks = chunksTexto.map((texto, i) => ({ texto, embedding: embeddings[i] }));
	chunks.forEach((c) => console.log(`  OK: ${c.texto.slice(0, 70)}...`));

	const destino = path.join(__dirname, "../api/_data/embeddings.json");
	writeFileSync(destino, JSON.stringify({ modelo: "voyage-4-lite", chunks }, null, 2));
	console.log(`\nGuardado en ${destino}`);
}

main();
