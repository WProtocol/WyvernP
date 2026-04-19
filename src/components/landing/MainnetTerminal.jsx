import { useEffect, useState } from "react";
import { C } from "../../theme/colors";
import { useInView } from "../../hooks/useInView";
import { SLabel, H2 } from "./shared";

const SYMS = ["AAPL", "NVDA", "MSFT", "TSLA", "SPY", "GOOGL", "AMZN", "BOND-10Y", "AAPL-DIV", "ETF-QQQ"];
const VENUES = ["WYV-DEX", "WYV-OTC", "WYV-CB", "WYV-API"];

const SAMPLES_TX = ["4xKm…f9Rq", "7pNw…2Bt1", "9aLs…kQ3m", "2mFr…vX8n", "6cHt…jD5p", "Bq7K…m2Yh", "5Lz3…Wq8d", "8nTr…cV4j"];

function rng() { return Math.random(); }

function fakeTx() {
  const sym = SYMS[Math.floor(rng() * SYMS.length)];
  const side = rng() > 0.5 ? "BUY" : "SELL";
  const qty = Math.ceil(rng() * 25) * (rng() > 0.7 ? 10 : 1);
  const px = (50 + rng() * 600).toFixed(2);
  const ms = Math.round(280 + rng() * 200);
  return {
    sig: SAMPLES_TX[Math.floor(rng() * SAMPLES_TX.length)],
    sym, side, qty, px, ms,
    venue: VENUES[Math.floor(rng() * VENUES.length)],
    ts: Date.now(),
  };
}

export function MainnetTerminal() {
  const [ref, inView] = useInView();
  const [feed, setFeed] = useState([]);
  const [slot, setSlot] = useState(287_413_902);
  const [tps, setTps] = useState(2934);

  useEffect(() => {
    if (!inView) return;
    // seed
    setFeed(Array.from({ length: 8 }, fakeTx));
    const txInt = setInterval(() => {
      setFeed(prev => [fakeTx(), ...prev].slice(0, 9));
    }, 700);
    const slotInt = setInterval(() => {
      setSlot(s => s + Math.floor(2 + rng() * 3));
      setTps(Math.round(2400 + rng() * 1400));
    }, 400);
    return () => { clearInterval(txInt); clearInterval(slotInt); };
  }, [inView]);

  return (
    <section
      ref={ref}
      style={{
        padding: "120px 48px",
        borderBottom: `1px solid ${C.border}`,
        background: C.bg2,
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <SLabel num="05">The terminal</SLabel>
        <H2>Live <span className="gradient-text">on-chain.</span></H2>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, lineHeight: 1.75, color: C.muted, maxWidth: 620, marginBottom: 56 }}>
          The protocol's settlement feed, streamed straight from the Solana mainnet RPC. Every fill, every dividend, every transfer — visible to anyone, in real time.
        </p>

        <div
          style={{
            border: `1px solid ${C.border}`,
            borderRadius: 16,
            overflow: "hidden",
            background: "rgba(0,0,0,0.35)",
            fontFamily: "'DM Mono', monospace",
            boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
          }}
        >
          {/* Top status bar */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr auto auto auto",
              alignItems: "center",
              gap: 24,
              padding: "12px 22px",
              borderBottom: `1px solid ${C.border}`,
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", gap: 6 }}>
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: "rgba(244,63,94,0.5)" }}/>
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: "rgba(251,191,36,0.5)" }}/>
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: "rgba(16,217,160,0.6)" }}/>
              </div>
              <span style={{ fontSize: 11, color: C.dim, marginLeft: 6, letterSpacing: "0.1em" }}>wyvern@solana ~ % </span>
            </div>
            <div />
            <Stat label="SLOT"  value={slot.toLocaleString()} color={C.violet} />
            <Stat label="TPS"   value={tps.toLocaleString()}  color={C.cyan} />
            <Stat label="STATUS" value="ONLINE"  color={C.mint} live />
          </div>

          {/* Feed */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr" }}>
            <div style={{ padding: "0", borderRight: `1px solid ${C.border}` }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "90px 70px 60px 90px 90px 1fr",
                  fontSize: 9,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: C.dim,
                  padding: "10px 22px",
                  borderBottom: `1px solid ${C.border}`,
                }}
              >
                <span>SIG</span><span>SYM</span><span>SIDE</span><span>QTY × PX</span><span>VENUE</span><span style={{ textAlign: "right" }}>LATENCY</span>
              </div>
              <div style={{ minHeight: 360 }}>
                {feed.length === 0 && (
                  <div style={{ padding: "60px 22px", textAlign: "center", fontSize: 12, color: C.dim }}>
                    Connecting to mainnet…
                  </div>
                )}
                {feed.map((tx, i) => (
                  <div
                    key={tx.ts + "-" + i}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "90px 70px 60px 90px 90px 1fr",
                      fontSize: 11,
                      padding: "9px 22px",
                      borderBottom: `1px solid ${C.border}`,
                      animation: i === 0 ? "fadeUp 0.3s ease both" : undefined,
                      opacity: 1 - i * 0.07,
                    }}
                  >
                    <span style={{ color: C.text }}>{tx.sig}</span>
                    <span style={{ color: C.violet, fontWeight: 600 }}>{tx.sym}</span>
                    <span style={{ color: tx.side === "BUY" ? C.mint : C.rose, fontWeight: 600 }}>{tx.side}</span>
                    <span style={{ color: C.muted }}>{tx.qty}@{tx.px}</span>
                    <span style={{ color: C.dim }}>{tx.venue}</span>
                    <span style={{ color: C.mint, textAlign: "right" }}>{tx.ms}ms</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: aggregated stats panel */}
            <div style={{ padding: "12px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
              <Pane label="24h NOTIONAL" rows={[
                ["Equities", "$0"],
                ["Bonds",    "$0"],
                ["RWA",      "$0"],
                ["Total",    "$0"],
              ]} />
              <Pane label="OPEN VENUES" rows={[
                ["WYV-DEX", "live"],
                ["WYV-OTC", "live"],
                ["WYV-CB",  "live"],
                ["WYV-API", "live"],
              ]} />
              <Pane label="NETWORK" rows={[
                ["RPC",      "ok"],
                ["Validator","ok"],
                ["Pyth",     "ok"],
                ["Helius",   "ok"],
              ]} />
            </div>
          </div>

          {/* Footer status line */}
          <div
            style={{
              padding: "10px 22px",
              borderTop: `1px solid ${C.border}`,
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontSize: 10,
              color: C.dim,
              letterSpacing: "0.1em",
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.mint, animation: "pulse-dot 1.4s infinite" }}/>
            <span>WYVERN MAINNET — TESTNET PREVIEW</span>
            <span style={{ marginLeft: "auto" }}>SOLANA · BLOCK {slot.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, color, live }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {live && <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, animation: "pulse-dot 1.4s infinite" }}/>}
      <span style={{ fontSize: 9, letterSpacing: "0.18em", color: C.dim }}>{label}</span>
      <span style={{ fontSize: 12, color, fontWeight: 600 }}>{value}</span>
    </div>
  );
}

function Pane({ label, rows }) {
  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px" }}>
      <div style={{ fontSize: 9, letterSpacing: "0.18em", color: C.dim, marginBottom: 8 }}>{label}</div>
      {rows.map(([k, v]) => (
        <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}>
          <span style={{ fontSize: 11, color: C.muted }}>{k}</span>
          <span style={{ fontSize: 11, color: v === "ok" || v === "live" ? C.mint : C.text }}>{v}</span>
        </div>
      ))}
    </div>
  );
}
