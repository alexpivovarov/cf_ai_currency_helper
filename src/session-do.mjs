// Durable Object class that manages per-session chat history
export class SessionDO {
    constructor(state, env){
        // Each Durable Object instance has its own isolated state storage
         this.state = state; 
         // Access to environment bindings
         this.env = env; 
    }
    
    // Main handler for incoming events
    async fetch(req){
        let payload = {};
        // Safely parse the request body
        try { payload = await req.json(); } catch {}

        // Extract session ID
        const { sessionId = "anon", turn } = payload;

        // Build a unique key for each session's chat history
        const key = `chat:${sessionId}`;
        // Retrieve previous messages from Durable Object storage (if any)
        const hist = (await this.state.storage.get(key)) || [];

        // If a new message ("turn") is provided, append it and keep only the last 12
        if (turn) { 
            hist.push(turn); 
            await this.state.storage.put(key, hist.slice(-12)); 
        }

        // Return the last 12 turns of conversation as JSON
        return new Response(JSON.stringify({ history: hist.slice(-12) }), { 
            headers: { "content-type":"application/json"}
        });   
    }
}