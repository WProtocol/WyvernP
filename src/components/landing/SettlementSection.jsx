import { useState, useEffect } from "react";
import { C } from "../../theme/colors";
import { useInView } from "../../hooks/useInView";
import { H2 } from "./shared";

export function SettlementSection() {
  const [ref, inView] = useInView();
  const [txs, setTxs] = useState([]);
  useEffect(() => {
    if (!inView) return;
    const sigs = ["4xKm…f9Rq", "7pNw…2Bt1", "9aLs…kQ3m", "2mFr…vX8n", "6cHt…jD5p"];
    let idx = 0;
    const id = setInterval(() => {
      setTxs(prev => [{ sig: sigs[idx % sigs.length], time: Date.now(), ms: (Math.random() * 150 + 280).toFixed(0) }, ...prev].slice(0, 6));
      idx++;
    }, 1400);
    return () => clearInterval(id);
  }, [inView]);
  return (
    <section ref={ref} style={{ padding: "120px 48px", borderBottom: `1px solid ${C.border}`, background: C.bg2 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
        <div>
          <div style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: C.violet, marginBottom: 16 }}>DVP ENGINE / LIVE</div>
          <H2 style={{ marginBottom: 20 }}>Settlement<br/><span className="gradient-text">Engine.</span></H2>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, lineHeight: 1.8, color: C.muted, marginBottom: 40 }}>
            Watch atomic Delivery vs Payment execution in real-time. Securities and payment settle simultaneously in a single on-chain transaction — eliminating counterparty risk entirely.
          </p>
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ padding: "24px", borderRadius: 14, background: "rgba(139,127,255,0.15)", border: "1px solid rgba(139,127,255,0.3)", flex: 1 }}>
              <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: C.violet, marginBottom: 8 }}>Settlement time</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 40, fontWeight: 800, color: C.text, letterSpacing: "-0.04em", lineHeight: 1 }}>&lt;1<span style={{ fontSize: 20 }}> sec</span></div>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.muted, marginTop: 8 }}>Atomic DvP in a single Solana transaction with 400ms finality.</p>
            </div>
            <div style={{ padding: "24px", borderRadius: 14, background: C.surface, border: `1px solid ${C.border}`, flex: 1 }}>
              <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: C.dim, marginBottom: 8 }}>Transaction cost</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 40, fontWeight: 800, color: C.text, letterSpacing: "-0.04em", lineHeight: 1 }}>&lt;$0.01</div>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.muted, marginTop: 8 }}>Compared to $5–200 per settlement in traditional capital markets.</p>
            </div>
          </div>
        </div>
        <div style={{ border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "monospace", fontSize: 11, color: C.dim, letterSpacing: "0.08em" }}>LIVE SETTLEMENTS</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "monospace", fontSize: 10, color: C.mint }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.mint, animation: "pulse-dot 1.5s infinite" }}/>ACTIVE
            </span>
          </div>
          <div style={{ padding: "8px 0", minHeight: 280 }}>
            {txs.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: C.dim, fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>Awaiting settlements…</div>
            ) : txs.map((tx, i) => (
              <div key={tx.time + i} className="tx-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderBottom: `1px solid ${C.border}`, animation: "fadeUp 0.4s ease both" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.mint, flexShrink: 0 }}/>
                  <span style={{ fontFamily: "monospace", fontSize: 12, color: C.text }}>{tx.sig}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span style={{ fontFamily: "monospace", fontSize: 11, color: C.mint }}>{tx.ms}ms</span>
                  <span style={{ fontFamily: "monospace", fontSize: 10, padding: "2px 8px", borderRadius: 4, background: "rgba(16,217,160,0.1)", color: C.mint }}>SETTLED</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: "16px 20px", borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.violet, animation: "pulse-dot 2s infinite" }}/>
            <span style={{ fontFamily: "monospace", fontSize: 10, color: C.dim, letterSpacing: "0.08em" }}>DvP SETTLEMENT // SOLANA MAINNET</span>
          </div>
        </div>
      </div>
    </section>
  );
}
