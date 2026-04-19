import { C } from "../../theme/colors";
import { BASE_PRICES } from "../../data/landingContent";

export function TickerBar({ prices }) {
  const SYMS = ["AAPL", "MSFT", "TSLA", "NVDA", "US10Y", "AMZN", "GOOGL", "BTC", "SPY"];
  const items = [...SYMS, ...SYMS, ...SYMS];
  return (
    <div style={{ overflow: "hidden", padding: "12px 0", background: "rgba(255,255,255,0.02)", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
      <div className="ticker-track">
        {items.map((sym, i) => {
          const d = prices[sym] || { price: BASE_PRICES[sym], prev: BASE_PRICES[sym] };
          const cur = d.price;
          const prev = d.prev || cur;
          const pct = prev > 0 ? ((cur - prev) / prev * 100).toFixed(2) : "0.00";
          const up = cur >= prev;
          return (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "0 28px", fontFamily: "'DM Mono',monospace" }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.text, letterSpacing: "0.05em" }}>{sym}</span>
              <span style={{ fontSize: 12, color: C.dim }}>{sym === "US10Y" ? cur.toFixed(2) + "%" : sym === "BTC" ? "$" + Math.round(cur).toLocaleString() : "$" + cur.toFixed(2)}</span>
              <span style={{ fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 4, background: up ? "rgba(16,217,160,0.1)" : "rgba(244,63,94,0.1)", color: up ? C.mint : C.rose }}>{up ? "+" : ""}{pct}%</span>
              <span style={{ width: 1, height: 12, background: C.border, display: "inline-block" }}/>
            </span>
          );
        })}
      </div>
    </div>
  );
}
