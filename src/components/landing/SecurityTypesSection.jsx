import { C } from "../../theme/colors";
import { SECURITY_TYPES } from "../../data/landingContent";
import { useInView } from "../../hooks/useInView";
import { SLabel, H2 } from "./shared";

export function SecurityTypesSection() {
  const [ref, inView] = useInView();
  return (
    <section ref={ref} style={{ padding: "120px 48px", borderBottom: `1px solid ${C.border}`, position: "relative" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SLabel num="03">The asset set</SLabel>
        <H2>Every security,<br/><span className="gradient-text">one protocol.</span></H2>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, lineHeight: 1.8, color: C.muted, maxWidth: 520, marginBottom: 72 }}>
          From public equities to private fund interests, Wyvern supports the full breadth of tokenizable instruments — each with its own compliance wrapper and on-chain lifecycle.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }}>
          {SECURITY_TYPES.map((st, i) => {
            const Icon = st.Icon;
            return (
              <div key={i} className={inView ? "fade-in-stagger" : ""}
                style={{
                  position: "relative", padding: "36px 28px 32px", borderRadius: 18,
                  background: st.accent ? `linear-gradient(165deg,rgba(139,127,255,0.18),rgba(34,211,238,0.08))` : C.surface,
                  border: `1px solid ${st.accent ? "rgba(139,127,255,0.35)" : C.border}`,
                  transition: "transform .35s cubic-bezier(.16,1,.3,1),border-color .25s,background .25s",
                  animationDelay: `${i * 100}ms`, overflow: "hidden", cursor: "default",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = C.borderHi; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = st.accent ? "rgba(139,127,255,0.35)" : C.border; }}>
                <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 100% 0%,${st.accent ? "rgba(139,127,255,0.18)" : "rgba(139,127,255,0.05)"},transparent 70%)`, pointerEvents: "none" }}/>
                <div style={{ position: "relative", width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg,rgba(139,127,255,0.22),rgba(34,211,238,0.12))", border: "1px solid rgba(139,127,255,0.28)", display: "flex", alignItems: "center", justifyContent: "center", color: C.violet, marginBottom: 24 }}>
                  <Icon size={22} strokeWidth={1.5}/>
                </div>
                <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: C.dim, marginBottom: 8, position: "relative" }}>0{i + 1} · Class</div>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 14, letterSpacing: "-0.02em", position: "relative", lineHeight: 1.15 }}>{st.title}</h3>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, lineHeight: 1.7, color: C.muted, marginBottom: 22, position: "relative" }}>{st.desc}</p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", position: "relative" }}>
                  {st.tags.map(tag => (
                    <span key={tag} style={{ fontFamily: "monospace", fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", padding: "4px 9px", border: `1px solid ${C.border}`, borderRadius: 4, color: C.dim }}>{tag}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
