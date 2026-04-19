import { ArrowUpRight } from "lucide-react";
import { C } from "../../theme/colors";
import { SOCIALS } from "../../config";
import { useInView } from "../../hooks/useInView";
import { SLabel, H2 } from "./shared";

const CHANNELS = [
  {
    name: "Telegram",
    handle: "Join the lair",
    href: SOCIALS.telegram,
    desc: "The dragon's lair. Memes, alpha, lore. The center of gravity.",
    glyph: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/>
      </svg>
    ),
  },
  {
    name: "Twitter / X",
    handle: "@WyvernProtocoI",
    href: SOCIALS.twitter,
    desc: "Public broadcasts. Reply guys welcome. Tag us in your degen plays.",
    glyph: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zM17.083 19.77h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    name: "GitHub",
    handle: "WProtocol/WyvernP",
    href: SOCIALS.github,
    desc: "1500+ lines of Anchor code. We're memecoin first, but the dragon writes Rust.",
    glyph: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-1.97c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.27.73-1.56-2.56-.29-5.25-1.28-5.25-5.68 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11.05 11.05 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.77.11 3.06.74.8 1.19 1.83 1.19 3.09 0 4.41-2.7 5.38-5.26 5.67.41.36.78 1.06.78 2.15v3.18c0 .31.21.67.79.56 4.57-1.52 7.86-5.83 7.86-10.91C23.5 5.73 18.27.5 12 .5z"/>
      </svg>
    ),
  },
];

export function CommunitySection() {
  const [ref, inView] = useInView();
  return (
    <section ref={ref} id="community" style={{ padding: "120px 48px", borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <SLabel num="03">The lair</SLabel>
        <H2>Find the <span className="gradient-text">dragons.</span></H2>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, lineHeight: 1.75, color: C.muted, maxWidth: 660, marginBottom: 56 }}>
          The coin is just code. The community is the actual project. Join the lair and watch the dragon move.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
          {CHANNELS.map((c, i) => (
            <a
              key={c.name}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className={inView ? "fade-in-stagger" : ""}
              style={{
                display: "block",
                padding: "32px 28px",
                borderRadius: 18,
                background: C.surface,
                border: `1px solid ${C.border}`,
                textDecoration: "none",
                color: C.text,
                animationDelay: `${i * 90}ms`,
                position: "relative",
                transition: "border-color .25s, transform .25s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderHi; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
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
                  }}
                >
                  {c.glyph}
                </div>
                <ArrowUpRight size={18} color={C.muted} />
              </div>
              <div
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: "italic",
                  fontSize: 32,
                  color: C.text,
                  lineHeight: 1.05,
                  marginBottom: 8,
                  letterSpacing: "-0.02em",
                }}
              >
                {c.name}
              </div>
              <div style={{ fontFamily: "monospace", fontSize: 12, letterSpacing: "0.04em", color: C.violet, marginBottom: 12 }}>
                {c.handle}
              </div>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, lineHeight: 1.65, color: C.muted, margin: 0 }}>
                {c.desc}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
