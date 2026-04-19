import { X, Shield, CheckCircle2 } from "lucide-react";
import { C } from "../../theme/colors";
import { SOCIALS } from "../../config";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer style={{ padding: "36px 48px", borderTop: `1px solid ${C.border}`, display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 32, background: C.bg2 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Logo size={22}/>
        <span style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: C.dim }}>© 2026 Wyvern Protocol</span>
      </div>
      <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
        {[["Protocol", "#protocol"], ["Docs", SOCIALS.docs], ["GitHub", SOCIALS.github], ["Twitter", SOCIALS.twitter]].map(([label, href]) => (
          <a key={label} href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.08em", color: C.dim, textDecoration: "none", transition: "color 0.2s", display: "flex", alignItems: "center", gap: 5 }}
            onMouseEnter={e => e.currentTarget.style.color = C.text}
            onMouseLeave={e => e.currentTarget.style.color = C.dim}>
            {label === "Twitter" && <X size={11}/>}
            {label}
          </a>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "monospace", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", padding: "5px 12px", borderRadius: 6, background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", color: "#f59e0b" }}>
          <Shield size={11}/> Smart contract audit pending
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "monospace", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", padding: "5px 12px", borderRadius: 6, background: "rgba(16,217,160,0.06)", border: "1px solid rgba(16,217,160,0.2)", color: C.mint }}>
          <CheckCircle2 size={11}/> MiCA compliant architecture
        </div>
      </div>
    </footer>
  );
}
