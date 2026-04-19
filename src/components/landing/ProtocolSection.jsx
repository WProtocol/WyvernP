import { C } from "../../theme/colors";
import { STEPS } from "../../data/landingContent";
import { useInView } from "../../hooks/useInView";
import { useTilt } from "../../hooks/useTilt";
import { SLabel, H2 } from "./shared";

function StepCell({ step, i, inView }) {
  const [tiltRef, move, reset] = useTilt();
  return (
    <div ref={tiltRef} onMouseMove={move} onMouseLeave={reset}
      className={`step-cell${inView ? " fade-in-stagger" : ""}`}
      style={{ background: C.bg2, padding: "52px 44px", position: "relative", overflow: "hidden", borderRight: i % 2 === 0 ? `1px solid ${C.border}` : "none", borderBottom: i < 2 ? `1px solid ${C.border}` : "none", transition: "background 0.3s, transform 0.15s ease", animationDelay: `${i * 100}ms`, cursor: "default" }}>
      <span style={{ position: "absolute", right: 28, top: 16, fontFamily: "'Syne',sans-serif", fontSize: 96, fontWeight: 800, color: "rgba(255,255,255,0.025)", lineHeight: 1, userSelect: "none" }}>{step.n}</span>
      <div style={{ width: 44, height: 44, borderRadius: 12, marginBottom: 28, background: "linear-gradient(135deg,rgba(139,127,255,0.2),rgba(34,211,238,0.1))", border: "1px solid rgba(139,127,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: C.violet }}>{step.icon}</div>
      <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 700, lineHeight: 1.2, marginBottom: 12, color: C.text, letterSpacing: "-0.02em" }}>
        {step.title.replace(step.em, "")}<em style={{ fontStyle: "italic", color: C.violet }}>{step.em}</em>
      </h3>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, lineHeight: 1.8, color: C.muted, maxWidth: 340 }}>{step.body}</p>
    </div>
  );
}

export function ProtocolSection() {
  const [ref, inView] = useInView();
  return (
    <section id="protocol" ref={ref} style={{ padding: "120px 48px", borderBottom: `1px solid ${C.border}`, position: "relative" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SLabel num="01">The Protocol</SLabel>
        <H2>How <span className="gradient-text">Wyvern</span> works</H2>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, lineHeight: 1.8, color: C.muted, maxWidth: 480, marginBottom: 72 }}>
          From real-world asset to on-chain token in four steps. No intermediaries, no T+2 delays, no borders.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, borderRadius: 20, overflow: "hidden", border: `1px solid ${C.border}` }}>
          {STEPS.map((step, i) => <StepCell key={step.n} step={step} i={i} inView={inView}/>)}
        </div>
      </div>
    </section>
  );
}
