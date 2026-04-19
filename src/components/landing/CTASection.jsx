import { useState } from "react";
import { CheckCircle2, ExternalLink } from "lucide-react";
import { C } from "../../theme/colors";
import { TOKEN } from "../../config";
import { Wireframe3D } from "./Wireframe3D";

export function CTASection() {
  const [email, setEmail] = useState("");
  return (
    <section style={{ padding: "160px 48px", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 900, height: 900, background: "radial-gradient(circle,rgba(139,127,255,0.07) 0%,rgba(34,211,238,0.03) 40%,transparent 70%)", pointerEvents: "none" }}/>
      <div className="grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.3 }}/>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 0, opacity: 0.85, pointerEvents: "none" }}>
        <Wireframe3D size={420} />
      </div>
      {TOKEN.launched && (
        <div style={{ marginBottom: 32, position: "relative", zIndex: 1 }}>
          <a href={TOKEN.pumpfunUrl} target="_blank" rel="noopener noreferrer" className="btn-gradient"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 10, textDecoration: "none", fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
            🔥 Buy WYV on pump.fun <ExternalLink size={15}/>
          </a>
          <div style={{ fontFamily: "monospace", fontSize: 11, color: C.dim, marginTop: 8 }}>CA: {TOKEN.ca}</div>
        </div>
      )}
      <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(56px,8vw,104px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 0.92, marginBottom: 24, position: "relative", zIndex: 1, color: C.text }}>
        Ready to<br/><span className="gradient-text">fly?</span>
      </h2>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: C.muted, marginBottom: 48, position: "relative", zIndex: 1, lineHeight: 1.7 }}>
        Join thousands of traders, institutions, and builders<br/>already on Wyvern Protocol.
      </p>
      <div style={{ display: "flex", gap: 8, justifyContent: "center", position: "relative", zIndex: 1 }}>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
          style={{ fontFamily: "'DM Sans',sans-serif", background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 20px", fontSize: 14, color: C.text, width: 300, outline: "none", transition: "border-color 0.2s" }}
          onFocus={e => e.target.style.borderColor = C.violet}
          onBlur={e => e.target.style.borderColor = C.border}/>
        <button className="btn-gradient" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, padding: "14px 26px", borderRadius: 10, border: "none", cursor: "pointer", whiteSpace: "nowrap", color: "#fff" }}>
          Join waitlist →
        </button>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 40, position: "relative", zIndex: 1 }}>
        {["No credit card required", "Cancel anytime", "MiCA compliant"].map(t => (
          <div key={t} style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.dim }}>
            <CheckCircle2 size={13} color={C.mint}/> {t}
          </div>
        ))}
      </div>
    </section>
  );
}
