export default {
    async fetch(req, env, ctx) {
        const url = new URL(req.url);

        if (url.pathname === "/api/chat" && req.method === "POST") {
            const { message = "" } = await req.json().catch(() => ({ meesage: ""}));
            // Stub response for now; proves the path + CORS + JSON work
            return json({ answer: `Stub reply: you said "${message}"` });
        }

        // Health for quick checks
    if (url.pathname === "/health") return new Response("ok");

    // Anything else falls back to static asssets (Pages) durnig dev
    return new Response("OK", { status: 200 });

    }
};

function json(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { "content-type": "application/json"}
    });
}

// Placeholder Durable Object
export class SessionDO {
    constructor(state, env) { this.state = state; this.env = env; }
    async fetch(req) { return new Response("not-implemented", { status: 501}); }
}
