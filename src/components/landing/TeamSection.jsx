import { C } from "../../theme/colors";
import { TEAM } from "../../data/landingContent";
import { useInView } from "../../hooks/useInView";
import { SLabel, H2 } from "./shared";

export function TeamSection() {
  const [ref, inView] = useInView();
  return (
    <section ref={ref} style={{ padding: "120px 48px", borderBottom: `1px solid ${C.border}`, background: C.bg }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SLabel num="09">Who we are</SLabel>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 64 }}>
          <H2 style={{ marginBottom: 0 }}>The people<br/><span className="gradient-text">behind the protocol.</span></H2>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, lineHeight: 1.8, color: C.muted, maxWidth: 340, textAlign: "right" }}>
            Capital markets veterans and DeFi builders. We've seen the old system break — we're building the new one.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }}>
          {TEAM.map((m, i) => (
            <div key={m.name} className={inView ? "fade-in-stagger" : ""}
              style={{ padding: "28px 24px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, transition: "border-color .25s,transform .25s", animationDelay: `${i * 80}ms`, position: "relative", overflow: "hidden" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = m.accent + "55"; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "translateY(0)"; }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${m.accent},transparent)` }}/>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: `${m.accent}18`, border: `1px solid ${m.accent}40`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 800, color: m.accent }}>
                {m.anon ? <span style={{ fontSize: 20, opacity: 0.4 }}>?</span> : m.initials}
              </div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 3 }}>{m.anon ? "[Stealth]" : m.name}</div>
              <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: m.accent, marginBottom: 14 }}>{m.role}</div>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, lineHeight: 1.7, color: C.muted, marginBottom: 16 }}>{m.bio}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {m.tags.map(t => (
                  <span key={t} style={{ fontFamily: "monospace", fontSize: 9, padding: "3px 8px", borderRadius: 4, background: `${m.accent}12`, color: m.accent, border: `1px solid ${m.accent}25` }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p style={{ textAlign: "center", fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.dim, marginTop: 32 }}>
          Full team building in stealth until mainnet launch. Team announcement Q3 2026.
        </p>
      </div>
    </section>
  );
}
