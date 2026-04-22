import { ExternalLink, ArrowRight } from "lucide-react";
import { C } from "../../theme/colors";
import { TOKEN } from "../../config";
import { Wireframe3D } from "./Wireframe3D";

export function CTASection() {
  return (
    <section style={{ padding: "160px 48px", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 900, height: 900, background: "radial-gradient(circle,rgba(139,127,255,0.07) 0%,rgba(34,211,238,0.03) 40%,transparent 70%)", pointerEvents: "none" }}/>
      <div className="grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.3 }}/>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 0, opacity: 0.7, pointerEvents: "none" }}>
        <Wireframe3D size={460} />
      </div>

      {TOKEN.launched && (
        <div style={{ marginBottom: 32, position: "relative", zIndex: 1 }}>
          <a href={TOKEN.pumpfunUrl} target="_blank" rel="noopener noreferrer" className="btn-gradient"
            style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 32px", borderRadius: 10, textDecoration: "none", fontFamily: "'DM Sans',sans-serif", fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
            🐉 Buy $WYV on pump.fun <ExternalLink size={16}/>
          </a>
          <div style={{ fontFamily: "monospace", fontSize: 11, color: C.dim, marginTop: 10 }}>CA: {TOKEN.ca}</div>
        </div>
      )}

      <h2
        style={{
          fontFamily: "'Instrument Serif', serif",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "clamp(60px, 8vw, 132px)",
          letterSpacing: "-0.025em",
          lineHeight: 0.94,
          marginBottom: 24,
          position: "relative",
          zIndex: 1,
          color: C.text,
        }}
      >
        The dragon<br/><span className="gradient-text">flies.</span>
      </h2>

      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 17, color: C.muted, marginBottom: 48, position: "relative", zIndex: 1, lineHeight: 1.7, maxWidth: 540, marginLeft: "auto", marginRight: "auto" }}>
        Step into the lair before launch. Get the CA the moment it hits.
      </p>

      <div style={{ display: "flex", gap: 12, justifyContent: "center", position: "relative", zIndex: 1, flexWrap: "wrap" }}>
        <a
          href="https://t.me/WyvernprotocoI"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gradient"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "16px 32px",
            borderRadius: 12,
            border: "none",
            cursor: "pointer",
            textDecoration: "none",
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 15,
            fontWeight: 600,
            color: "#fff",
          }}
        >
          Join Telegram <ArrowRight size={16}/>
        </a>
        <a
          href="https://x.com/WyvernProtocoI"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "16px 28px",
            borderRadius: 12,
            border: `1px solid ${C.border}`,
            background: "transparent",
            color: C.text,
            textDecoration: "none",
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 15,
            fontWeight: 500,
            transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderHi; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; }}
        >
          Follow on X
        </a>
      </div>
    </section>
  );
}
