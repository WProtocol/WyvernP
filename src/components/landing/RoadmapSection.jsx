import { CheckCircle2, ChevronRight } from "lucide-react";
import { C } from "../../theme/colors";
import { ROADMAP } from "../../data/landingContent";
import { useInView } from "../../hooks/useInView";
import { SLabel, H2 } from "./shared";

export function RoadmapSection() {
  const [ref, inView] = useInView();
  return (
    <section ref={ref} style={{ padding: "120px 48px", borderBottom: `1px solid ${C.border}`, background: C.bg2 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SLabel num="06">The 18-month plan</SLabel>
        <H2>Where we're <span className="gradient-text">going.</span></H2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 2, marginTop: 64, border: `1px solid ${C.border}`, borderRadius: 20, overflow: "hidden" }}>
          {ROADMAP.map((phase, i) => (
            <div key={i} className={inView ? "fade-in-stagger" : ""}
              style={{ padding: "36px 28px", background: phase.status === "active" ? "rgba(139,127,255,0.08)" : C.bg, borderRight: i < ROADMAP.length - 1 ? `1px solid ${C.border}` : "none", position: "relative", animationDelay: `${i * 80}ms` }}>
              {phase.status === "active" && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${C.violet},${C.cyan})` }}/>}
              <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.1em", color: phase.status === "done" ? C.mint : phase.status === "active" ? C.violet : C.dim, marginBottom: 8 }}>{phase.q}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: phase.status === "done" ? C.mint : phase.status === "active" ? C.violet : "rgba(255,255,255,0.15)", flexShrink: 0 }}/>
                <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 15, fontWeight: 700, color: phase.status === "upcoming" ? C.dim : C.text }}>{phase.title}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {phase.items.map((item, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <span style={{ color: phase.status === "done" ? C.mint : phase.status === "active" ? C.violet : C.dim, flexShrink: 0, marginTop: 1 }}>
                      {phase.status === "done" ? <CheckCircle2 size={11}/> : <ChevronRight size={11}/>}
                    </span>
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, lineHeight: 1.5, color: phase.status === "upcoming" ? C.dim : C.muted }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
