/* ─────────────────────────────────────────────
   WYVERN PROTOCOL – CENTRAL CONFIG
   ─────────────────────────────────────────────
   When you launch your token on pump.fun:
     1. Set TOKEN.launched = true
     2. Paste your contract address into TOKEN.ca
     3. Paste your pump.fun URL into TOKEN.pumpfunUrl
   The WYV card in the hero, the Buy button,
   and the ticker will all update automatically.
   ───────────────────────────────────────────── */

export const TOKEN = {
  launched: false,
  ca: null,              // e.g. "7xKX...pump"
  pumpfunUrl: null,      // e.g. "https://pump.fun/coin/7xKX..."
  symbol: "WYV",
  name: "Wyvern Protocol",
};

export const SOCIALS = {
  twitter:  "https://x.com/WyvernProtocoI",
  github:   "https://github.com/WProtocol/WyvernP",
  telegram: "https://t.me/WyvernprotocoI",
  docs:     "/docs",
};

/* Finnhub API key for live stock prices. Free tier: https://finnhub.io
   Set VITE_FINNHUB_API_KEY in .env.local — NEVER commit it.
   Leave empty to use simulated prices.                                  */
export const FINNHUB_API_KEY = import.meta.env.VITE_FINNHUB_API_KEY || "";
