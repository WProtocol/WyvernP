import { useNavigate } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import { C } from "../../theme/colors";
import { TOKEN } from "../../config";
import { BASE_PRICES } from "../../data/landingContent";
import { useTokenStats } from "../../hooks/useTokenStats";
import { Globe3D } from "./Globe3D";
import { FloatingAssetCard } from "./FloatingAssetCard";

function fmtCompact(n) {
  if (n == null || !isFinite(n) || n === 0) return "0";
  const abs = Math.abs(n);
  if (abs >= 1e9) return "$" + (n / 1e9).toFixed(1) + "B";
  if (abs >= 1e6) return "$" + (n / 1e6).toFixed(1) + "M";
  if (abs >= 1e3) return "$" + (n / 1e3).toFixed(0) + "K";
  return "$" + Math.round(n);
}

export function HeroSection({ prices, onWatchDemo }) {
  const navigate = useNavigate();
  const tokenStats = useTokenStats();
  const marketCapLabel = tokenStats?.marketCap ? fmtCompact(tokenStats.marketCap) : "$0";
  const volumeLabel = tokenStats?.volume24h ? fmtCompact(tokenStats.volume24h) : "$0";
  const aaplD = prices["AAPL"] || { price: BASE_PRICES.AAPL, prev: BASE_PRICES.AAPL };
  const applePrice = aaplD.price;
  const aaplUp = applePrice >= (aaplD.prev || applePrice);
  const aaplChg = aaplD.prev > 0 ? ((applePrice - aaplD.prev) / aaplD.prev * 100).toFixed(2) : "0.00";
  const ustD = prices["US10Y"] || { price: BASE_PRICES["US10Y"], prev: BASE_PRICES["US10Y"] };
  const ustPrice = ustD.price;
  const ustUp = ustPrice >= (ustD.prev || ustPrice);
  const ustChg = ustD.prev > 0 ? ((ustPrice - ustD.prev) / ustD.prev * 100).toFixed(2) : "0.00";
  return (
    <section style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "center", position: "relative", padding: "120px 48px 80px", borderBottom: `1px solid ${C.border}` }}>
      <div className="grid-bg" style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.4 }}/>
      <div style={{ position: "relative", zIndex: 2, paddingRight: 48 }}>
        <div className="fade-up" style={{ display: "flex", gap: 8, flexWrap: "wrap", animationDelay: "0ms", marginBottom: 32 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: C.cyan, border: "1px solid rgba(34,211,238,0.25)", borderRadius: 100, padding: "6px 14px" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.mint, animation: "pulse-dot 2s infinite" }}/>
            Solana-native · Tokenized RWA · Live
          </span>
          <a
            href="https://github.com/WProtocol/WyvernP"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: C.muted, border: `1px solid ${C.border}`, borderRadius: 100, padding: "6px 14px", textDecoration: "none", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderHi; e.currentTarget.style.color = C.text; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-1.97c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.27.73-1.56-2.56-.29-5.25-1.28-5.25-5.68 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11.05 11.05 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.77.11 3.06.74.8 1.19 1.83 1.19 3.09 0 4.41-2.7 5.38-5.26 5.67.41.36.78 1.06.78 2.15v3.18c0 .31.21.67.79.56 4.57-1.52 7.86-5.83 7.86-10.91C23.5 5.73 18.27.5 12 .5z"/>
            </svg>
            Open source
          </a>
        </div>
        <h1
          className="fade-up"
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "clamp(60px, 6.4vw, 116px)",
            lineHeight: 0.96,
            letterSpacing: "-0.025em",
            marginBottom: 28,
            animationDelay: "80ms",
            color: C.text,
          }}
        >
          Burn the<br /><span className="gradient-text">clearinghouse.</span>
        </h1>
        <p className="fade-up" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 18, lineHeight: 1.65, color: C.muted, fontWeight: 300, maxWidth: 500, marginBottom: 48, animationDelay: "160ms" }}>
          $WYV is a memecoin for everyone who thinks T+2 is theft, banks are slow, and finance should belong to the people who actually use it. The dragon flies on Solana.
        </p>
        <div className="fade-up" style={{ display: "flex", gap: 12, alignItems: "center", animationDelay: "240ms", flexWrap: "wrap" }}>
          <a href="https://t.me/WyvernprotocoI" target="_blank" rel="noopener noreferrer" className="btn-gradient" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, padding: "14px 28px", borderRadius: 10, border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, color: "#fff", textDecoration: "none" }}>
            Join the dragons <ArrowRight size={16}/>
          </a>
          <button onClick={onWatchDemo} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 400, color: C.muted, background: "transparent", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 24px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderHi; e.currentTarget.style.color = C.text; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}>
            <Play size={14}/> Watch the lore
          </button>
        </div>
        <div className="fade-up" style={{ display: "flex", gap: 32, marginTop: 56, animationDelay: "320ms" }}>
          {[[marketCapLabel, "market cap"], ["0.4s", "settlement"], [volumeLabel, "24h volume"]].map(([n, l]) => (
            <div key={l}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 800, color: C.text }}>{n}</div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.dim, letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="fade-up" style={{ position: "relative", height: 560, animationDelay: "120ms" }}>
        <Globe3D/>
        <FloatingAssetCard style={{ position: "absolute", top: "12%", right: "4%", animationDelay: "0s" }}
          label="AAPL · Tokenized equity" name="Apple Inc."
          price={"$" + applePrice?.toFixed(2)} chg={(aaplUp ? "+" : "") + aaplChg + "%"} up={aaplUp}/>
        <FloatingAssetCard style={{ position: "absolute", bottom: "14%", left: "2%", animationDelay: "0.6s" }}
          label="US10Y · Treasury Bond" name="10yr UST"
          price={ustPrice?.toFixed(2) + "%"} chg={(ustUp ? "+" : "") + ustChg + "%"} up={ustUp}/>
        {TOKEN.launched && (
          <FloatingAssetCard style={{ position: "absolute", bottom: "2%", right: "6%", animationDelay: "1.2s" }}
            label="WYV · Protocol token" name="Wyvern" price="$—" chg="+—%" up accent/>
        )}
      </div>
    </section>
  );
}
