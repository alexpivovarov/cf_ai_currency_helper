// src/fx.js (new)
const FX_TIMEOUT_MS = 2500;

export async function fetchFromFrankfurter(pairs) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort("timeout"), FX_TIMEOUT_MS);
  try {
    const results = await Promise.all(
      pairs.map(async (p) => {
        const [base, quote] = p.split("_");
        const res = await fetch(
          `https://api.frankfurter.app/latest?from=${base}&to=${quote}`,
          { cf: { cacheTtl: 30 }, signal: controller.signal }
        );
        if (!res.ok) return [p, null];
        const data = await res.json().catch(() => ({}));
        const val = data?.rates?.[quote];
        return [p, typeof val === "number" ? val : null];
      })
    );
    const out = {};
    for (const [pair, val] of results) if (val != null) out[pair] = val;
    return out;
  } finally {
    clearTimeout(t);
  }
}

export function extractPairs(text) {
  // Finds tokens like USD_EUR, EUR_GBP, GBP_USD, etc.
  return (text.toUpperCase().match(/\b[A-Z]{3}_[A-Z]{3}\b/g) || [])
    .slice(0, 6); // keep it small
}
