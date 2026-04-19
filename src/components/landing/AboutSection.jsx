import { X, FileText } from "lucide-react";
import { C } from "../../theme/colors";
import { SOCIALS } from "../../config";
import { SLabel, H2 } from "./shared";

const FACTS = [
  { label: "Founded", value: "2026", sub: "Built by capital markets & DeFi veterans" },
  { label: "Network", value: "Solana", sub: "Native to the fastest L1 blockchain" },
  { label: "Compliance", value: "MiCA Ready", sub: "EU-compliant from day one" },
  { label: "Settlement", value: "Atomic DvP", sub: "Delivery vs Payment — zero counterparty risk" },
  { label: "Status", value: "Public Testnet", sub: "Mainnet launch scheduled Q4 2026" },
];

export function AboutSection() {
  return (
    <section id="about" style={{ padding: "120px 48px", borderBottom: `1px solid ${C.border}`, background: C.bg2 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
        <div>
          <SLabel>About</SLabel>
          <H2>Built to <span className="gradient-text">redefine</span><br/>capital markets.</H2>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, lineHeight: 1.9, color: C.muted, marginBottom: 24 }}>
            Wyvern Protocol is a decentralized infrastructure layer for tokenizing and trading real-world securities on Solana. We believe that any asset — from Apple stock to US Treasury bonds to private equity — should be tradeable by anyone, anywhere, without intermediaries.
          </p>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, lineHeight: 1.9, color: C.muted, marginBottom: 40 }}>
            Traditional capital markets operate on infrastructure built in the 1970s. T+2 settlement, restricted market hours, geographic gatekeeping, and opaque custody chains are not features — they're bugs. Wyvern fixes them at the protocol layer.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <a href={SOCIALS.twitter} target="_blank" rel="noopener noreferrer" className="btn-gradient"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 20px", borderRadius: 8, textDecoration: "none", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, color: "#fff" }}>
              <X size={14}/> Follow us
            </a>
            <a href={SOCIALS.docs} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 20px", borderRadius: 8, border: `1px solid ${C.border}`, textDecoration: "none", fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.muted, transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderHi; e.currentTarget.style.color = C.text; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}>
              <FileText size={14}/> Read docs
            </a>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {FACTS.map(({ label, value, sub }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, transition: "border-color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = C.borderHi}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
              <div>
                <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: C.dim, marginBottom: 4 }}>{label}</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 700, color: C.text }}>{value}</div>
              </div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.muted, textAlign: "right", maxWidth: 200 }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
