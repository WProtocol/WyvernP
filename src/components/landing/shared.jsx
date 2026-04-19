import { C } from "../../theme/colors";

// Magazine-style numbered label: "01 / THE PROTOCOL"
export function SLabel({ num, children }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 22 }}>
      {num && (
        <span
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: "italic",
            fontSize: 32,
            lineHeight: 1,
            color: C.muted,
            letterSpacing: "-0.02em",
          }}
        >
          {num}
        </span>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 20, height: 1, background: `linear-gradient(90deg,${C.violet},${C.cyan})` }}/>
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: C.muted,
          }}
        >
          {children}
        </span>
      </div>
    </div>
  );
}

// Editorial display H2 — Instrument Serif italic dominates, optional Syne for emphasis spans
export function H2({ children, style }) {
  return (
    <h2
      style={{
        fontFamily: "'Instrument Serif', serif",
        fontStyle: "italic",
        fontWeight: 400,
        fontSize: "clamp(46px, 5.2vw, 84px)",
        lineHeight: 1.0,
        letterSpacing: "-0.025em",
        color: C.text,
        marginBottom: 24,
        ...style,
      }}
    >
      {children}
    </h2>
  );
}

// Big editorial pull-quote between sections (centered, italic)
export function PullQuote({ children, attribution }) {
  return (
    <section
      style={{
        padding: "120px 48px",
        textAlign: "center",
        position: "relative",
        background: C.bg,
        borderTop: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: "italic",
            fontSize: "clamp(40px, 5vw, 78px)",
            fontWeight: 400,
            lineHeight: 1.08,
            letterSpacing: "-0.02em",
            color: C.text,
          }}
        >
          {children}
        </div>
        {attribution && (
          <div
            style={{
              marginTop: 28,
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: C.dim,
            }}
          >
            — {attribution}
          </div>
        )}
      </div>
    </section>
  );
}
