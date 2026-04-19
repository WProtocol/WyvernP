import { useEffect, useState } from "react";
import { ArrowUpRight, ArrowDownRight, ChevronRight } from "lucide-react";
import { C } from "../../theme/colors";
import { useInView } from "../../hooks/useInView";
import { SLabel, H2 } from "./shared";

const TICKERS = [
  { sym: "AAPL", name: "Apple Inc.",   price: 213.42, chg:  1.24 },
  { sym: "NVDA", name: "NVIDIA",        price: 138.07, chg:  3.81 },
  { sym: "MSFT", name: "Microsoft",     price: 441.20, chg: -0.42 },
  { sym: "SPY",  name: "S&P 500 ETF",   price: 601.55, chg:  0.63 },
  { sym: "TSLA", name: "Tesla",         price: 241.37, chg:  2.05 },
  { sym: "US10Y",name: "10yr UST",      price:   4.33, chg:  0.18 },
];

const ACTIVITY = [
  { type: "FILL", sym: "AAPL",  qty:  3, price: 213.42, time: "0.38s" },
  { type: "FILL", sym: "NVDA",  qty: 12, price: 138.07, time: "0.41s" },
  { type: "DIV",  sym: "AAPL",  qty: "—", price:   0.24, time: "auto" },
  { type: "FILL", sym: "BOND",  qty:  5, price:  98.10, time: "0.36s" },
];

export function DashboardPreview() {
  const [ref, inView] = useInView();
  const [tick, setTick] = useState(0);

  // Subtle live-feel: tickers nudge slightly every 2.5s
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 2500);
    return () => clearInterval(id);
  }, []);

  return (
    <section ref={ref} style={{ padding: "120px 48px", borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <SLabel num="04">A look inside</SLabel>
        <H2>What you actually <span className="gradient-text">use.</span></H2>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, lineHeight: 1.75, color: C.muted, maxWidth: 640, marginBottom: 56 }}>
          Three panes. Markets, chart, order. Click a row, hit buy, watch it settle on Solana before the modal closes. That's the whole product.
        </p>

        <div
          className={inView ? "fade-in-stagger" : ""}
          style={{
            display: "grid",
            gridTemplateColumns: "260px 1fr 320px",
            gap: 0,
            background: C.bg2,
            border: `1px solid ${C.border}`,
            borderRadius: 18,
            overflow: "hidden",
            boxShadow: "0 30px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(139,127,255,0.08)",
            minHeight: 540,
          }}
        >
          {/* LEFT: Market list */}
          <div style={{ borderRight: `1px solid ${C.border}`, padding: "20px 0" }}>
            <div style={{ padding: "0 20px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: C.dim }}>Markets</span>
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: 9,
                  letterSpacing: "0.14em",
                  color: C.mint,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.mint, animation: "pulse-dot 1.5s infinite" }}/>
                LIVE
              </span>
            </div>
            {TICKERS.map((t, i) => {
              const isActive = i === 0;
              const drift = Math.sin((tick + i) * 0.7) * 0.04;
              const livePrice = t.price * (1 + drift / 100);
              return (
                <div
                  key={t.sym}
                  style={{
                    padding: "12px 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderLeft: isActive ? `2px solid ${C.violet}` : "2px solid transparent",
                    background: isActive ? "rgba(139,127,255,0.08)" : "transparent",
                    cursor: "default",
                  }}
                >
                  <div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 700, color: C.text }}>{t.sym}</div>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: C.muted, marginTop: 1 }}>{t.name}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: C.text }}>
                      {t.sym === "US10Y" ? livePrice.toFixed(2) + "%" : "$" + livePrice.toFixed(2)}
                    </div>
                    <div style={{ fontFamily: "monospace", fontSize: 10, color: t.chg >= 0 ? C.mint : C.rose }}>
                      {t.chg >= 0 ? "+" : ""}{t.chg.toFixed(2)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CENTER: Active asset chart + meta */}
          <div style={{ padding: "20px 24px", borderRight: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 38, height: 38, borderRadius: 9,
                    background: "linear-gradient(135deg, rgba(139,127,255,0.22), rgba(34,211,238,0.12))",
                    border: "1px solid rgba(139,127,255,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "monospace", fontSize: 12, fontWeight: 800, color: C.violet,
                  }}
                >
                  AP
                </div>
                <div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 17, fontWeight: 700, color: C.text }}>AAPL</div>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.muted }}>Apple Inc. · Tokenized</div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: C.text, letterSpacing: "-0.02em" }}>$213.42</div>
                <div style={{ fontFamily: "monospace", fontSize: 11, color: C.mint }}>+1.24% today</div>
              </div>
            </div>

            {/* Chart */}
            <div
              style={{
                background: "rgba(255,255,255,0.02)",
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: "14px 16px",
                marginBottom: 16,
                position: "relative",
              }}
            >
              <svg viewBox="0 0 600 180" width="100%" height={180} style={{ display: "block" }}>
                <defs>
                  <linearGradient id="dp-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.mint} stopOpacity="0.28"/>
                    <stop offset="100%" stopColor={C.mint} stopOpacity="0"/>
                  </linearGradient>
                  <linearGradient id="dp-line" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={C.cyan}/>
                    <stop offset="100%" stopColor={C.mint}/>
                  </linearGradient>
                </defs>
                <path
                  d="M0,140 L40,128 L80,135 L120,118 L160,124 L200,110 L240,116 L280,98 L320,104 L360,82 L400,86 L440,68 L480,72 L520,52 L560,42 L600,32 L600,180 L0,180 Z"
                  fill="url(#dp-fill)"
                />
                <path
                  d="M0,140 L40,128 L80,135 L120,118 L160,124 L200,110 L240,116 L280,98 L320,104 L360,82 L400,86 L440,68 L480,72 L520,52 L560,42 L600,32"
                  stroke="url(#dp-line)"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="600" cy="32" r="5" fill={C.mint} />
                <circle cx="600" cy="32" r="11" fill={C.mint} fillOpacity="0.2" />
              </svg>
              <div
                style={{
                  position: "absolute",
                  top: 14,
                  right: 16,
                  display: "flex",
                  gap: 6,
                }}
              >
                {["1D", "5D", "1M", "1Y", "MAX"].map((r, i) => (
                  <span
                    key={r}
                    style={{
                      fontFamily: "monospace",
                      fontSize: 10,
                      padding: "3px 8px",
                      borderRadius: 4,
                      border: `1px solid ${i === 0 ? C.violet : C.border}`,
                      background: i === 0 ? "rgba(139,127,255,0.12)" : "transparent",
                      color: i === 0 ? C.violet : C.muted,
                    }}
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>

            {/* Metric strip */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              {[
                ["Market cap", "$3.22T"],
                ["Sector", "Tech"],
                ["Settlement", "Atomic DvP"],
                ["Reserve", "1:1"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    padding: "10px 12px",
                    background: C.surface,
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                  }}
                >
                  <div style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: C.dim, marginBottom: 4 }}>{k}</div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 12, fontWeight: 600, color: C.text }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Order ticket + activity */}
          <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: C.dim, marginBottom: 12 }}>
                Buy AAPL
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: C.surface, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.text, fontSize: 16 }}>−</div>
                <div style={{ flex: 1, height: 36, borderRadius: 8, background: "rgba(139,127,255,0.08)", border: "1px solid rgba(139,127,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontSize: 16, fontWeight: 700, color: C.text }}>3</div>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: C.surface, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.text, fontSize: 16 }}>+</div>
              </div>
              <div style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "12px 0", display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
                {[["Unit", "$213.42"], ["Qty", "3"], ["Fee", "<$0.01"]].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.muted }}>{k}</span>
                    <span style={{ fontFamily: "monospace", fontSize: 11, color: C.text }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
                <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: C.dim }}>Total</span>
                <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: C.text }}>$640.26</span>
              </div>
              <div
                className="btn-gradient"
                style={{
                  padding: "12px 16px",
                  borderRadius: 10,
                  textAlign: "center",
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#fff",
                  letterSpacing: "0.03em",
                }}
              >
                Buy 3 AAPL
              </div>
            </div>

            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
              <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: C.dim, marginBottom: 12 }}>
                Recent activity
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {ACTIVITY.map((a, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 10px",
                      background: C.surface,
                      borderRadius: 6,
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {a.type === "DIV" ? <ArrowDownRight size={12} color={C.cyan} /> : <ArrowUpRight size={12} color={C.mint} />}
                      <span style={{ fontFamily: "monospace", fontSize: 10, color: C.text, fontWeight: 600 }}>
                        {a.type} · {a.sym} {a.qty !== "—" && `· ${a.qty}`}
                      </span>
                    </div>
                    <span style={{ fontFamily: "monospace", fontSize: 10, color: C.mint }}>{a.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
