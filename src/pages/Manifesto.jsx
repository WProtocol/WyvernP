import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { C } from "../theme/colors";
import { GlobalStyles } from "../components/landing/GlobalStyles";
import { Orbs } from "../components/landing/Orbs";
import { Logo } from "../components/landing/Logo";
import { Footer } from "../components/landing/Footer";

const SECTIONS = [
  {
    n: "I.",
    title: "T+2 is theft.",
    body: [
      "Two days. That is how long the global financial system makes you wait between selling an asset and seeing the cash. Two days where someone else holds your money. Two days of counterparty risk. Two days where every player upstream — broker, custodian, clearing house, depository — earns rent on your patience.",
      "T+2 is not a feature. It is a tax — paid in time, in float, in opacity. The infrastructure that imposes it was built when the fastest way to confirm a trade was a phone call to lower Manhattan. We are not in 1975 anymore. The clearing house is dead. It just hasn't been buried.",
    ],
  },
  {
    n: "II.",
    title: "Settlement is the product.",
    body: [
      "Most fintech treats settlement as plumbing — invisible, boring, downstream of the actual experience. We think the opposite. Settlement is the experience. Every other property of capital markets — leverage, liquidity, composability, custody — collapses out of the speed and atomicity of how value moves between hands.",
      "Solana settles in under 400 milliseconds. Atomic. Final. No reconciliation, no clearing, no pending. When Wyvern says you bought a share, you bought a share. Full stop. The bar for everything else moves up accordingly.",
    ],
  },
  {
    n: "III.",
    title: "Trust comes from code.",
    body: [
      "We are a stealth team building a protocol that will, eventually, custody other people's claims on real-world assets. We could ask you to trust us — our brand, our backers, our LinkedIn profiles. We could not.",
      "Instead, every contract is open source. Every rule lives on-chain. Every trade is verifiable by anyone with an RPC endpoint and ten seconds. Compliance is enforced by the token, not by a team. Reserves are auditable in real time, not in a quarterly PDF. If we disappear tomorrow, the protocol keeps working — because the trust was never in us.",
    ],
  },
  {
    n: "IV.",
    title: "We will not pretend to be a bank.",
    body: [
      "There is a category of crypto-finance startup that wants to look exactly like an investment bank, with a blockchain quietly running underneath. White marble, Mahogany desks, partnership with Citadel, IPO in 2027. We are not that.",
      "Wyvern is a public utility for tokenized capital markets. The sales motion is not a relationship-driven enterprise sale to BlackRock. It is open infrastructure — used by builders, integrated by funds, regulated where it matters, and free to fork everywhere else. We will look weird to capital markets people. We will look obvious to anyone under thirty.",
    ],
  },
  {
    n: "V.",
    title: "What we are betting on.",
    body: [
      "That every share, bond, fund interest, and real-world claim eventually moves on-chain. That settlement converges to physics — the speed of light, atomic, global. That the venues that look like Wyvern in ten years will hold trillions, not billions.",
      "That capital markets, the most trust-dependent industry on earth, becomes the most code-dependent.",
      "That when it does, the people who are early — early users, early holders, early builders — will be the ones who built the rails the rest of finance will stand on.",
    ],
  },
];

export default function Manifesto() {
  const navigate = useNavigate();
  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "100vh", position: "relative" }}>
      <GlobalStyles />
      <Orbs />

      {/* Top bar — minimal */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          padding: "20px 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(2,2,12,0.7)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "transparent",
            border: "none",
            color: C.text,
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            padding: 0,
          }}
        >
          <ArrowLeft size={16} />
          <Logo size={22} />
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Wyvern
          </span>
        </button>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: C.dim,
          }}
        >
          Manifesto · v1
        </div>
      </header>

      {/* Hero */}
      <section style={{ padding: "120px 48px 80px", maxWidth: 920, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 11,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: C.violet,
            marginBottom: 28,
          }}
        >
          The Wyvern Manifesto
        </div>
        <h1
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "clamp(60px, 7vw, 132px)",
            lineHeight: 0.96,
            letterSpacing: "-0.025em",
            color: C.text,
            marginBottom: 36,
          }}
        >
          We are building the<br />
          <span className="gradient-text">end of T+2.</span>
        </h1>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 19,
            lineHeight: 1.65,
            color: C.muted,
            fontWeight: 300,
            maxWidth: 640,
          }}
        >
          A short document on what we believe, why we are building it, and what we will not do along the way. Read it once. Disagree publicly.
        </p>
      </section>

      {/* Sections */}
      <article style={{ maxWidth: 760, margin: "0 auto", padding: "0 48px", position: "relative", zIndex: 2 }}>
        {SECTIONS.map((s, i) => (
          <section key={s.n} style={{ marginBottom: 96 }}>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 18,
                marginBottom: 24,
                paddingBottom: 18,
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              <span
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: "italic",
                  fontSize: 36,
                  color: C.muted,
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                {s.n}
              </span>
              <h2
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: "clamp(38px, 4.4vw, 60px)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                  color: C.text,
                  margin: 0,
                }}
              >
                {s.title}
              </h2>
            </div>
            {s.body.map((p, j) => (
              <p
                key={j}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 17,
                  lineHeight: 1.75,
                  color: C.muted,
                  marginBottom: 22,
                  fontWeight: 300,
                }}
              >
                {p}
              </p>
            ))}
          </section>
        ))}

        {/* Sign-off */}
        <section
          style={{
            marginTop: 80,
            marginBottom: 120,
            padding: "60px 0",
            borderTop: `1px solid ${C.border}`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: "italic",
              fontSize: "clamp(34px, 4vw, 52px)",
              lineHeight: 1.1,
              color: C.text,
              marginBottom: 32,
            }}
          >
            Onward.
          </div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 11,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: C.dim,
              marginBottom: 36,
            }}
          >
            — The Wyvern team
          </div>
          <button
            onClick={() => navigate("/app")}
            className="btn-gradient"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "14px 28px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              fontWeight: 600,
              color: "#fff",
            }}
          >
            Open the app <ArrowRight size={16} />
          </button>
        </section>
      </article>

      <Footer />
    </div>
  );
}
