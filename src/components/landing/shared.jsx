import { C } from "../../theme/colors";

export function SLabel({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
      <div style={{ width: 20, height: 1, background: `linear-gradient(90deg,${C.violet},${C.cyan})` }}/>
      <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", background: `linear-gradient(90deg,${C.violet},${C.cyan})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{children}</span>
    </div>
  );
}

export function H2({ children, style }) {
  return (
    <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(34px,3.8vw,54px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.03em", color: C.text, marginBottom: 20, ...style }}>{children}</h2>
  );
}
