import { X, FileText } from "lucide-react";
import { C } from "../../theme/colors";
import { SOCIALS } from "../../config";
import { SLabel, H2 } from "./shared";

const FACTS = [
  { label: "Symbol",     value: "$WYV",       sub: "On Solana via pump.fun" },
  { label: "Mascot",     value: "Wyvern",     sub: "Two-legged dragon. Older than fiat." },
  { label: "Network",    value: "Solana",     sub: "The fastest creature on the fastest chain." },
  { label: "Status",     value: "Pre-launch", sub: "Watch the manifesto. Then watch the chart." },
];

export function AboutSection() {
  return (
    <section id="about" style={{ padding: "120px 48px", borderBottom: `1px solid ${C.border}`, background: C.bg2 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
        <div>
          <SLabel num="04">The thesis</SLabel>
          <H2>Why a <span className="gradient-text">dragon coin?</span></H2>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, lineHeight: 1.85, color: C.muted, marginBottom: 24 }}>
            Capital markets are the most trust-dependent industry on earth — and they still settle in two days.
            $WYV doesn't fix that. We're not pretending to. We're a memecoin for the people who watched their grandfather wait
            two days for a stock trade to settle and decided that was funny enough to make a dragon out of.
          </p>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, lineHeight: 1.85, color: C.muted, marginBottom: 40 }}>
            The dragon is the meme. The community is the protocol. The chart is the proof.
            Read <a href="/manifesto" style={{ color: C.violet, textDecoration: "underline", textDecorationStyle: "dotted" }}>the manifesto</a> if you want the long version.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href={SOCIALS.twitter} target="_blank" rel="noopener noreferrer" className="btn-gradient"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 20px", borderRadius: 8, textDecoration: "none", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, color: "#fff" }}>
              <X size={14}/> Follow the dragon
            </a>
            <a href="/manifesto" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 20px", borderRadius: 8, border: `1px solid ${C.border}`, textDecoration: "none", fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.muted, transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderHi; e.currentTarget.style.color = C.text; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}>
              <FileText size={14}/> Read the manifesto
            </a>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {FACTS.map(({ label, value, sub }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, transition: "border-color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = C.borderHi}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
              <div>
                <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: C.dim, marginBottom: 4 }}>{label}</div>
                <div style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontSize: 24, color: C.text, letterSpacing: "-0.01em" }}>{value}</div>
              </div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.muted, textAlign: "right", maxWidth: 200 }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
