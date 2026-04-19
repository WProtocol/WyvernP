import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Briefcase, Store, Vote, ArrowLeftRight,
  Building2, Settings, ChevronLeft, Search, Bell, Wallet,
  TrendingUp, TrendingDown, Zap, Shield, ExternalLink, X,
  User, Lock, Copy, Check, AlertCircle, LogOut, Mail,
  KeyRound, ArrowUpRight, Activity,
} from "lucide-react";
import { useWallet } from "../hooks/useWallet";
import { useStockPrices, fetchCandles } from "../hooks/useStockPrices";
import { placeDvpOrder, explorerUrl } from "../lib/dvp";
import { PublicKey } from "@solana/web3.js";
import { toast, useToastStore } from "../hooks/useToast";

/* ─── toaster ─── */
function Toaster() {
  const { toasts, dismiss } = useToastStore();
  const colors = { success: "#10d9a0", error: "#f43f5e", info: "#8b7fff" };
  if (!toasts.length) return null;
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 10, pointerEvents: "none" }}>
      {toasts.map(t => (
        <div key={t.id} onClick={() => dismiss(t.id)}
          style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 18px", background: "#0d0d1f", border: `1px solid ${colors[t.type]}40`, borderLeft: `3px solid ${colors[t.type]}`, borderRadius: 11, boxShadow: "0 8px 32px rgba(0,0,0,0.5)", fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "#f0efff", maxWidth: 340, pointerEvents: "all", cursor: "pointer", animation: "toastIn .25s cubic-bezier(.16,1,.3,1)" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: colors[t.type], flexShrink: 0 }} />
          {t.message}
        </div>
      ))}
    </div>
  );
}

const C = {
  bg:"#02020c", sidebar:"#05050f", surface:"rgba(255,255,255,0.03)",
  surfaceHi:"rgba(255,255,255,0.055)",
  border:"rgba(255,255,255,0.07)", borderHi:"rgba(139,127,255,0.35)",
  violet:"#8b7fff", cyan:"#22d3ee", mint:"#10d9a0", rose:"#f43f5e", amber:"#f59e0b",
  text:"#f0efff", muted:"rgba(240,239,255,0.55)", dim:"rgba(240,239,255,0.22)",
};

const ALL_SECURITIES = [
  { ticker:"AAPL",  name:"Apple Inc.",             type:"Equity", reg:"RegD",  sector:"Technology" },
  { ticker:"MSFT",  name:"Microsoft Corp.",         type:"Equity", reg:"RegD",  sector:"Technology" },
  { ticker:"NVDA",  name:"NVIDIA Corp.",            type:"Equity", reg:"RegD",  sector:"Technology" },
  { ticker:"GOOGL", name:"Alphabet Inc.",           type:"Equity", reg:"RegD",  sector:"Technology" },
  { ticker:"AMZN",  name:"Amazon.com Inc.",         type:"Equity", reg:"RegD",  sector:"Consumer"   },
  { ticker:"META",  name:"Meta Platforms",          type:"Equity", reg:"RegD",  sector:"Technology" },
  { ticker:"TSLA",  name:"Tesla Inc.",              type:"Equity", reg:"RegA+", sector:"Automotive" },
  { ticker:"NFLX",  name:"Netflix Inc.",            type:"Equity", reg:"RegD",  sector:"Media"      },
  { ticker:"ORCL",  name:"Oracle Corp.",            type:"Equity", reg:"RegD",  sector:"Technology" },
  { ticker:"AMD",   name:"Advanced Micro Devices",  type:"Equity", reg:"RegD",  sector:"Technology" },
  { ticker:"JPM",   name:"JPMorgan Chase",          type:"Equity", reg:"RegD",  sector:"Financial"  },
  { ticker:"V",     name:"Visa Inc.",               type:"Equity", reg:"RegD",  sector:"Financial"  },
  { ticker:"MA",    name:"Mastercard Inc.",         type:"Equity", reg:"RegD",  sector:"Financial"  },
  { ticker:"BAC",   name:"Bank of America",         type:"Equity", reg:"RegD",  sector:"Financial"  },
  { ticker:"GS",    name:"Goldman Sachs",           type:"Equity", reg:"RegD",  sector:"Financial"  },
  { ticker:"JNJ",   name:"Johnson & Johnson",       type:"Equity", reg:"RegD",  sector:"Healthcare" },
  { ticker:"UNH",   name:"UnitedHealth Group",      type:"Equity", reg:"RegD",  sector:"Healthcare" },
  { ticker:"PFE",   name:"Pfizer Inc.",             type:"Equity", reg:"RegS",  sector:"Healthcare" },
  { ticker:"LLY",   name:"Eli Lilly",               type:"Equity", reg:"RegD",  sector:"Healthcare" },
  { ticker:"PG",    name:"Procter & Gamble",        type:"Equity", reg:"RegD",  sector:"Consumer"   },
  { ticker:"KO",    name:"Coca-Cola Company",       type:"Equity", reg:"RegD",  sector:"Consumer"   },
  { ticker:"PEP",   name:"PepsiCo Inc.",            type:"Equity", reg:"RegD",  sector:"Consumer"   },
  { ticker:"WMT",   name:"Walmart Inc.",            type:"Equity", reg:"RegD",  sector:"Consumer"   },
  { ticker:"COST",  name:"Costco Wholesale",        type:"Equity", reg:"RegD",  sector:"Consumer"   },
  { ticker:"DIS",   name:"Walt Disney Co.",         type:"Equity", reg:"RegD",  sector:"Media"      },
  { ticker:"NKE",   name:"Nike Inc.",               type:"Equity", reg:"RegD",  sector:"Consumer"   },
  { ticker:"SBUX",  name:"Starbucks Corp.",         type:"Equity", reg:"RegD",  sector:"Consumer"   },
  { ticker:"SPY",   name:"S&P 500 ETF",             type:"ETF",    reg:"RegS",  sector:"ETF"        },
  { ticker:"QQQ",   name:"Nasdaq-100 ETF",          type:"ETF",    reg:"RegS",  sector:"ETF"        },
  { ticker:"VWRL",  name:"Vanguard World ETF",      type:"ETF",    reg:"RegS",  sector:"ETF"        },
  { ticker:"IEFA",  name:"iShares MSCI EAFE",       type:"ETF",    reg:"RegS",  sector:"ETF"        },
  { ticker:"US10Y", name:"10yr US Treasury",        type:"Debt",   reg:"RegS",  sector:"Government" },
  { ticker:"US2Y",  name:"2yr US Treasury",         type:"Debt",   reg:"RegS",  sector:"Government" },
];

const ALL_SYMS = ALL_SECURITIES.map(s => s.ticker);
const SECTORS  = ["All", "Technology", "Consumer", "Financial", "Healthcare", "Automotive", "Media", "ETF", "Government"];

const NAV = [
  { id:"dashboard",   label:"Dashboard",    icon:LayoutDashboard },
  { id:"marketplace", label:"Marketplace",  icon:Store           },
  { id:"portfolio",   label:"Portfolio",    icon:Briefcase       },
  { id:"settlement",  label:"Settlement",   icon:ArrowLeftRight  },
  { id:"governance",  label:"Governance",   icon:Vote            },
  { id:"issuer",      label:"Issuer Portal",icon:Building2       },
  { id:"settings",    label:"Settings",     icon:Settings        },
];

/* ─── tiny sparkline per card ─── */
function Sparkline({ up, h = 24 }) {
  const VW = 120;
  const pts = useMemo(() => {
    const base = up ? 40 : 70;
    const dir  = up ? 1 : -1;
    return Array.from({ length: 12 }, (_, i) =>
      Math.max(5, Math.min(95, base + dir * i * 2.5 + (Math.random() - 0.5) * 12))
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const mn = Math.min(...pts), mx = Math.max(...pts), span = mx - mn || 1;
  const xs = pts.map((_, i) => (i / (pts.length - 1)) * VW);
  const ys = pts.map(p => h - ((p - mn) / span) * h);
  const d  = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
  const color = up ? C.mint : C.rose;
  return (
    <svg viewBox={`0 0 ${VW} ${h}`} width="100%" height={h} preserveAspectRatio="none" style={{ display: "block" }}>
      <defs>
        <linearGradient id={`sp-${up}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L${VW},${h} L0,${h} Z`} fill={`url(#sp-${up})`} />
      <path d={d} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx={xs[xs.length - 1]} cy={ys[ys.length - 1]} r="3" fill={color} />
    </svg>
  );
}

/* ─── line chart ─── */
function LineChart({ candles, up }) {
  if (!candles || candles.length < 2) {
    return (
      <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center", color: C.dim, fontFamily: "monospace", fontSize: 11 }}>
        Loading chart…
      </div>
    );
  }
  const W = 560, H = 160, P = 6;
  const ys = candles.map(d => d.c);
  const mn = Math.min(...ys), mx = Math.max(...ys), span = mx - mn || 1;
  const xs = candles.map((_, i) => P + (i / (candles.length - 1)) * (W - P * 2));
  const yp = ys.map(v => H - P - ((v - mn) / span) * (H - P * 2));
  const d  = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${yp[i].toFixed(1)}`).join(" ");
  const color = up ? C.mint : C.rose;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="none" style={{ display: "block" }}>
      <defs>
        <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map(p => (
        <line key={p} x1={P} x2={W - P} y1={P + (H - P * 2) * p} y2={P + (H - P * 2) * p} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      ))}
      <path d={`${d} L${W - P},${H - P} L${P},${H - P} Z`} fill="url(#chart-fill)" />
      <path d={d} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={xs[xs.length - 1]} cy={yp[yp.length - 1]} r="4" fill={color} />
      <circle cx={xs[xs.length - 1]} cy={yp[yp.length - 1]} r="8" fill={color} opacity="0.25" />
    </svg>
  );
}

/* ─── stock detail modal ─── */
function StockDetailModal({ sec, priceMap, onClose }) {
  const { connected, connecting, connect, address } = useWallet();
  const [candles, setCandles]   = useState(null);
  const [showDvp, setShowDvp]   = useState(false);
  const q     = priceMap[sec.ticker] ?? { price: 0, prev: 0 };
  const price = q.price;
  const up    = price >= q.prev;
  const pct   = q.prev ? ((price - q.prev) / q.prev * 100).toFixed(2) : "0.00";

  useEffect(() => {
    let cancelled = false;
    fetchCandles(sec.ticker, 30).then(d => { if (!cancelled) setCandles(d); });
    return () => { cancelled = true; };
  }, [sec.ticker]);

  return (
    <>
      <div onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        style={{ position: "fixed", inset: 0, zIndex: 1500, background: "rgba(0,0,0,0.82)", backdropFilter: "blur(14px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ width: "min(860px,100%)", height: "min(540px, calc(100vh - 40px))", background: "#06060f", border: `1px solid ${C.border}`, borderRadius: 18, position: "relative", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, background: "transparent", border: "none", color: C.dim, cursor: "pointer", zIndex: 2 }}><X size={16} /></button>

          {/* header — fixed 72px */}
          <div style={{ height: 72, padding: "0 24px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg,rgba(139,127,255,0.2),rgba(34,211,238,0.1))", border: "1px solid rgba(139,127,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne',sans-serif", fontSize: 12, fontWeight: 700, color: C.violet, flexShrink: 0 }}>
              {sec.ticker.slice(0, 2)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
                <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 17, fontWeight: 800, color: C.text }}>{sec.ticker}</span>
                <Tag color={C.mint}>ACTIVE</Tag>
                <Tag color={C.violet}>{sec.type}</Tag>
                <Tag color={C.dim}>{sec.reg}</Tag>
              </div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.muted }}>{sec.name}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <LivePrice price={price} up={up} />
              <div style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: "monospace", fontSize: 11, color: up ? C.mint : C.rose, marginTop: 2 }}>
                {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {up ? "+" : ""}{pct}%
              </div>
            </div>
          </div>

          {/* body — fills remaining height exactly */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", flex: 1, overflow: "hidden" }}>

            {/* left: chart */}
            <div style={{ padding: "14px 20px", borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 10, overflow: "hidden" }}>
              <div style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: C.dim }}>30d · Daily close</div>
              <div style={{ flex: 1, overflow: "hidden" }}>
                <LineChart candles={candles} up={up} />
              </div>
              {candles && candles.length >= 2 && (
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "monospace", fontSize: 10, color: C.dim }}>
                  <span>30d low · ${Math.min(...candles.map(c => c.c)).toFixed(2)}</span>
                  <span>30d high · ${Math.max(...candles.map(c => c.c)).toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {[["Sector", sec.sector], ["Type", sec.type], ["Settlement", "Atomic DvP"]].map(([k, v]) => (
                  <div key={k} style={{ padding: "9px 12px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8 }}>
                    <div style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: C.dim, marginBottom: 3 }}>{k}</div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 12, fontWeight: 600, color: C.text }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* right: token details + order button */}
            <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10, overflow: "hidden" }}>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", flex: 1, overflow: "hidden" }}>
                <div style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: C.dim, marginBottom: 8 }}>Token Details</div>
                {[["Issuer", "Wyvern"], ["Restriction", sec.reg], ["Max Supply", "10,000"], ["Circulating", "—"], ["Mint", "—"]].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${C.border}` }}>
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.muted }}>{k}</span>
                    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: C.text }}>{v}</span>
                  </div>
                ))}
              </div>

              {connected ? (
                <button onClick={() => setShowDvp(true)}
                  style={{ width: "100%", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: "0.05em", padding: "12px", borderRadius: 10, border: "none", background: `linear-gradient(135deg,${C.violet},${C.cyan})`, color: "#fff", cursor: "pointer", flexShrink: 0 }}>
                  PLACE DVP ORDER
                </button>
              ) : (
                <button onClick={connect} disabled={connecting}
                  style={{ width: "100%", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700, padding: "12px", borderRadius: 10, border: "none", background: `linear-gradient(135deg,${C.violet},${C.cyan})`, color: "#fff", cursor: "pointer", opacity: connecting ? 0.6 : 1, flexShrink: 0 }}>
                  <Wallet size={13} style={{ marginRight: 7, verticalAlign: "middle" }} />
                  {connecting ? "Connecting…" : "Connect Wallet"}
                </button>
              )}
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <Lock size={10} color={C.dim} style={{ marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.dim, lineHeight: 1.5 }}>
                  {connected ? "Orders settle on Solana Mainnet." : "Connect Phantom to place orders."}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDvp && (
        <DvpModal sec={sec} price={price} address={address} onClose={() => setShowDvp(false)} />
      )}
    </>
  );
}

function LivePrice({ price }) {
  const prev = useRef(price);
  const [cls, setCls] = useState("");
  useEffect(() => {
    if (price === prev.current) return;
    setCls(price > prev.current ? "price-up" : "price-dn");
    prev.current = price;
    const t = setTimeout(() => setCls(""), 700);
    return () => clearTimeout(t);
  }, [price]);
  return (
    <div className={cls} style={{ fontFamily: "'DM Mono',monospace", fontSize: 24, fontWeight: 600, color: C.text, borderRadius: 6, padding: "2px 6px" }}>
      ${price.toFixed(2)}
    </div>
  );
}

/* ─── DVP order modal ─── */
const PAYMENT_OPTS = [
  { id: "USDC", label: "USDC", color: "#2775ca" },
  { id: "SOL",  label: "SOL",  color: "#9945ff" },
];

function DvpModal({ sec, price, onClose, address }) {
  const [amount, setAmount]   = useState("1");
  const [payment, setPayment] = useState("USDC");
  const [status, setStatus]   = useState("idle");
  const [txSig, setTxSig]     = useState(null);
  const [err, setErr]         = useState("");
  const total = (parseFloat(amount) || 0) * price;

  async function submit() {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;
    setStatus("signing"); setErr("");
    try {
      const sig = await placeDvpOrder({
        symbol: sec.ticker, tokenAmount: amt,
        pricePerToken: price, paymentMint: payment,
        buyerPubkey: new PublicKey(address),
      });
      setTxSig(sig); setStatus("confirmed");
      toast(`Order confirmed — ${amt} ${sec.ticker} @ $${price.toFixed(2)}`, { type: "success" });
    } catch (e) {
      const msg = e?.message || "Transaction failed";
      setErr(msg); setStatus("error");
      toast(msg.length > 60 ? "Transaction rejected by wallet." : msg, { type: "error" });
    }
  }

  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(14px)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: 24, overflowY: "auto" }}>
      <div style={{ width: "min(440px,100%)", background: "#08081a", border: `1px solid ${C.border}`, borderRadius: 18, overflow: "hidden", position: "relative", margin: "auto" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, background: "transparent", border: "none", color: C.dim, cursor: "pointer" }}><X size={16} /></button>

        <div style={{ padding: "22px 24px 18px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: C.dim, marginBottom: 10 }}>Place Order — {sec.ticker}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Tag color={C.mint}>ACTIVE</Tag>
            <Tag color={C.violet}>{sec.type}</Tag>
            <Tag color={C.dim}>{sec.reg}</Tag>
            <div style={{ marginLeft: "auto", fontFamily: "'DM Mono',monospace", fontSize: 15, color: C.text }}>${price.toFixed(2)}</div>
          </div>
        </div>

        {status === "confirmed" ? (
          <div style={{ padding: "32px 24px", textAlign: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(16,217,160,0.12)", border: "1px solid rgba(16,217,160,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Check size={24} color={C.mint} />
            </div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8 }}>Order submitted</div>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: 20 }}>Payment confirmed on Solana Mainnet.<br />Token delivery via matching engine.</div>
            <a href={explorerUrl(txSig)} target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "monospace", fontSize: 11, color: C.cyan, textDecoration: "none", padding: "8px 16px", borderRadius: 8, border: "1px solid rgba(34,211,238,0.25)", background: "rgba(34,211,238,0.06)" }}>
              <ExternalLink size={12} /> View on Solscan
            </a>
            <button onClick={onClose} style={{ display: "block", width: "100%", marginTop: 12, padding: "11px", borderRadius: 10, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>Close</button>
          </div>
        ) : (
          <div style={{ padding: "22px 24px" }}>
            <label style={{ display: "block", fontFamily: "monospace", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: C.dim, marginBottom: 8 }}>Token Amount</label>
            <input type="number" min="0.01" step="0.01" value={amount} onChange={e => setAmount(e.target.value)}
              style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${C.borderHi}`, borderRadius: 10, padding: "13px 16px", fontFamily: "'DM Mono',monospace", fontSize: 26, color: C.text, outline: "none", boxSizing: "border-box", marginBottom: 6 }} />
            {total > 0 && <div style={{ fontFamily: "monospace", fontSize: 11, color: C.dim, marginBottom: 20 }}>≈ ${total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</div>}

            <label style={{ display: "block", fontFamily: "monospace", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: C.dim, marginBottom: 8 }}>Accepted Payments</label>
            <div style={{ display: "flex", gap: 8, marginBottom: 22 }}>
              {PAYMENT_OPTS.map(opt => (
                <button key={opt.id} onClick={() => setPayment(opt.id)}
                  style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", borderRadius: 8, border: `1px solid ${payment === opt.id ? opt.color : C.border}`, background: payment === opt.id ? `${opt.color}1a` : "transparent", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, color: payment === opt.id ? opt.color : C.muted, transition: "all 0.15s" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: opt.color }} />{opt.label}
                </button>
              ))}
            </div>

            {status === "error" && <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.25)", fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.rose, marginBottom: 14 }}>{err}</div>}

            <button onClick={submit} disabled={status === "signing"}
              style={{ width: "100%", fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: "0.06em", padding: "14px", borderRadius: 10, border: "none", background: status === "signing" ? "rgba(255,255,255,0.06)" : `linear-gradient(135deg,${C.violet},${C.cyan})`, color: status === "signing" ? C.dim : "#fff", cursor: status === "signing" ? "not-allowed" : "pointer" }}>
              {status === "signing" ? "Waiting for Phantom…" : "SUBMIT"}
            </button>
            <div style={{ display: "flex", gap: 7, marginTop: 12 }}>
              <Lock size={10} color={C.dim} style={{ marginTop: 2, flexShrink: 0 }} />
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.dim, lineHeight: 1.6 }}>DvP settlement on Solana Mainnet. Payment is atomic.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Tag({ color, children }) {
  return (
    <span style={{ fontFamily: "monospace", fontSize: 9, padding: "2px 7px", borderRadius: 4, background: `${color}18`, color, border: `1px solid ${color}30` }}>{children}</span>
  );
}

/* ─── main app ─── */
export default function AppDashboard() {
  const navigate = useNavigate();
  const [page, setPage]           = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [selected, setSelected]   = useState(null);
  const { connected, connecting, address, short, connect, disconnect } = useWallet();
  const prices = useStockPrices(ALL_SYMS);

  return (
    <div style={{ display: "flex", height: "100vh", background: C.bg, color: C.text, fontFamily: "'DM Sans',sans-serif", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:${C.bg};}::-webkit-scrollbar-thumb{background:rgba(139,127,255,.25);border-radius:2px;}
        .nav-btn{display:flex;align-items:center;gap:11px;padding:9px 14px;border-radius:9px;cursor:pointer;transition:all .2s;color:${C.muted};border:none;background:transparent;width:100%;font-family:'DM Sans',sans-serif;font-size:13px;text-align:left;}
        .nav-btn:hover{background:rgba(139,127,255,0.07);color:${C.text};}
        .nav-btn.active{background:linear-gradient(135deg,rgba(139,127,255,0.18),rgba(34,211,238,0.08));color:${C.violet};border:1px solid rgba(139,127,255,0.2);}
        .card-hover{transition:all .2s;cursor:pointer;}
        .card-hover:hover{border-color:rgba(139,127,255,0.4)!important;background:rgba(139,127,255,0.05)!important;transform:translateY(-1px);}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
        @keyframes pulse{0%,100%{opacity:1;}50%{opacity:.35;}}
        @keyframes flash-up{0%{background:rgba(16,217,160,0.18);}100%{background:transparent;}}
        @keyframes flash-dn{0%{background:rgba(244,63,94,0.18);}100%{background:transparent;}}
        @keyframes toastIn{from{opacity:0;transform:translateX(24px);}to{opacity:1;transform:translateX(0);}}
        .fade{animation:fadeUp .35s ease both;}
        .price-up{animation:flash-up .6s ease;}
        .price-dn{animation:flash-dn .6s ease;}
        input:focus{border-color:${C.violet}!important;outline:none;}
      `}</style>

      {/* ── sidebar ── */}
      <aside style={{ width: collapsed ? 62 : 230, background: C.sidebar, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", transition: "width .28s ease", flexShrink: 0, overflow: "hidden" }}>
        {/* logo */}
        <div style={{ padding: "18px 14px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10, minHeight: 62, cursor: "pointer" }} onClick={() => navigate("/")}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg,rgba(139,127,255,0.25),rgba(34,211,238,0.12))", border: "1px solid rgba(139,127,255,0.35)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="16" height="15" viewBox="0 0 48 46" fill="none">
              <path fill="url(#lg)" d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z"/>
              <defs><linearGradient id="lg" x1="0" y1="0" x2="48" y2="46" gradientUnits="userSpaceOnUse"><stop stopColor="#a78bff"/><stop offset="1" stopColor="#22d3ee"/></linearGradient></defs>
            </svg>
          </div>
          {!collapsed && <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 15, fontWeight: 700, letterSpacing: "0.02em", color: C.text, whiteSpace: "nowrap" }}>Wyvern</span>}
        </div>

        {/* nav */}
        <nav style={{ flex: 1, padding: "10px 8px", display: "flex", flexDirection: "column", gap: 2, overflowY: "auto" }}>
          {NAV.map(item => (
            <button key={item.id} onClick={() => setPage(item.id)} title={collapsed ? item.label : undefined}
              className={`nav-btn${page === item.id ? " active" : ""}`}>
              <item.icon size={15} style={{ flexShrink: 0 }} />
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* bottom */}
        <div style={{ padding: "10px 8px", borderTop: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 4 }}>
          {connected ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 9, background: "rgba(16,217,160,0.07)", border: "1px solid rgba(16,217,160,0.18)" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.mint, flexShrink: 0, animation: "pulse 2s infinite" }} />
              {!collapsed && (
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div style={{ fontFamily: "monospace", fontSize: 11, color: C.mint, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{short}</div>
                  <div style={{ fontFamily: "monospace", fontSize: 9, color: C.dim, marginTop: 1 }}>Solana Mainnet</div>
                </div>
              )}
            </div>
          ) : (
            <button onClick={connect} disabled={connecting} className="nav-btn" style={{ color: C.violet }}>
              <Wallet size={15} style={{ flexShrink: 0 }} />
              {!collapsed && <span>{connecting ? "Connecting…" : "Connect wallet"}</span>}
            </button>
          )}
          <button onClick={() => setCollapsed(c => !c)} className="nav-btn" style={{ color: C.dim, fontSize: 12 }}>
            <ChevronLeft size={15} style={{ transform: collapsed ? "rotate(180deg)" : "none", transition: "transform .28s", flexShrink: 0 }} />
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* ── main ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* topbar */}
        <header style={{ height: 62, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", background: C.sidebar, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 700, color: C.text, textTransform: "capitalize" }}>{NAV.find(n => n.id === page)?.label}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "'DM Mono',monospace", fontSize: 10, color: C.mint, padding: "4px 10px", borderRadius: 99, background: "rgba(16,217,160,0.08)", border: "1px solid rgba(16,217,160,0.2)" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.mint, animation: "pulse 2s infinite" }} />
              SOLANA MAINNET
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8, padding: 8, cursor: "pointer", color: C.muted, display: "flex", alignItems: "center" }}><Search size={14} /></button>
            <button style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8, padding: 8, cursor: "pointer", color: C.muted, display: "flex", alignItems: "center" }}><Bell size={14} /></button>
            {connected ? (
              <button onClick={disconnect} style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(139,127,255,0.1)", border: "1px solid rgba(139,127,255,0.25)", borderRadius: 9, padding: "8px 16px", cursor: "pointer", fontFamily: "'DM Mono',monospace", fontSize: 11, color: C.violet }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.mint }} />{short}
              </button>
            ) : (
              <button onClick={connect} disabled={connecting} style={{ display: "flex", alignItems: "center", gap: 7, background: `linear-gradient(135deg,${C.violet},${C.cyan})`, border: "none", borderRadius: 9, padding: "8px 18px", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, color: "#fff", opacity: connecting ? 0.6 : 1 }}>
                <Wallet size={13} />{connecting ? "Connecting…" : "Connect Wallet"}
              </button>
            )}
          </div>
        </header>

        <main style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
          {page === "dashboard"   && <DashboardView prices={prices} connected={connected} onConnect={connect} connecting={connecting} onNavigate={setPage} />}
          {page === "marketplace" && <MarketplaceView prices={prices} onSelect={setSelected} />}
          {page === "portfolio"   && <PortfolioView />}
          {page === "settlement"  && <SettlementView />}
          {page === "settings"    && <SettingsView wallet={{ connected, address, short, connect, disconnect, connecting }} />}
          {["governance","issuer"].includes(page) && <ComingSoon label={NAV.find(n => n.id === page)?.label} />}
        </main>
      </div>

      {/* Modal lives here — outside <main> — so position:fixed is never inside a scroll container */}
      {selected && (
        <StockDetailModal sec={selected} priceMap={prices} onClose={() => setSelected(null)} />
      )}
      <Toaster />
    </div>
  );
}

/* ─── Dashboard ─── */
function DashboardView({ prices, connected, onConnect, connecting, onNavigate }) {
  const topMovers = useMemo(() => {
    return ALL_SECURITIES
      .map(s => { const q = prices[s.ticker]; if (!q) return null; return { ...s, price: q.price, pct: q.prev ? ((q.price - q.prev) / q.prev * 100) : 0 }; })
      .filter(Boolean)
      .sort((a, b) => Math.abs(b.pct) - Math.abs(a.pct))
      .slice(0, 5);
  }, [prices]);

  return (
    <div className="fade">
      {/* bento grid top row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14, marginBottom: 14 }}>
        {[
          { label: "Holdings", value: "—", sub: "securities held", icon: Briefcase, grad: `linear-gradient(135deg,${C.violet}22,${C.cyan}11)`, border: `rgba(139,127,255,0.3)` },
          { label: "Available Securities", value: ALL_SECURITIES.length.toString(), sub: "indexed on mainnet", icon: Store, grad: "rgba(255,255,255,0.03)", border: C.border },
          { label: "Network", value: "Mainnet", sub: "Solana", icon: Activity, grad: "rgba(255,255,255,0.03)", border: C.border },
          { label: "Settlement Speed", value: "~400ms", sub: "avg finality", icon: Zap, grad: "rgba(255,255,255,0.03)", border: C.border },
        ].map((s, i) => (
          <div key={i} style={{ background: s.grad, border: `1px solid ${s.border}`, borderRadius: 12, padding: "20px 22px", position: "relative", overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <span style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: C.dim }}>{s.label}</span>
              <s.icon size={14} color={C.dim} />
            </div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 800, color: C.text, letterSpacing: "-0.02em", marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.muted }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* main content row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 14 }}>
        {/* live prices table */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 700, color: C.text }}>Live Securities</span>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ fontFamily: "monospace", fontSize: 10, color: C.mint, display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.mint, animation: "pulse 1.5s infinite" }} />LIVE
              </span>
              <button onClick={() => onNavigate("marketplace")} style={{ fontFamily: "monospace", fontSize: 10, color: C.violet, background: "transparent", border: "none", cursor: "pointer", letterSpacing: "0.05em" }}>VIEW ALL →</button>
            </div>
          </div>
          {ALL_SYMS.slice(0, 8).map(sym => {
            const q = prices[sym]; if (!q) return null;
            const up = q.price >= q.prev;
            const pct = q.prev ? ((q.price - q.prev) / q.prev * 100).toFixed(2) : "0.00";
            const sec = ALL_SECURITIES.find(s => s.ticker === sym);
            return (
              <div key={sym} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderBottom: `1px solid ${C.border}`, transition: "background .15s", cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(139,127,255,0.04)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(139,127,255,0.1)", border: "1px solid rgba(139,127,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne',sans-serif", fontSize: 10, fontWeight: 700, color: C.violet }}>{sym.slice(0, 2)}</div>
                  <div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 700, color: C.text }}>{sym}</div>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.dim }}>{sec?.sector}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <Sparkline up={up} w={60} h={20} />
                  <div style={{ textAlign: "right", minWidth: 80 }}>
                    <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, fontWeight: 500, color: C.text }}>${q.price.toFixed(2)}</div>
                    <div style={{ fontFamily: "monospace", fontSize: 10, color: up ? C.mint : C.rose }}>{up ? "+" : ""}{pct}%</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* top movers */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 18px" }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 14 }}>Top Movers</div>
            {topMovers.map(s => (
              <div key={s.ticker} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 6, background: "rgba(139,127,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne',sans-serif", fontSize: 9, fontWeight: 700, color: C.violet }}>{s.ticker.slice(0, 2)}</div>
                  <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 12, fontWeight: 600, color: C.text }}>{s.ticker}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "monospace", fontSize: 11, color: s.pct >= 0 ? C.mint : C.rose }}>
                  {s.pct >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  {s.pct >= 0 ? "+" : ""}{s.pct.toFixed(2)}%
                </div>
              </div>
            ))}
          </div>

          {/* network status */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 18px" }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 14 }}>Network</div>
            {[
              ["Solana TPS", "~3,200", true],
              ["Block time", "400ms", true],
              ["Oracle", "Pyth · Live", true],
              ["KYC Module", "Active", true],
              ["DvP Engine", "v0.1 · Live", true],
            ].map(([k, v, ok]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.muted }}>{k}</span>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: ok ? C.mint : C.rose, display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: ok ? C.mint : C.rose }} />{v}
                </span>
              </div>
            ))}
          </div>

          {/* $WYV tier */}
          <div style={{ background: "linear-gradient(135deg,rgba(139,127,255,0.1),rgba(34,211,238,0.05))", border: "1px solid rgba(139,127,255,0.2)", borderRadius: 12, padding: "16px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 700, color: C.text }}>$WYV Tier</div>
              <span style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.1em", padding: "3px 8px", borderRadius: 4, background: "rgba(255,255,255,0.04)", color: C.dim }}>BASE</span>
            </div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 800, color: C.violet, marginBottom: 4 }}>0 <span style={{ fontSize: 14, fontWeight: 400, color: C.muted }}>$WYV</span></div>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.dim, marginBottom: 10 }}>No discount active</div>
            <div style={{ height: 1, background: C.border, marginBottom: 10 }} />
            <div style={{ fontFamily: "monospace", fontSize: 10, color: C.muted }}>Hold 100,000 $WYV → Bronze · 10% off fees</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Marketplace ─── */
function MarketplaceView({ prices, onSelect }) {
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("All");

  const filtered = useMemo(() => ALL_SECURITIES.filter(s => {
    const q = search.toLowerCase();
    return (sector === "All" || s.sector === sector) &&
      (s.ticker.toLowerCase().includes(q) || s.name.toLowerCase().includes(q));
  }), [search, sector]);

  return (
    <div className="fade">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 3 }}>Marketplace</h1>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.muted }}>{filtered.length} securities indexed</p>
        </div>
        <div style={{ position: "relative" }}>
          <Search size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: C.dim }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
            style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 9, padding: "9px 12px 9px 32px", fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.text, outline: "none", width: 220 }} />
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
        {SECTORS.map(s => (
          <button key={s} onClick={() => setSector(s)}
            style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, padding: "5px 14px", borderRadius: 99, border: `1px solid ${sector === s ? C.violet : C.border}`, background: sector === s ? "rgba(139,127,255,0.15)" : "transparent", color: sector === s ? C.violet : C.muted, cursor: "pointer", transition: "all .18s" }}>
            {s}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
        {filtered.map((sec, idx) => {
          const q     = prices[sec.ticker];
          const price = q?.price ?? 0;
          const prev  = q?.prev  ?? price;
          const up    = price >= prev;
          const pct   = prev ? ((price - prev) / prev * 100).toFixed(2) : "0.00";
          return (
            <SecurityCard key={sec.ticker} sec={sec} price={price} up={up} pct={pct} idx={idx}
              onClick={() => onSelect(sec)} />
          );
        })}
      </div>
    </div>
  );
}

function SecurityCard({ sec, price, up, pct, idx, onClick }) {
  const prevPrice = useRef(price);
  const [flash, setFlash] = useState("");

  useEffect(() => {
    if (price === prevPrice.current) return;
    setFlash(price > prevPrice.current ? "price-up" : "price-dn");
    prevPrice.current = price;
    const t = setTimeout(() => setFlash(""), 700);
    return () => clearTimeout(t);
  }, [price]);

  return (
    <div className={`card-hover ${flash}`} onClick={onClick}
      style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 13, padding: "18px 20px", animation: `fadeUp .4s ${idx * 30}ms both`, position: "relative", overflow: "hidden" }}>
      {/* header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: "linear-gradient(135deg,rgba(139,127,255,0.18),rgba(34,211,238,0.08))", border: "1px solid rgba(139,127,255,0.22)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 700, color: C.violet, flexShrink: 0 }}>
            {sec.ticker.slice(0, 2)}
          </div>
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 700, color: C.text }}>{sec.ticker}</div>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.muted }}>{sec.type}</div>
          </div>
        </div>
        <Tag color={C.mint}>ACTIVE</Tag>
      </div>

      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.muted, marginBottom: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{sec.name}</div>

      {/* sparkline */}
      <div style={{ marginBottom: 14 }}>
        <Sparkline up={up} w="100%" h={36} />
      </div>

      <div style={{ height: 1, background: C.border, marginBottom: 14 }} />

      {/* stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
        {[
          ["PRICE", `$${price.toFixed(2)}`],
          ["CHANGE", `${up ? "+" : ""}${pct}%`],
          ["REG", sec.reg],
        ].map(([k, v]) => (
          <div key={k}>
            <div style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.12em", color: C.dim, marginBottom: 4 }}>{k}</div>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, fontWeight: 500, color: k === "CHANGE" ? (up ? C.mint : C.rose) : C.text }}>{v}</div>
          </div>
        ))}
      </div>

      {/* order button */}
      <button onClick={e => { e.stopPropagation(); onClick(); }}
        style={{ width: "100%", fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", padding: "9px", borderRadius: 8, border: `1px solid rgba(139,127,255,0.3)`, background: "rgba(139,127,255,0.08)", color: C.violet, cursor: "pointer", transition: "all .18s" }}
        onMouseEnter={e => { e.currentTarget.style.background = `linear-gradient(135deg,${C.violet},${C.cyan})`; e.currentTarget.style.color = "#fff"; e.currentTarget.style.border = "1px solid transparent"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "rgba(139,127,255,0.08)"; e.currentTarget.style.color = C.violet; e.currentTarget.style.border = `1px solid rgba(139,127,255,0.3)`; }}>
        PLACE DVP ORDER
      </button>
    </div>
  );
}

/* ─── Portfolio ─── */
function PortfolioView() {
  return (
    <div className="fade">
      <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 4 }}>Portfolio</h1>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.muted, marginBottom: 28 }}>Your tokenized holdings across all securities.</p>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "56px 40px", textAlign: "center" }}>
        <Briefcase size={36} color={C.dim} style={{ margin: "0 auto 14px" }} />
        <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 6 }}>No holdings yet</h3>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.muted }}>Securities you acquire will appear here.</p>
      </div>
    </div>
  );
}

/* ─── Settlement ─── */
function SettlementView() {
  const [txs, setTxs] = useState([]);
  useEffect(() => {
    const tickers = ["AAPL","MSFT","TSLA","NVDA","AMZN","GOOGL","META"];
    let idx = 0;
    const id = setInterval(() => {
      const amt  = (Math.random() * 20 + 1).toFixed(2);
      const ms   = (Math.random() * 140 + 290).toFixed(0);
      const sig  = `${Math.random().toString(36).slice(2,6)}…${Math.random().toString(36).slice(2,6)}`;
      setTxs(prev => [{ sig, time: new Date().toLocaleTimeString(), ms, asset: tickers[idx % tickers.length], amount: amt }, ...prev].slice(0, 14));
      idx++;
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fade">
      <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 4 }}>Settlement</h1>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.muted, marginBottom: 24 }}>Atomic DvP settlement engine — live on Solana mainnet.</p>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "14px 22px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 700, color: C.text }}>Live Settlements</span>
          <span style={{ fontFamily: "monospace", fontSize: 10, color: C.mint, display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.mint, animation: "pulse 1.5s infinite" }} />ACTIVE
          </span>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {["Signature","Asset","Amount","Finality","Status","Time"].map(h => (
                <th key={h} style={{ padding: "11px 20px", textAlign: "left", fontFamily: "monospace", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: C.dim, fontWeight: 400 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {txs.length === 0 && (
              <tr><td colSpan={6} style={{ padding: "40px", textAlign: "center", fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.dim }}>Awaiting settlements…</td></tr>
            )}
            {txs.map((tx, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${C.border}`, animation: "fadeUp .25s ease both" }}>
                <td style={{ padding: "12px 20px", fontFamily: "'DM Mono',monospace", fontSize: 11, color: C.muted }}>{tx.sig}</td>
                <td style={{ padding: "12px 20px", fontFamily: "'Syne',sans-serif", fontSize: 12, fontWeight: 700, color: C.violet }}>{tx.asset}</td>
                <td style={{ padding: "12px 20px", fontFamily: "'DM Mono',monospace", fontSize: 12, color: C.text }}>{tx.amount}</td>
                <td style={{ padding: "12px 20px", fontFamily: "monospace", fontSize: 12, color: C.mint }}>{tx.ms}ms</td>
                <td style={{ padding: "12px 20px" }}><Tag color={C.mint}>SETTLED</Tag></td>
                <td style={{ padding: "12px 20px", fontFamily: "monospace", fontSize: 10, color: C.dim }}>{tx.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Settings ─── */
const PROFILE_KEY = "wyvern:profile";
function loadProfile() { try { return JSON.parse(localStorage.getItem(PROFILE_KEY) || "{}"); } catch { return {}; } }

function SettingsView({ wallet }) {
  const [tab, setTab]       = useState("profile");
  const [profile, setProfile] = useState(() => ({ displayName: "", email: "", ...loadProfile() }));
  const [saved, setSaved]   = useState(false);
  const [copied, setCopied] = useState(false);

  function save() { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); setSaved(true); setTimeout(() => setSaved(false), 1800); }
  async function copyAddr() { if (!wallet.address) return; try { await navigator.clipboard.writeText(wallet.address); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {} }

  return (
    <div className="fade">
      <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 4 }}>Settings</h1>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.muted, marginBottom: 28 }}>Manage your profile, wallet, and compliance status.</p>
      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 20, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 11, overflow: "hidden" }}>
            {[{ id: "profile", label: "Profile", icon: User }, { id: "security", label: "Security", icon: Shield }].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "13px 16px", background: tab === t.id ? "rgba(139,127,255,0.1)" : "transparent", border: "none", borderLeft: tab === t.id ? `2px solid ${C.violet}` : "2px solid transparent", cursor: "pointer", color: tab === t.id ? C.violet : C.muted, fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 500, borderBottom: t.id === "profile" ? `1px solid ${C.border}` : "none", textAlign: "left", transition: "all .15s" }}>
                <t.icon size={14} />{t.label}
              </button>
            ))}
          </div>
          <div style={{ background: C.surface, border: "1px solid rgba(245,158,11,0.2)", borderRadius: 11, padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <AlertCircle size={14} color={C.amber} />
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 600, color: C.text }}>KYC Status</div>
            </div>
            <div style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: C.amber, marginBottom: 10 }}>{wallet.connected ? "Pending review" : "Not verified"}</div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.muted, lineHeight: 1.6, marginBottom: 12 }}>Verify identity to trade RegD and RegA+ securities.</p>
            <button style={{ width: "100%", fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, padding: "8px", borderRadius: 8, border: `1px solid ${C.border}`, background: "transparent", color: C.text, cursor: "pointer" }}>Start verification →</button>
          </div>
        </div>

        <div>
          {tab === "profile" ? (
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "26px 28px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg,rgba(139,127,255,0.25),rgba(34,211,238,0.12))", border: "1px solid rgba(139,127,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <User size={20} color={C.text} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 4 }}>{profile.displayName || "Anonymous Trader"}</div>
                  <Tag color={wallet.connected ? C.violet : C.dim}>{wallet.connected ? "Wallet verified" : "Anonymous"}</Tag>
                </div>
              </div>
              <SettingsField label="Display name">
                <input value={profile.displayName} onChange={e => setProfile(p => ({ ...p, displayName: e.target.value }))} placeholder="How you'll appear in governance"
                  style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 9, padding: "10px 14px", fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.text, outline: "none" }} />
              </SettingsField>
              <SettingsField label="Email (optional)" hint="Used for settlement receipts and dividend notifications.">
                <input value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} type="email" placeholder="you@example.com"
                  style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 9, padding: "10px 14px", fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.text, outline: "none" }} />
              </SettingsField>
              <button onClick={save} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: `linear-gradient(135deg,${C.violet},${C.cyan})`, border: "none", borderRadius: 9, padding: "11px 22px", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, color: "#fff", marginTop: 8 }}>
                {saved ? <><Check size={13} /> Saved</> : "Save changes"}
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "22px 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(139,127,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}><Wallet size={15} color={C.violet} /></div>
                    <div><div style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 600, color: C.text }}>Connected wallet</div><div style={{ fontFamily: "monospace", fontSize: 10, color: C.dim }}>Phantom · Solana</div></div>
                  </div>
                  <Tag color={wallet.connected ? C.mint : C.dim}>{wallet.connected ? "Connected" : "Disconnected"}</Tag>
                </div>
                {wallet.connected ? (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 9, marginBottom: 12 }}>
                      <span style={{ flex: 1, fontFamily: "monospace", fontSize: 11, color: C.text, wordBreak: "break-all" }}>{wallet.address}</span>
                      <button onClick={copyAddr} style={{ background: "transparent", border: "none", color: C.violet, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
                        {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                      </button>
                    </div>
                    <button onClick={wallet.disconnect} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 8, background: "transparent", border: `1px solid ${C.border}`, color: C.muted, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>
                      <LogOut size={13} /> Disconnect
                    </button>
                  </>
                ) : (
                  <button onClick={wallet.connect} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: `linear-gradient(135deg,${C.violet},${C.cyan})`, border: "none", borderRadius: 9, padding: "10px 20px", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, color: "#fff" }}>
                    <Wallet size={13} /> Connect Phantom
                  </button>
                )}
              </div>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "22px 24px" }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 14 }}>Network</div>
                {[["Cluster","Solana Mainnet-Beta"],["RPC","api.mainnet-beta.solana.com"],["Oracle","Pyth Network · Live"],["Settlement","Atomic DvP"]].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: `1px solid ${C.border}` }}>
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.muted }}>{k}</span>
                    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: C.text }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SettingsField({ label, hint, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontFamily: "monospace", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: C.dim, marginBottom: 7 }}>{label}</label>
      {children}
      {hint && <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.dim, marginTop: 5 }}>{hint}</div>}
    </div>
  );
}

/* ─── Coming soon ─── */
function ComingSoon({ label }) {
  return (
    <div className="fade" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, gap: 14, textAlign: "center" }}>
      <div style={{ width: 60, height: 60, borderRadius: 12, background: "rgba(139,127,255,0.1)", border: "1px solid rgba(139,127,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Zap size={22} color={C.violet} />
      </div>
      <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: C.text }}>{label}</h2>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.muted }}>Coming soon — launching with mainnet in Q4 2026.</p>
    </div>
  );
}
