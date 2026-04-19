import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { C } from "../../theme/colors";
import { TIERS } from "../../data/landingContent";
import { useInView } from "../../hooks/useInView";
import { SLabel, H2 } from "./shared";

export function AccessTiersSection() {
  const [ref, inView] = useInView();
  const navigate = useNavigate();
  return (
    <section ref={ref} style={{ padding: "120px 48px", borderBottom: `1px solid ${C.border}`, background: C.bg2, position: "relative" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SLabel num="05">Three ways in</SLabel>
        <H2>Start anywhere.<br/><span className="gradient-text">Scale everywhere.</span></H2>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, lineHeight: 1.8, color: C.muted, maxWidth: 520, marginBottom: 72 }}>
          Three tiers, one protocol. Watch the markets for free, trade with a verified wallet, or issue your own securities on Wyvern's rails.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {TIERS.map((t, i) => {
            const Icon = t.Icon;
            return (
              <div key={t.name} className={inView ? "fade-in-stagger" : ""}
                style={{
                  position: "relative", padding: "40px 32px", borderRadius: 20,
                  background: t.highlighted ? "linear-gradient(180deg,rgba(139,127,255,0.12),rgba(34,211,238,0.04))" : C.surface,
                  border: `1px solid ${t.highlighted ? "rgba(139,127,255,0.4)" : C.border}`,
                  transition: "transform .35s cubic-bezier(.16,1,.3,1),border-color .25s",
                  animationDelay: `${i * 120}ms`, overflow: "hidden",
                  transform: t.highlighted ? "translateY(-8px)" : "none",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = t.highlighted ? "translateY(-12px)" : "translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = t.highlighted ? "translateY(-8px)" : "translateY(0)"; }}>
                {t.highlighted && (
                  <div style={{ position: "absolute", top: 18, right: 18, fontFamily: "monospace", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 99, background: "linear-gradient(90deg,rgba(139,127,255,0.3),rgba(34,211,238,0.2))", border: "1px solid rgba(139,127,255,0.4)", color: C.text }}>Most popular</div>
                )}
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg,rgba(139,127,255,0.22),rgba(34,211,238,0.12))", border: "1px solid rgba(139,127,255,0.28)", display: "flex", alignItems: "center", justifyContent: "center", color: C.violet, marginBottom: 28 }}>
                  <Icon size={22} strokeWidth={1.5}/>
                </div>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 800, color: C.text, letterSpacing: "-0.03em", marginBottom: 6 }}>{t.name}</h3>
                <div style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: t.highlighted ? C.violet : C.dim, marginBottom: 18 }}>{t.price}</div>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, lineHeight: 1.7, color: C.muted, marginBottom: 28, minHeight: 44 }}>{t.tagline}</p>
                <div style={{ height: 1, background: C.border, marginBottom: 24 }}/>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
                  {t.features.map((f, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <CheckCircle2 size={14} color={t.highlighted ? C.violet : C.mint} style={{ flexShrink: 0, marginTop: 2 }}/>
                      <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, lineHeight: 1.55, color: C.muted }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => navigate(t.cta === "Talk to sales" ? "/contact" : "/app")}
                  className={t.highlighted ? "btn-gradient" : ""}
                  style={{ width: "100%", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, padding: "12px 22px", borderRadius: 10, border: t.highlighted ? "none" : `1px solid ${C.border}`, background: t.highlighted ? undefined : "transparent", color: t.highlighted ? "#fff" : C.text, cursor: "pointer", transition: "all 0.2s" }}
                  onMouseEnter={e => { if (!t.highlighted) { e.currentTarget.style.borderColor = C.borderHi; } }}
                  onMouseLeave={e => { if (!t.highlighted) { e.currentTarget.style.borderColor = C.border; } }}>
                  {t.cta} →
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
