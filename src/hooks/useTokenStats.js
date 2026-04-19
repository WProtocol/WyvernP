import { useEffect, useState } from "react";
import { TOKEN } from "../config";

/* Live WYV token stats from DexScreener, updated every 30s.
   Returns null until the token launches (TOKEN.launched && TOKEN.ca).
   Once live, returns { price, marketCap, volume24h, liquidity }. */
export function useTokenStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!TOKEN.launched || !TOKEN.ca) return;

    let cancelled = false;

    async function fetchStats() {
      try {
        const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${TOKEN.ca}`);
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;

        const pair = data?.pairs?.[0];
        if (!pair) return;

        setStats({
          price: Number(pair.priceUsd) || 0,
          marketCap: pair.marketCap ?? pair.fdv ?? 0,
          volume24h: pair.volume?.h24 ?? 0,
          liquidity: pair.liquidity?.usd ?? 0,
        });
      } catch {
        // silently ignore fetch errors — keep last known stats
      }
    }

    fetchStats();
    const id = setInterval(fetchStats, 30_000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  return stats;
}
