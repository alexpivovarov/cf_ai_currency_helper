const FX_TIMEOUT_MS = 2500;

// Fetch the latest FX rates for a list of pairs from Frankfurter.
export async function fetchFromFrankfurter(pairs) {
  // Abort controller to cancel all fetches if they exceed the timeout
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort("timeout"), FX_TIMEOUT_MS);

  try {
    // Fire all requests in parallel; each pair becomes one HTTP request
    const results = await Promise.all(
      pairs.map(async (p) => {
        const [base, quote] = p.split("_");

        // Cloudflare Workers "fetch" with samll edge cache (30s) and shared abort signal
        const res = await fetch(
          `https://api.frankfurter.app/latest?from=${base}&to=${quote}`,
          { cf: { cacheTtl: 30 }, signal: controller.signal }
        );

        // If request failed, return null for this pair
        if (!res.ok) return [p, null];

        const data = await res.json().catch(() => ({}));

        // Frankfurter returns: { rates: { [quote]: number } }
        const val = data?.rates?.[quote];

        // Only accept numeric values
        return [p, typeof val === "number" ? val : null];
      })
    );

    // Build a compact map of pair -> rate 
    const out = {};
    for (const [pair, val] of results) if (val != null) out[pair] = val;
    return out;

  } finally {
    // Clearing timeout
    clearTimeout(t);
  }
}

export function extractPairs(text) {
  // Finds tokens like USD_EUR, EUR_GBP, GBP_USD, etc.
  return (text.toUpperCase().match(/\b[A-Z]{3}_[A-Z]{3}\b/g) || [])
    .slice(0, 6); 
}
