/**
 * Rate limit en memoria por IP -- vive mientras la funcion serverless este
 * "caliente" (Vercel puede reciclarla entre invocaciones -- no es 100% a
 * prueba de abuso deliberado, pero cubre el caso de uso real de un sitio
 * personal). Modulo aparte: es infraestructura generica, no algo especifico
 * del chat -- si mañana hay otro endpoint que necesite limitar, se reusa.
 */

const MAX_PREGUNTAS_POR_VENTANA = 5;
const VENTANA_MS = 10 * 60 * 1000; // 10 minutos

const contadorPorIp = new Map();

export function estaLimitado(ip) {
	const ahora = Date.now();
	const registro = contadorPorIp.get(ip);
	if (!registro || ahora - registro.desde > VENTANA_MS) {
		contadorPorIp.set(ip, { count: 1, desde: ahora });
		return false;
	}
	registro.count += 1;
	return registro.count > MAX_PREGUNTAS_POR_VENTANA;
}

export { MAX_PREGUNTAS_POR_VENTANA };
