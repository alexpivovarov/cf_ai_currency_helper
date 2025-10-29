# 💬 cf_ai_currency_helper

A Cloudflare Workers AI chatbot that provides **live foreign exchange (FX) rates** using the **Frankfurter API**.  
It runs fully on the **Cloudflare edge**, uses **Durable Objects** for short-term memory, and integrates **Workers AI** (Llama 3) for natural language responses.

---

## 🚀 Features
- 🌍 Fetches real-time FX rates from [Frankfurter.app](https://www.frankfurter.app)
- 🤖 Uses Cloudflare **Workers AI** (`@cf/meta/llama-3.3-70b-instruct-fp8`)
- 💾 Keeps conversation context via **Durable Objects (SessionDO)**
- ⚡ Runs completely serverless on **Cloudflare Workers**
- 🧱 Static frontend served from `src/public/`

---

## How It Works

1. **`src/fx.js`** — Extracts currency pairs (like `USD_EUR`) from text and fetches their rates from Frankfurter.  
2. **`src/worker.mjs`** — Handles chat messages (`/api/chat`), calls both the FX API and Workers AI, and manages the logic for fallback text.  
3. **`src/session-do.mjs`** — Stores recent chat messages (both user and assistant) in memory to simulate session history.  
4. **`wrangler.toml`** — Configures bindings for AI, Durable Objects, and asset hosting on Cloudflare.

---

## Tech Stack
- **Cloudflare Workers**
- **Workers AI**
- **Durable Objects**
- **Frankfurter FX API**
- **Wrangler CLI**
- **JavaScript (ES Modules)**

---

## 🧑‍💻 Setup & Run

1️⃣ Clone & Install
```bash
git clone https://github.com/alexpivovarov/cf_ai_currency_helper.git
cd cf_ai_currency_helper
npm install

2️⃣ Log into Cloudflare
npx wrangler login

3️⃣ Run remotely (recommended)
npx wrangler dev


---

Working prompts

	•	“What is USD_EUR now?”
	•	“Give me the latest EUR_GBP rate.”
	•	“How much is GBP_USD?”
	•	“Show me rates for USD_EUR and USD_GBP.”
	•	“What’s the current JPY_USD exchange rate?”

---

