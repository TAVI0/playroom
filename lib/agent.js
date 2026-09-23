/**
 * Wiring: instancia el modelo y arma el agente. Un solo lugar para
 * cambiar de modelo/proveedor o ajustar parametros, sin tocar el handler
 * HTTP ni la logica de las tools.
 */

import { ChatAnthropic } from "@langchain/anthropic";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { TODAS_LAS_TOOLS } from "./tools.js";

const model = new ChatAnthropic({
	model: "claude-haiku-4-5",
	temperature: 0,
	maxTokens: 250,
	apiKey: process.env.ANTHROPIC_API_KEY,
});

export const agente = createReactAgent({ llm: model, tools: TODAS_LAS_TOOLS });
