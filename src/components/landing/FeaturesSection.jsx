import { useState, useEffect } from "react";
import { C } from "../../theme/colors";
import { FEATURES } from "../../data/landingContent";
import { useInView } from "../../hooks/useInView";
import { SLabel, H2 } from "./shared";

export function FeaturesSection() {
  const [active, setActive] = useState(0);
  const [animated, setAnimated] = useState(false);
  const [ref] = useInView();
  useEffect(() => {
    setAnimated(false);
    const t = setTimeout(() => setAnimated(true), 60);
    return () => clearTimeout(t);
  }, [active]);
  return (
    <section id="features" ref={ref} style={{ padding: "120px 48px", borderBottom: `1px solid ${C.border}`, background: C.bg2 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SLabel>Features</SLabel>
        <H2>Built <span className="gradient-text">different.</span></H2>
        <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 56, alignItems: "start", marginTop: 64 }}>
          <div style={{ border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
            {FEATURES.map((feat, i) => (
              <button key={i} onClick={() => setActive(i)} style={{ width: "100%", textAlign: "left", padding: "20px 24px", background: active === i ? "rgba(139,127,255,0.08)" : "transparent", borderBottom: i < FEATURES.length - 1 ? `1px solid ${C.border}` : "none", border: "none", borderLeft: active === i ? `2px solid ${C.violet}` : "2px solid transparent", cursor: "pointer", transition: "background 0.2s" }}>
                <div style={{ fontFamily: "monospace", fontSize: 10, color: C.dim, letterSpacing: "0.1em", marginBottom: 4 }}>{feat.num}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 600, color: active === i ? C.violet : C.muted, marginBottom: active === i ? 6 : 0, transition: "color 0.2s" }}>
                  <span style={{ color: active === i ? C.violet : C.dim }}>{feat.icon}</span>{feat.title}
                </div>
                {active === i && <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.muted, lineHeight: 1.6 }}>{feat.desc}</p>}
              </button>
            ))}
          </div>
          <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 16, padding: "48px", minHeight: 440, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, right: 0, width: 300, height: 300, background: "radial-gradient(circle at 100% 0%,rgba(139,127,255,0.08),transparent 70%)", pointerEvents: "none" }}/>
            <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: C.cyan, marginBottom: 24 }}>{FEATURES[active].title}</div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 64, fontWeight: 800, lineHeight: 0.9, letterSpacing: "-0.03em", background: `linear-gradient(135deg,${C.mint},${C.cyan})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 8 }}>{FEATURES[active].stat}</div>
            <div style={{ fontFamily: "monospace", fontSize: 11, color: C.dim, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>{FEATURES[active].statLabel}</div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, lineHeight: 1.8, color: C.muted, maxWidth: 380, marginBottom: 40 }}>{FEATURES[active].desc}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {FEATURES[active].bars.map((bar, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ width: 90, fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.muted, flexShrink: 0 }}>{bar.label}</span>
                  <div style={{ flex: 1, height: 5, background: "rgba(255,255,255,0.05)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 99, background: bar.hi ? `linear-gradient(90deg,${C.violet},${C.cyan})` : "rgba(255,255,255,0.15)", width: animated ? `${bar.pct}%` : "0%", transition: `width 1s cubic-bezier(.16,1,.3,1) ${i * 100}ms` }}/>
                  </div>
                  <span style={{ fontFamily: "monospace", fontSize: 11, color: C.dim, width: 38, textAlign: "right" }}>{bar.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
