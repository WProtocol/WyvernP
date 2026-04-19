import { useState, useEffect } from "react";
import { useStockPrices } from "./useStockPrices";
import { BASE_PRICES } from "../data/landingContent";

/* Returns { SYM: { price, prev } } for all ticker symbols.
   prev = previous close from Finnhub (used for accurate daily % change). */
export function useLivePrices() {
  const syms = ["AAPL", "MSFT", "TSLA", "NVDA", "AMZN", "GOOGL", "SPY"];
  const live = useStockPrices(syms);
  const [btc, setBtc] = useState({ price: BASE_PRICES.BTC, prev: BASE_PRICES.BTC });
  const [ust, setUst] = useState({ price: BASE_PRICES["US10Y"], prev: BASE_PRICES["US10Y"] });

  useEffect(() => {
    async function fetchBtc() {
      try {
        const r = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true");
        const d = await r.json();
        if (d?.bitcoin?.usd) {
          const cur = d.bitcoin.usd;
          const chgPct = d.bitcoin.usd_24h_change || 0;
          const prev = +(cur / (1 + chgPct / 100)).toFixed(2);
          setBtc({ price: cur, prev });
        }
      } catch {}
    }
    fetchBtc();
    const id = setInterval(fetchBtc, 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setUst(p => ({ ...p, price: +(p.price * (1 + (Math.random() - 0.5) * 0.0005)).toFixed(3) }));
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const out = {};
  Object.keys(BASE_PRICES).forEach(s => {
    out[s] = { price: BASE_PRICES[s], prev: BASE_PRICES[s] };
  });
  syms.forEach(s => {
    if (live[s]?.price) out[s] = { price: live[s].price, prev: live[s].prev ?? live[s].price };
  });
  out["BTC"] = btc;
  out["US10Y"] = ust;
  return out;
}
