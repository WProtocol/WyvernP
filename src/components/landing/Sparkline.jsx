import { C } from "../../theme/colors";

export function Sparkline({ up, accent }) {
  const pts = up ? [30, 40, 35, 55, 50, 70, 65, 85, 75, 90] : [80, 75, 70, 72, 65, 58, 52, 48, 44, 40];
  const color = accent ? C.mint : up ? C.mint : C.rose;
  const w = 160, h = 28, xs = pts.map((_, i) => (i / (pts.length - 1)) * w);
  const mn = Math.min(...pts), mx = Math.max(...pts), ys = pts.map(p => h - ((p - mn) / (mx - mn)) * h);
  const d = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x},${ys[i]}`).join(" ");
  return (
    <svg width={w} height={h} style={{ marginTop: 8, overflow: "visible" }}>
      <defs>
        <linearGradient id={`sg${up}${accent}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={`${d} L${w},${h} L0,${h} Z`} fill={`url(#sg${up}${accent})`}/>
      <path d={d} stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </svg>
  );
}
