import { C } from "../../theme/colors";
import { STATS } from "../../data/landingContent";
import { useInView } from "../../hooks/useInView";
import { useCounter } from "../../hooks/useCounter";
import { useTokenStats } from "../../hooks/useTokenStats";
import { SLabel, H2 } from "./shared";

// Compact dollar formatter: 1_234_567 → "1.2M"
function fmtCompact(n) {
  if (n == null || !isFinite(n)) return "0";
  const abs = Math.abs(n);
  if (abs >= 1e9) return (n / 1e9).toFixed(2) + "B";
  if (abs >= 1e6) return (n / 1e6).toFixed(2) + "M";
  if (abs >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return Math.round(n).toLocaleString();
}

function StatCounter({ stat, inView, liveValue }) {
  const target = liveValue ?? stat.num;
  const val = useCounter(target, inView);

  let display;
  if (stat.key === "marketCap" || stat.key === "volume") {
    display = fmtCompact(val);
  } else if (target < 10) {
    display = val.toFixed(3);
  } else {
    display = Math.round(val).toLocaleString();
  }

  return (
    <div style={{ padding: "48px 40px", borderRight: `1px solid ${C.border}`, position: "relative", overflow: "hidden" }}>
      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 52, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em", background: `linear-gradient(135deg,${stat.color},${C.cyan})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 10 }}>
        {stat.prefix}{display}{stat.suffix}
      </div>
      <div style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: C.dim, marginBottom: 8 }}>{stat.label}</div>
      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.muted, lineHeight: 1.5 }}>
        {liveValue != null && (stat.key === "marketCap" || stat.key === "volume") ? "Live · DexScreener" : stat.sub}
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${stat.color}40,transparent)` }}/>
    </div>
  );
}

export function StatsSection() {
  const [ref, inView] = useInView(0.3);
  const live = useTokenStats();

  return (
    <section ref={ref} style={{ padding: "120px 48px", borderBottom: `1px solid ${C.border}`, position: "relative" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SLabel>By the numbers</SLabel>
        <H2>Scale that <span className="gradient-text">matters.</span></H2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", border: `1px solid ${C.border}`, borderRadius: 20, overflow: "hidden", marginTop: 64, background: C.bg2 }}>
          {STATS.map((stat, i) => {
            const liveValue =
              stat.key === "marketCap" ? live?.marketCap :
              stat.key === "volume"    ? live?.volume24h :
              undefined;
            return <StatCounter key={i} stat={stat} inView={inView} liveValue={liveValue}/>;
          })}
        </div>
      </div>
    </section>
  );
}
