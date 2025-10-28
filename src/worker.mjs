// src/worker.mjs
import { extractPairs, fetchFromFrankfurter } from "./fx.js";

export default {
  async fetch(req, env) {
    const url = new URL(req.url);

    if (url.pathname === "/health") return new Response("ok");

    if (url.pathname === "/api/chat" && req.method === "POST") {
      const { sessionId = "anon", message = "" } = await req.json();

      // 1) parse pairs mentioned by the user
      const pairs = extractPairs(message);
      // 2) fetch live rates from Frankfurter
      const rates = pairs.length ? await fetchFromFrankfurter(pairs) : {};

      // 3) simple AI-less reply for now (or pass `rates` as context to Workers AI)
      const lines = pairs.length
        ? pairs.map(p => `${p}: ${rates[p] ?? "(no rate)"}`).join("\n")
        : "Ask me about a pair like USD_EUR.";
      const answer = pairs.length ? `Live rates:\n${lines}` : lines;

      return new Response(JSON.stringify({ sessionId, answer, pairs, rates, fxMeta: { source: "frankfurter" } }), {
        headers: { "content-type": "application/json" }
      });
    }

    // serve /public
    return env.ASSETS.fetch(req);
  }
};
