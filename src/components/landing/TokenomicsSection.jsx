import { Copy, Check, ExternalLink } from "lucide-react";
import { useState } from "react";
import { C } from "../../theme/colors";
import { TOKEN } from "../../config";
import { useInView } from "../../hooks/useInView";
import { SLabel, H2 } from "./shared";

const STATS = [
  { label: "Total supply", value: "1,000,000,000", sub: "Fixed. No mint authority." },
  { label: "Dev wallet",  value: "2-3%",          sub: "One wallet, public on-chain. No bundling." },
  { label: "Liquidity",   value: "Bonding curve", sub: "Migrates to Raydium at $69K mcap." },
  { label: "Tax",         value: "0 / 0",         sub: "Buy and sell freely. No honeypot." },
];

export function TokenomicsSection() {
  const [ref, inView] = useInView();
  const [copied, setCopied] = useState(false);

  const ca = TOKEN.ca || "Pre-launch · CA reveals at go-live";

  function copyCA() {
    if (!TOKEN.ca) return;
    navigator.clipboard.writeText(TOKEN.ca);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <section ref={ref} id="tokenomics" style={{ padding: "120px 48px", borderBottom: `1px solid ${C.border}`, background: C.bg2 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <SLabel num="02">The token</SLabel>
        <H2>Honest <span className="gradient-text">tokenomics.</span></H2>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, lineHeight: 1.75, color: C.muted, maxWidth: 660, marginBottom: 56 }}>
          One dev wallet. No bundling. No vesting tricks. The dragon does not need 18 wallets to look big.
        </p>

        {/* CA card */}
        <div
          className={inView ? "fade-in-stagger" : ""}
          style={{
            padding: "28px 32px",
            border: `1px solid ${C.border}`,
            borderRadius: 16,
            background: "linear-gradient(135deg, rgba(139,127,255,0.08), rgba(34,211,238,0.04))",
            display: "flex",
            alignItems: "center",
            gap: 22,
            marginBottom: 32,
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: C.dim, marginBottom: 8 }}>
              Contract address
            </div>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: TOKEN.ca ? 16 : 14,
                color: TOKEN.ca ? C.text : C.muted,
                letterSpacing: TOKEN.ca ? "0" : "0.04em",
                wordBreak: "break-all",
              }}
            >
              {ca}
            </div>
          </div>
          {TOKEN.ca && (
            <>
              <button
                onClick={copyCA}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 16px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${C.border}`,
                  color: C.text,
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                {copied ? <Check size={14} color={C.mint}/> : <Copy size={14}/>} {copied ? "Copied" : "Copy"}
              </button>
              {TOKEN.pumpfunUrl && (
                <a
                  href={TOKEN.pumpfunUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gradient"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "12px 20px",
                    borderRadius: 10,
                    textDecoration: "none",
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#fff",
                  }}
                >
                  Buy on pump.fun <ExternalLink size={14}/>
                </a>
              )}
            </>
          )}
        </div>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={inView ? "fade-in-stagger" : ""}
              style={{
                padding: "26px 22px",
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 14,
                animationDelay: `${i * 80}ms`,
              }}
            >
              <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: C.dim, marginBottom: 10 }}>
                {s.label}
              </div>
              <div style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontSize: 30, color: C.text, lineHeight: 1.05, marginBottom: 8 }}>
                {s.value}
              </div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.muted, lineHeight: 1.5 }}>
                {s.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
