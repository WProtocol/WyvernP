import { Check, X as Cross, Minus } from "lucide-react";
import { C } from "../../theme/colors";
import { useInView } from "../../hooks/useInView";
import { SLabel, H2 } from "./shared";

const COLS = [
  { name: "Wyvern",        emphasis: true },
  { name: "DinoSecurities" },
  { name: "Securitize" },
  { name: "Dinari" },
];

const ROWS = [
  { label: "Settlement",        values: ["Atomic DvP · <400ms",  "Atomic DvP",            "T+chain (varies)",   "Near-instant"] },
  { label: "Chain",             values: ["Solana-native",         "Solana + XRPL",         "Multi-chain",         "Arbitrum"] },
  { label: "Open source",       values: ["MIT",                   "partial",               "closed",              "closed"] },
  { label: "Composable in DeFi", values: [true,                    true,                    "limited",             "limited"] },
  { label: "Compliance",        values: ["MiCA + KYC oracle",     "Reg D · Reg S · Reg CF","Full reg suite",      "US KYC only"] },
  { label: "Asset breadth",     values: ["Equities · Bonds · Funds · RWA", "Equities · Debt · LLC · Funds", "Funds · Equities", "Stocks only"] },
  { label: "End-user trading UI",values: [true,                    false,                   false,                 true] },
  { label: "Live status",       values: ["Pre-mainnet",            "Pre-mainnet",          "Live",                "Live"] },
];

function Cell({ value, emphasis }) {
  if (value === true) {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: emphasis ? C.mint : C.text, fontFamily: "monospace", fontSize: 12 }}>
        <Check size={14} /> Yes
      </span>
    );
  }
  if (value === false) {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.dim, fontFamily: "monospace", fontSize: 12 }}>
        <Cross size={14} /> No
      </span>
    );
  }
  if (value === "—") {
    return <Minus size={14} color={C.dim} />;
  }
  return (
    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: emphasis ? C.text : C.muted, lineHeight: 1.5 }}>
      {value}
    </span>
  );
}

export function CompareSection() {
  const [ref, inView] = useInView();
  return (
    <section ref={ref} style={{ padding: "120px 48px", borderBottom: `1px solid ${C.border}`, background: C.bg2 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SLabel num="04">The shortlist</SLabel>
        <H2>
          Honestly, the&nbsp;<span className="gradient-text">competition.</span>
        </H2>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, lineHeight: 1.75, color: C.muted, maxWidth: 620, marginBottom: 56 }}>
          Tokenized securities is a small field. Here's how Wyvern actually compares to the platforms you should be looking at.
        </p>

        <div
          className={inView ? "fade-in-stagger" : ""}
          style={{
            border: `1px solid ${C.border}`,
            borderRadius: 18,
            overflow: "hidden",
            background: C.bg,
          }}
        >
          {/* header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.4fr repeat(4, 1fr)",
              borderBottom: `1px solid ${C.border}`,
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <div style={{ padding: "20px 24px", fontFamily: "monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: C.dim }}>
              Capability
            </div>
            {COLS.map(col => (
              <div
                key={col.name}
                style={{
                  padding: "20px 16px",
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: col.emphasis ? 800 : 600,
                  fontSize: col.emphasis ? 16 : 14,
                  letterSpacing: "-0.01em",
                  color: col.emphasis ? C.text : C.muted,
                  borderLeft: `1px solid ${C.border}`,
                  background: col.emphasis ? "linear-gradient(180deg, rgba(139,127,255,0.10), rgba(34,211,238,0.04))" : "transparent",
                  position: "relative",
                }}
              >
                {col.emphasis && (
                  <span
                    style={{
                      position: "absolute",
                      top: 6,
                      right: 10,
                      fontFamily: "monospace",
                      fontSize: 8,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: C.violet,
                    }}
                  >
                    Us
                  </span>
                )}
                {col.name}
              </div>
            ))}
          </div>

          {/* rows */}
          {ROWS.map((row, i) => (
            <div
              key={row.label}
              style={{
                display: "grid",
                gridTemplateColumns: "1.4fr repeat(4, 1fr)",
                borderBottom: i < ROWS.length - 1 ? `1px solid ${C.border}` : "none",
              }}
            >
              <div style={{ padding: "18px 24px", fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.text, fontWeight: 500 }}>
                {row.label}
              </div>
              {row.values.map((v, j) => (
                <div
                  key={j}
                  style={{
                    padding: "18px 16px",
                    borderLeft: `1px solid ${C.border}`,
                    background: COLS[j].emphasis ? "rgba(139,127,255,0.04)" : "transparent",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Cell value={v} emphasis={COLS[j].emphasis} />
                </div>
              ))}
            </div>
          ))}
        </div>

        <p style={{ fontFamily: "monospace", fontSize: 11, color: C.dim, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 18, textAlign: "right" }}>
          Last updated · pre-launch · open an issue if anything's wrong
        </p>
      </div>
    </section>
  );
}
