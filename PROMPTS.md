# Prompts Used During Development

## Project Setup & Structure

Prompt examples:
- “How do I structure a Cloudflare Worker project that uses Durable Objects and Workers AI?”
- “Where should I place my public folder and how do I configure it in wrangler.toml?”
- “What should my .gitignore include for a Worker using npm and Wrangler?”

---

## Backend Logic (`worker.mjs`)

Prompt examples:
- “How do I connect a Durable Object to store chat session memory?”
- “How do I add a Workers AI call using the Llama 3.3 model to generate assistant responses?”
- “Fix: Send the sessionId in the POST body so the Durable Object can keep memory.”
- “Don’t parse JSON twice — how do I fix that?”

---

## Durable Object (`session-do.mjs`)

Prompt examples:
- “Explain what the ‘turn’ object represents in chat session memory.”
- “How do I store and retrieve the last 12 messages per session?”
- “Comment this file to make it easy to understand.”

---

## Frontend (`public/index.html`)

Prompt examples:
- “Add ‘typing…’ indicator and autocomplete="off" for the input.”
- “Fix button formatting and form submission.”
- “Show how to send message and receive AI response from /api/chat.”

---

## External API (`fx.js`)

Prompt examples:
- “Write a helper that fetches rates from Frankfurter for pairs like USD_EUR.”
- “Add timeout logic and cacheTtl.”
---

## Debugging & Deployment

Prompt examples:
- “How do I fix TLS peer's certificate is not trusted; reason = Hostname mismatch?”
- “How do I authenticate Wrangler using an API token safely?”
---


## Outcome

Using these prompts iteratively led to:
- A working full-stack Worker app with session memory and AI inference.
- Proper handling of Cloudflare environment variables and bindings.
- A secure setup process without exposing API tokens.
