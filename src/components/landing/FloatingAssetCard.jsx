import { C } from "../../theme/colors";
import { useTilt } from "../../hooks/useTilt";
import { Sparkline } from "./Sparkline";

export function FloatingAssetCard({ label, name, price, chg, up, accent, style }) {
  const [ref, move, reset] = useTilt();
  return (
    <div ref={ref} onMouseMove={move} onMouseLeave={reset}
      className="float-card glass-card"
      style={{ padding: "14px 18px", borderRadius: 12, minWidth: 190, transition: "transform 0.15s ease", zIndex: 10, ...style }}>
      <div style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: accent ? C.mint : C.dim, marginBottom: 6 }}>{label}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 700, color: accent ? C.mint : C.text }}>{name}</span>
        <span style={{ fontFamily: "monospace", fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 4, background: up ? "rgba(16,217,160,0.12)" : "rgba(244,63,94,0.12)", color: up ? C.mint : C.rose }}>{chg}</span>
      </div>
      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 700, color: C.text, marginTop: 4, letterSpacing: "-0.02em" }}>{price}</div>
      <Sparkline up={up} accent={accent}/>
    </div>
  );
}
