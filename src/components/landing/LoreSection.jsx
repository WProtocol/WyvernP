import { Flame, Coins, Wind } from "lucide-react";
import { C } from "../../theme/colors";
import { useInView } from "../../hooks/useInView";
import { SLabel, H2 } from "./shared";

const PILLARS = [
  {
    Icon: Flame,
    title: "Fire",
    body: "Dragons don't wait for clearing houses. The wyvern's breath ends T+2 the same way it ends everything else.",
  },
  {
    Icon: Coins,
    title: "Hoard",
    body: "Wyverns are the original hoarders. Stack $WYV. Hold it like the gold under a mountain. The dragon does not sell on the first 2x.",
  },
  {
    Icon: Wind,
    title: "Speed",
    body: "Solana settles in 400ms. A wyvern's wingbeat is faster. Every block is a kingdom flown over.",
  },
];

export function LoreSection() {
  const [ref, inView] = useInView();
  return (
    <section ref={ref} id="lore" style={{ padding: "120px 48px", borderBottom: `1px solid ${C.border}`, position: "relative" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <SLabel num="01">The lore</SLabel>
        <H2>Every coin needs a <span className="gradient-text">story.</span></H2>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, lineHeight: 1.75, color: C.muted, maxWidth: 660, marginBottom: 64 }}>
          A wyvern is a two-legged dragon — older than fiat, older than banks, older than every clearinghouse it will outlive. $WYV is the coin of the people who watched their grandfather wait two days for a stock trade to settle and decided that was enough.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
          {PILLARS.map((p, i) => {
            const Icon = p.Icon;
            return (
              <div
                key={p.title}
                className={inView ? "fade-in-stagger" : ""}
                style={{
                  padding: "40px 32px",
                  borderRadius: 18,
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  animationDelay: `${i * 100}ms`,
                  position: "relative",
                  overflow: "hidden",
                  transition: "border-color .25s,transform .25s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderHi; e.currentTarget.style.transform = "translateY(-3px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 12,
                    background: "linear-gradient(135deg,rgba(139,127,255,0.22),rgba(34,211,238,0.12))",
                    border: "1px solid rgba(139,127,255,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: C.violet,
                    marginBottom: 24,
                  }}
                >
                  <Icon size={22} strokeWidth={1.5} />
                </div>
                <div
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontStyle: "italic",
                    fontSize: 38,
                    color: C.text,
                    lineHeight: 1,
                    marginBottom: 16,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {p.title}
                </div>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, lineHeight: 1.7, color: C.muted, margin: 0 }}>{p.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
