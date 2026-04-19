import { useEffect, useRef, useState } from "react";
import { FINNHUB_API_KEY } from "../config";

/*  Live stock prices hook.
    - If FINNHUB_API_KEY is set, fetches real quotes from finnhub.io
      every 15s and also opens a WebSocket for trade ticks.
    - Caches last known live prices in localStorage so refreshes
      show real prices instantly instead of the static fallback.
    - Otherwise falls back to a smooth simulated drift so the
      site still feels alive during development.              */

const DEFAULT_BASE = {
  AAPL:  207.99, MSFT: 378.80, NVDA: 109.02, GOOGL: 159.62, AMZN: 186.40,
  TSLA:  241.37, META: 543.00, NFLX: 930.57, ORCL: 162.10, AMD:  101.20,
  JPM:   238.50, V:    341.20, MA:   516.80, BAC:   38.90,  GS:   546.30,
  JNJ:   155.40, UNH:  489.70, PFE:   25.30, LLY:   818.20,
  PG:    163.80, KO:    70.10, PEP:  131.60, WMT:    97.40, COST: 1001.50,
  DIS:    99.20, NKE:   70.40, SBUX:  82.60,
  SPY:   537.50, QQQ:  460.20, VWRL: 119.80, IEFA:   76.40,
  US10Y:  4.330, US2Y:  3.980,
};

const CACHE_KEY = "wyvern_prices_v1";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function readCache(symbols) {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) return null;
    // only return cache if it has all requested symbols
    if (!symbols.every((s) => data[s])) return null;
    return data;
  } catch {
    return null;
  }
}

function writeCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
  } catch {}
}

const EP = "https://finnhub.io/api/v1/quote";

function isFx(sym){ return sym === "US10Y" || sym === "US2Y"; }

async function fetchOne(sym){
  if (isFx(sym)) return null; // finnhub free plan has no treasuries
  try {
    const r = await fetch(`${EP}?symbol=${sym}&token=${FINNHUB_API_KEY}`);
    if (!r.ok) return null;
    const j = await r.json();
    if (typeof j.c !== "number" || j.c === 0) return null;
    return { price: j.c, prev: j.pc ?? j.c };
  } catch {
    return null;
  }
}

/* Fetch symbols in small batches to avoid Finnhub rate limits (60 req/min free tier). */
async function fetchBatch(symbols) {
  const BATCH = 5;
  const DELAY = 300; // ms between batches → ~16 req/s max, well under 60/min
  const results = [];
  for (let i = 0; i < symbols.length; i += BATCH) {
    const chunk = symbols.slice(i, i + BATCH);
    const chunkResults = await Promise.all(chunk.map(async (s) => [s, await fetchOne(s)]));
    results.push(...chunkResults);
    if (i + BATCH < symbols.length) {
      await new Promise((r) => setTimeout(r, DELAY));
    }
  }
  return results;
}

export function useStockPrices(symbols, { intervalMs = 15000 } = {}) {
  const key = symbols.join(",");
  const [data, setData] = useState(() => {
    // Use cached prices from last session if fresh — avoids flash of wrong prices on refresh
    const cached = FINNHUB_API_KEY ? readCache(symbols) : null;
    if (cached) return cached;
    const out = {};
    symbols.forEach((s) => {
      const base = DEFAULT_BASE[s] ?? 100;
      out[s] = { price: base, prev: base, live: false };
    });
    return out;
  });
  const liveRef = useRef(false);

  /* simulated fallback */
  useEffect(() => {
    if (FINNHUB_API_KEY) return;
    const id = setInterval(() => {
      setData((prev) => {
        const next = { ...prev };
        symbols.forEach((s) => {
          const cur = prev[s]?.price ?? DEFAULT_BASE[s] ?? 100;
          const drift = (Math.random() - 0.49) * 0.0015;
          const np = +(cur * (1 + drift)).toFixed(isFx(s) ? 3 : 2);
          next[s] = { price: np, prev: prev[s]?.prev ?? cur, live: false };
        });
        return next;
      });
    }, 2500);
    return () => clearInterval(id);
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  /* real feed */
  useEffect(() => {
    if (!FINNHUB_API_KEY) return;
    let cancelled = false;

    const pull = async () => {
      // stagger requests to respect Finnhub free tier rate limit
      const entries = await fetchBatch(symbols.filter(s => !isFx(s)));
      if (cancelled) return;
      setData((prev) => {
        const next = { ...prev };
        entries.forEach(([s, q]) => {
          if (!q) return;
          next[s] = { price: q.price, prev: q.prev, live: true };
        });
        // persist to localStorage so next refresh starts with real prices
        writeCache(next);
        return next;
      });
      liveRef.current = true;
    };

    pull();
    const id = setInterval(pull, intervalMs);

    /* websocket for intra-poll updates */
    let ws;
    try {
      ws = new WebSocket(`wss://ws.finnhub.io?token=${FINNHUB_API_KEY}`);
      ws.onopen = () => {
        symbols.forEach((s) => {
          if (!isFx(s)) ws.send(JSON.stringify({ type: "subscribe", symbol: s }));
        });
      };
      ws.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data);
          if (msg.type !== "trade" || !Array.isArray(msg.data)) return;
          setData((prev) => {
            const next = { ...prev };
            msg.data.forEach((t) => {
              if (!next[t.s]) return;
              next[t.s] = {
                price: t.p,
                prev: next[t.s].prev ?? t.p,
                live: true,
              };
            });
            writeCache(next);
            return next;
          });
        } catch {}
      };
    } catch {}

    return () => {
      cancelled = true;
      clearInterval(id);
      try { ws?.close(); } catch {}
    };
  }, [key, intervalMs]); // eslint-disable-line react-hooks/exhaustive-deps

  return data;
}

/* Fetch recent OHLC candles for detail charts.
   Uses finnhub if key is set, else generates a plausible series. */
export async function fetchCandles(symbol, days = 30) {
  if (FINNHUB_API_KEY && !isFx(symbol)) {
    const to = Math.floor(Date.now() / 1000);
    const from = to - days * 24 * 3600;
    try {
      const r = await fetch(
        `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`
      );
      const j = await r.json();
      if (j.s === "ok" && Array.isArray(j.c) && j.c.length) {
        return j.c.map((close, i) => ({ t: j.t[i] * 1000, c: close }));
      }
    } catch {}
  }
  /* simulated */
  const base = DEFAULT_BASE[symbol] ?? 100;
  const out = [];
  let p = base * (0.9 + Math.random() * 0.1);
  const now = Date.now();
  for (let i = days; i >= 0; i--) {
    p = +(p * (1 + (Math.random() - 0.48) * 0.022)).toFixed(2);
    out.push({ t: now - i * 24 * 3600 * 1000, c: p });
  }
  /* nudge last point toward current base price */
  out[out.length - 1].c = base;
  return out;
}
