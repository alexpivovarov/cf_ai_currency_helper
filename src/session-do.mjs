export class SessionDO {
    constructor(state, env){
         this.state = state; 
         this.env = env; 
    }
    
    async fetch(req){
        let payload = {};
        try { payload = await req.json(); } catch {}
        const { sessionId = "anon", turn } = payload;

        const key = `chat:${sessionId}`;
        const hist = (await this.state.storage.get(key)) || [];

        if (turn) { 
            hist.push(turn); 
            await this.state.storage.put(key, hist.slice(-12)); 
        }

        return new Response(JSON.stringify({ history: hist.slice(-12) }), { 
            headers: { "content-type":"application/json"}
        });   
    }
}