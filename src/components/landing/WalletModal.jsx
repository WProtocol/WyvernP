import { X, CheckCircle2 } from "lucide-react";
import { C } from "../../theme/colors";
import { useWallet } from "../../hooks/useWallet";
import { PhantomIcon, SolflareIcon, BackpackIcon } from "./WalletIcons";

export function WalletModal({ onClose }) {
  const { address, connect, connecting, error } = useWallet();
  const status = address ? "connected"
                : connecting ? "connecting"
                : error === "no-phantom" ? "noPhantom"
                : "idle";

  async function connectPhantom() { await connect(); }

  const comingSoonRow = (Icon, name) => (
    <div
      key={name}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "16px 20px",
        borderRadius: 12,
        background: "rgba(255,255,255,0.02)",
        border: `1px solid ${C.border}`,
        opacity: 0.55,
        cursor: "not-allowed",
        width: "100%",
      }}
    >
      <Icon size={36} />
      <div style={{ textAlign: "left", flex: 1 }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 600, color: C.text }}>{name}</div>
        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.dim }}>Solana wallet</div>
      </div>
      <span
        style={{
          fontFamily: "monospace",
          fontSize: 10,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: C.muted,
          background: "rgba(255,255,255,0.04)",
          border: `1px solid ${C.border}`,
          padding: "4px 10px",
          borderRadius: 6,
        }}
      >
        Coming soon
      </span>
    </div>
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(8px)",
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="glass-card" style={{ borderRadius: 20, padding: "40px", width: 420, position: "relative" }}>
        <button
          onClick={onClose}
          style={{ position: "absolute", top: 16, right: 16, background: "transparent", border: "none", color: C.dim, cursor: "pointer" }}
        >
          <X size={18} />
        </button>
        <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 8, color: C.text }}>
          Connect wallet
        </h3>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.muted, marginBottom: 28 }}>
          Connect your Phantom wallet to access the app.
        </p>

        {status === "connected" ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <CheckCircle2 size={40} color={C.mint} style={{ margin: "0 auto 12px" }} />
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 4 }}>
              Connected!
            </div>
            <div style={{ fontFamily: "monospace", fontSize: 11, color: C.dim }}>
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </div>
            <button
              className="btn-gradient"
              onClick={onClose}
              style={{ marginTop: 20, padding: "12px 28px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, color: "#fff" }}
            >
              Enter app →
            </button>
          </div>
        ) : status === "noPhantom" ? (
          <div style={{ textAlign: "center", padding: "12px 0" }}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.muted, marginBottom: 16 }}>
              Phantom wallet not detected.
            </p>
            <a
              href="https://phantom.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gradient"
              style={{ display: "inline-block", padding: "12px 24px", borderRadius: 8, textDecoration: "none", fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, color: "#fff" }}
            >
              Install Phantom →
            </a>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <button
              onClick={connectPhantom}
              disabled={status === "connecting"}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "16px 20px",
                borderRadius: 12,
                background: "rgba(139,127,255,0.1)",
                border: "1px solid rgba(139,127,255,0.25)",
                cursor: "pointer",
                transition: "all 0.2s",
                width: "100%",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(139,127,255,0.18)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(139,127,255,0.1)")}
            >
              <PhantomIcon size={36} />
              <div style={{ textAlign: "left", flex: 1 }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 600, color: C.text }}>
                  {status === "connecting" ? "Connecting…" : "Phantom"}
                </div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.dim }}>Solana wallet</div>
              </div>
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: 10,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: C.mint,
                  background: "rgba(16,217,160,0.1)",
                  padding: "4px 10px",
                  borderRadius: 6,
                }}
              >
                Available
              </span>
            </button>

            {comingSoonRow(SolflareIcon, "Solflare")}
            {comingSoonRow(BackpackIcon, "Backpack")}
          </div>
        )}
      </div>
    </div>
  );
}
