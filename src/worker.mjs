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

        // AI block
        const sys = "You are a concise foreign exchange assistant. If the user asks about a pair, include the live rate provided.";
        const userMsg = message;
        const context = Object.keys(rates).length
            ? "Context rates:\n" + Object.entries(rates).map(([k,v]) => `${k}: ${v}`).join("\n")
            : "No rates found.";

        const aiInput = {
            model: "@cf/meta/llama-3.3-70b-instruct-fp8",
            messages: [
                { role: "system", content: sys },
                { role: "user", content: `${userMsg}\n\n${context}` }
            ]
        };

        let aiAnswer = "";
        try {
            const aiRes = await env.AI.run(aiInput);
            aiAnswer = aiRes?.response || "";
        } catch (e) {
            console.error("Workers AI error:", e)
            aiAnswer = ""; // fall back if AI has an issue
        }

        // fallback text if AI returns nothing
        const fallback = Object.keys(rates).length
            ? "Live rates:\n" + Object.entries(rates).map(([k,v]) => `${k}: ${v ?? "(no rate)"}`).join("\n")
            : "Ask me about a pair like USD_EUR.";
        
        const answer = aiAnswer || fallback;

        return new Response(JSON.stringify({
            sessionId, answer, rates, fxMeta: { source: "frankfurter" }
            }), 
            { headers: { "content-type": "application/json" }}
        );
    }

    // serve /public
    return env.ASSETS.fetch(req);
  },
};
