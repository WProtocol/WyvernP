import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Wallet, LogOut } from "lucide-react";
import { C } from "../../theme/colors";
import { useWallet } from "../../hooks/useWallet";
import { Logo } from "./Logo";

export function Nav({ onSignIn }) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const { connected, short, disconnect } = useWallet();
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 500, height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px", background: scrolled ? "rgba(2,2,12,0.85)" : "transparent", borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent", backdropFilter: scrolled ? "blur(24px)" : "none", transition: "all 0.4s ease" }}>
      <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
        <Logo/>
        <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 15, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: C.text }}>Wyvern</span>
      </a>
      <div style={{ display: "flex", gap: 4 }}>
        {[["Lore", "#lore"], ["Tokenomics", "#tokenomics"], ["Community", "#community"], ["Manifesto", "/manifesto"]].map(([label, href]) => (
          <a key={label} href={href.startsWith("#") ? href : undefined}
            onClick={href.startsWith("/") ? e => { e.preventDefault(); navigate(href); } : undefined}
            style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.muted, textDecoration: "none", padding: "8px 16px", borderRadius: 8, transition: "color 0.2s", cursor: "pointer" }}
            onMouseEnter={e => e.currentTarget.style.color = C.text}
            onMouseLeave={e => e.currentTarget.style.color = C.muted}>
            {label}
          </a>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        {connected ? (
          <button onClick={disconnect} title="Disconnect"
            style={{ fontFamily: "monospace", fontSize: 12, color: C.text, background: "rgba(139,127,255,0.1)", border: "1px solid rgba(139,127,255,0.3)", borderRadius: 8, cursor: "pointer", padding: "8px 14px", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.mint }}/>
            {short}
            <LogOut size={12}/>
          </button>
        ) : (
          <button onClick={onSignIn} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.muted, background: "transparent", border: "none", cursor: "pointer", padding: "8px 16px", display: "flex", alignItems: "center", gap: 6 }}>
            <Wallet size={14}/>Sign in
          </button>
        )}
        <a
          href="https://t.me/+GiUlx2KOi9QwMzU0"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gradient"
          style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "10px 22px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "#fff",
            textDecoration: "none",
          }}
        >
          Join the dragons <ArrowRight size={13}/>
        </a>
      </div>
    </nav>
  );
}
