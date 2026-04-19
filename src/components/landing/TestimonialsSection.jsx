import { Star } from "lucide-react";
import { C } from "../../theme/colors";
import { QUOTES } from "../../data/landingContent";
import { useInView } from "../../hooks/useInView";
import { useTilt } from "../../hooks/useTilt";
import { SLabel, H2 } from "./shared";

function Quote({ q, i, inView }) {
  const [tiltRef, move, reset] = useTilt();
  return (
    <div ref={tiltRef} onMouseMove={move} onMouseLeave={reset}
      className={`glass-card${inView ? " fade-in-stagger" : ""}`}
      style={{ padding: "36px 32px", borderRadius: 16, transition: "transform 0.15s ease", animationDelay: `${i * 120}ms`, position: "relative", overflow: "hidden" }}>
      <div style={{ display: "flex", gap: 3, marginBottom: 20 }}>
        {Array(q.stars).fill(0).map((_, j) => <Star key={j} size={13} fill={C.violet} color={C.violet}/>)}
      </div>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, lineHeight: 1.75, color: C.muted, fontWeight: 300, marginBottom: 28 }}
        dangerouslySetInnerHTML={{ __html: q.quote.replace(/<b>/g, `<strong style="color:${C.text};font-weight:500">`).replace(/<\/b>/g, "</strong>") }}/>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,rgba(139,127,255,0.3),rgba(34,211,238,0.2))", border: "1px solid rgba(139,127,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontSize: 11, fontWeight: 600, color: C.violet }}>
          {q.author.split(" ").map(w => w[0]).join("")}
        </div>
        <div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 600, color: C.text }}>{q.author}</div>
          <div style={{ fontFamily: "monospace", fontSize: 10, color: C.dim, letterSpacing: "0.06em", marginTop: 2 }}>{q.role}</div>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  const [ref, inView] = useInView();
  return (
    <section style={{ padding: "120px 48px", borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SLabel>What they say</SLabel>
        <H2>Trusted by <span className="gradient-text">builders.</span></H2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginTop: 64 }} ref={ref}>
          {QUOTES.map((q, i) => <Quote key={i} q={q} i={i} inView={inView}/>)}
        </div>
      </div>
    </section>
  );
}
