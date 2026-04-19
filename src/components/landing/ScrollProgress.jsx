import { useState, useEffect } from "react";
import { C } from "../../theme/colors";

export function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const h = () => {
      const s = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setP(max > 0 ? Math.min(1, Math.max(0, s / max)) : 0);
    };
    h();
    window.addEventListener("scroll", h, { passive: true });
    window.addEventListener("resize", h);
    return () => { window.removeEventListener("scroll", h); window.removeEventListener("resize", h); };
  }, []);
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 1000, pointerEvents: "none" }}>
      <div style={{ height: "100%", width: `${p * 100}%`, background: `linear-gradient(90deg,${C.violet},${C.cyan},${C.mint})`, transition: "width 0.08s linear", boxShadow: `0 0 8px rgba(139,127,255,0.5)` }}/>
    </div>
  );
}
