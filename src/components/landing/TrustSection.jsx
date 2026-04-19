import { Code2, Lock, Eye, Shield, ArrowRight } from "lucide-react";
import { C } from "../../theme/colors";
import { SOCIALS } from "../../config";
import { useInView } from "../../hooks/useInView";
import { SLabel, H2 } from "./shared";

const PILLARS = [
  {
    Icon: Code2,
    title: "Open source",
    desc: "Every smart contract is publicly auditable on GitHub. MIT licensed. Fork it, read it, break it.",
  },
  {
    Icon: Lock,
    title: "On-chain rules",
    desc: "Compliance, transfer restrictions, and settlement logic are embedded at the token layer — not enforced by a company.",
  },
  {
    Icon: Eye,
    title: "Verifiable by anyone",
    desc: "Reserves, issuance, and every trade are on-chain and queryable. No trust in opaque custody chains.",
  },
  {
    Icon: Shield,
    title: "Audit-first",
    desc: "Independent smart contract audit scheduled Q4 2026. Pre-launch bug bounty opens with testnet.",
  },
];

export function TrustSection() {
  const [ref, inView] = useInView();
  return (
    <section ref={ref} style={{ padding: "120px 48px", borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SLabel>Trust</SLabel>
        <H2>Trust, through <span className="gradient-text">code.</span></H2>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, lineHeight: 1.75, color: C.muted, maxWidth: 660, marginBottom: 56 }}>
          Capital markets are the most trust-dependent industry on earth. At Wyvern, that trust doesn't come from a brand, a custodian, or a clearinghouse —
          <span style={{ color: C.text, fontWeight: 500 }}> it comes from code that anyone can read, rules that live on-chain, and settlement that removes counterparties entirely.</span>
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 48 }}>
          {PILLARS.map((p, i) => {
            const Icon = p.Icon;
            return (
              <div
                key={p.title}
                className={inView ? "fade-in-stagger" : ""}
                style={{
                  padding: "32px 26px",
                  borderRadius: 16,
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  animationDelay: `${i * 90}ms`,
                  position: "relative",
                  overflow: "hidden",
                  transition: "border-color .25s,transform .25s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderHi; e.currentTarget.style.transform = "translateY(-3px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 11,
                    background: "linear-gradient(135deg,rgba(139,127,255,0.22),rgba(34,211,238,0.12))",
                    border: "1px solid rgba(139,127,255,0.28)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: C.violet,
                    marginBottom: 20,
                  }}
                >
                  <Icon size={20} strokeWidth={1.6} />
                </div>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 17, fontWeight: 700, color: C.text, letterSpacing: "-0.01em", marginBottom: 10 }}>{p.title}</h3>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, lineHeight: 1.65, color: C.muted }}>{p.desc}</p>
              </div>
            );
          })}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            padding: "28px 32px",
            border: `1px solid ${C.border}`,
            borderRadius: 16,
            background: "linear-gradient(135deg, rgba(139,127,255,0.06), rgba(34,211,238,0.03))",
            flexWrap: "wrap",
          }}
        >
          <GithubGlyph />
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 4 }}>
              Read the contracts.
            </div>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.muted }}>
              Every protocol contract is public the moment it's deployed. Follow the work in real time.
            </div>
          </div>
          <a
            href={SOCIALS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gradient"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 22px",
              borderRadius: 10,
              textDecoration: "none",
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 13,
              fontWeight: 600,
              color: "#fff",
              whiteSpace: "nowrap",
            }}
          >
            View on GitHub <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}

// Minimal GitHub-style glyph (no external icon dependency)
function GithubGlyph() {
  return (
    <div
      style={{
        width: 54,
        height: 54,
        borderRadius: 13,
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${C.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill={C.text} aria-hidden>
        <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-1.97c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.27.73-1.56-2.56-.29-5.25-1.28-5.25-5.68 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11.05 11.05 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.77.11 3.06.74.8 1.19 1.83 1.19 3.09 0 4.41-2.7 5.38-5.26 5.67.41.36.78 1.06.78 2.15v3.18c0 .31.21.67.79.56 4.57-1.52 7.86-5.83 7.86-10.91C23.5 5.73 18.27.5 12 .5z" />
      </svg>
    </div>
  );
}
