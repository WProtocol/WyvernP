import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, TrendingUp, TrendingDown, Search, RefreshCw,
  X, Wallet, Lock, Zap, CheckCircle2, ExternalLink,
} from "lucide-react";
import { useStockPrices, fetchCandles } from "../hooks/useStockPrices";
import { useWallet } from "../hooks/useWallet";
import { FINNHUB_API_KEY } from "../config";
import { placeDvpOrder, explorerUrl } from "../lib/dvp";
import { PublicKey } from "@solana/web3.js";

const C = {
  bg:"#02020c", bg2:"#07071a", surface:"rgba(255,255,255,0.03)",
  border:"rgba(255,255,255,0.07)", borderHi:"rgba(255,255,255,0.14)",
  violet:"#8b7fff", cyan:"#22d3ee", mint:"#10d9a0", rose:"#f43f5e",
  text:"#f0efff", muted:"rgba(240,239,255,0.55)", dim:"rgba(240,239,255,0.25)",
};

const MARKET_DATA = [
  { sym:"AAPL",  name:"Apple Inc.",              sector:"Technology", type:"Equity", cap:"$3.22T" },
  { sym:"MSFT",  name:"Microsoft Corp.",         sector:"Technology", type:"Equity", cap:"$3.13T" },
  { sym:"NVDA",  name:"NVIDIA Corp.",            sector:"Technology", type:"Equity", cap:"$2.15T" },
  { sym:"GOOGL", name:"Alphabet Inc.",           sector:"Technology", type:"Equity", cap:"$2.11T" },
  { sym:"AMZN",  name:"Amazon.com Inc.",         sector:"Consumer",   type:"Equity", cap:"$1.94T" },
  { sym:"META",  name:"Meta Platforms",          sector:"Technology", type:"Equity", cap:"$1.55T" },
  { sym:"TSLA",  name:"Tesla Inc.",              sector:"Automotive", type:"Equity", cap:"$1.12T" },
  { sym:"NFLX",  name:"Netflix Inc.",            sector:"Media",      type:"Equity", cap:"$383B"  },
  { sym:"ORCL",  name:"Oracle Corp.",            sector:"Technology", type:"Equity", cap:"$526B"  },
  { sym:"AMD",   name:"Advanced Micro Devices",  sector:"Technology", type:"Equity", cap:"$238B"  },
  { sym:"JPM",   name:"JPMorgan Chase",          sector:"Financial",  type:"Equity", cap:"$706B"  },
  { sym:"V",     name:"Visa Inc.",               sector:"Financial",  type:"Equity", cap:"$620B"  },
  { sym:"MA",    name:"Mastercard Inc.",         sector:"Financial",  type:"Equity", cap:"$493B"  },
  { sym:"BAC",   name:"Bank of America",         sector:"Financial",  type:"Equity", cap:"$358B"  },
  { sym:"GS",    name:"Goldman Sachs",           sector:"Financial",  type:"Equity", cap:"$208B"  },
  { sym:"JNJ",   name:"Johnson & Johnson",       sector:"Healthcare", type:"Equity", cap:"$371B"  },
  { sym:"UNH",   name:"UnitedHealth Group",      sector:"Healthcare", type:"Equity", cap:"$503B"  },
  { sym:"PFE",   name:"Pfizer Inc.",             sector:"Healthcare", type:"Equity", cap:"$148B"  },
  { sym:"LLY",   name:"Eli Lilly",               sector:"Healthcare", type:"Equity", cap:"$702B"  },
  { sym:"PG",    name:"Procter & Gamble",        sector:"Consumer",   type:"Equity", cap:"$415B"  },
  { sym:"KO",    name:"Coca-Cola Company",       sector:"Consumer",   type:"Equity", cap:"$269B"  },
  { sym:"PEP",   name:"PepsiCo Inc.",            sector:"Consumer",   type:"Equity", cap:"$202B"  },
  { sym:"WMT",   name:"Walmart Inc.",            sector:"Consumer",   type:"Equity", cap:"$759B"  },
  { sym:"COST",  name:"Costco Wholesale",        sector:"Consumer",   type:"Equity", cap:"$432B"  },
  { sym:"DIS",   name:"Walt Disney Co.",         sector:"Media",      type:"Equity", cap:"$207B"  },
  { sym:"NKE",   name:"Nike Inc.",               sector:"Consumer",   type:"Equity", cap:"$114B"  },
  { sym:"SBUX",  name:"Starbucks Corp.",         sector:"Consumer",   type:"Equity", cap:"$109B"  },
  { sym:"SPY",   name:"S&P 500 ETF",             sector:"ETF",        type:"ETF",    cap:"$601B"  },
  { sym:"QQQ",   name:"Nasdaq-100 ETF",          sector:"ETF",        type:"ETF",    cap:"$310B"  },
  { sym:"VWRL",  name:"Vanguard World ETF",      sector:"ETF",        type:"ETF",    cap:"$63B"   },
  { sym:"IEFA",  name:"iShares Core MSCI EAFE",  sector:"ETF",        type:"ETF",    cap:"$119B"  },
  { sym:"US10Y", name:"10yr US Treasury",        sector:"Government", type:"Bond",   cap:"$—"     },
  { sym:"US2Y",  name:"2yr US Treasury",         sector:"Government", type:"Bond",   cap:"$—"     },
];

const SECTORS = ["All","Technology","Consumer","Financial","Healthcare","Automotive","Media","ETF","Government"];

function isRate(sym){ return sym==="US10Y" || sym==="US2Y"; }
function formatPrice(sym,p){ return isRate(sym) ? p.toFixed(3)+"%" : "$"+p.toFixed(2); }

function MiniChart({ up, w=80, h=28 }) {
  const pts = up
    ? Array.from({length:10},(_,i)=>60+i*4+Math.random()*8)
    : Array.from({length:10},(_,i)=>100-i*4-Math.random()*8);
  const mn=Math.min(...pts),mx=Math.max(...pts);
  const xs=pts.map((_,i)=>(i/(pts.length-1))*w);
  const ys=pts.map(p=>h-((p-mn)/(mx-mn+0.001))*h);
  const d=xs.map((x,i)=>`${i===0?"M":"L"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
  const color=up?C.mint:C.rose;
  return(
    <svg width={w} height={h} style={{overflow:"visible"}}>
      <defs><linearGradient id={`mg${up}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.15"/>
        <stop offset="100%" stopColor={color} stopOpacity="0"/>
      </linearGradient></defs>
      <path d={`${d} L${w},${h} L0,${h} Z`} fill={`url(#mg${up})`}/>
      <path d={d} stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

function BigChart({ data, up }) {
  if (!data || data.length < 2) {
    return(
      <div style={{height:220,display:"flex",alignItems:"center",justifyContent:"center",color:C.dim,fontFamily:"monospace",fontSize:12}}>
        Loading chart…
      </div>
    );
  }
  const w=640,h=220,pad=8;
  const ys=data.map(d=>d.c);
  const mn=Math.min(...ys),mx=Math.max(...ys),span=mx-mn||1;
  const xs=data.map((_,i)=>(i/(data.length-1))*(w-pad*2)+pad);
  const yps=ys.map(v=>h-pad-((v-mn)/span)*(h-pad*2));
  const d=xs.map((x,i)=>`${i===0?"M":"L"}${x.toFixed(1)},${yps[i].toFixed(1)}`).join(" ");
  const color=up?C.mint:C.rose;
  const lo=Math.min(...ys),hi=Math.max(...ys);
  return(
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none" style={{display:"block"}}>
        <defs>
          <linearGradient id="bg-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25"/>
            <stop offset="100%" stopColor={color} stopOpacity="0"/>
          </linearGradient>
        </defs>
        {[0.25,0.5,0.75].map(p=>(
          <line key={p} x1={pad} x2={w-pad} y1={pad+(h-pad*2)*p} y2={pad+(h-pad*2)*p} stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
        ))}
        <path d={`${d} L${w-pad},${h-pad} L${pad},${h-pad} Z`} fill="url(#bg-fill)"/>
        <path d={d} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx={xs[xs.length-1]} cy={yps[yps.length-1]} r="4" fill={color}/>
        <circle cx={xs[xs.length-1]} cy={yps[yps.length-1]} r="8" fill={color} opacity="0.25"/>
      </svg>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:8,fontFamily:"monospace",fontSize:10,color:C.dim}}>
        <span>30d low · {lo.toFixed(2)}</span>
        <span>30d high · {hi.toFixed(2)}</span>
      </div>
    </div>
  );
}

const PAYMENT_OPTS = [
  { id:"USDC", label:"USDC", color:"#2775ca" },
  { id:"SOL",  label:"SOL",  color:"#9945ff" },
];

function DvpOrderModal({ asset, price, onClose }) {
  const { connected, connect, connecting, address } = useWallet();
  const [tokenAmount, setTokenAmount] = useState("1");
  const [payment, setPayment] = useState("USDC");
  const [status, setStatus] = useState("idle"); // idle | signing | confirmed | error
  const [txSig, setTxSig] = useState(null);
  const [errMsg, setErrMsg] = useState("");

  const totalUsd = (parseFloat(tokenAmount) || 0) * price;

  async function handleSubmit() {
    if (!connected) { await connect(); return; }
    const amt = parseFloat(tokenAmount);
    if (!amt || amt <= 0) return;
    setStatus("signing");
    setErrMsg("");
    try {
      const sig = await placeDvpOrder({
        symbol: asset.sym,
        tokenAmount: amt,
        pricePerToken: price,
        paymentMint: payment,
        buyerPubkey: new PublicKey(address),
      });
      setTxSig(sig);
      setStatus("confirmed");
    } catch (e) {
      setErrMsg(e?.message || "Transaction failed");
      setStatus("error");
    }
  }

  return (
    <div onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}
      style={{position:"fixed",inset:0,zIndex:1000,background:"rgba(0,0,0,0.82)",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px"}}>
      <div style={{width:"min(480px,100%)",background:C.bg2,border:`1px solid ${C.border}`,borderRadius:16,overflow:"hidden",position:"relative"}}>
        <button onClick={onClose} style={{position:"absolute",top:16,right:16,background:"transparent",border:"none",color:C.dim,cursor:"pointer",zIndex:2}}><X size={16}/></button>

        {/* header */}
        <div style={{padding:"24px 24px 20px",borderBottom:`1px solid ${C.border}`}}>
          <div style={{fontFamily:"monospace",fontSize:10,letterSpacing:"0.16em",textTransform:"uppercase",color:C.dim,marginBottom:6}}>Place Order</div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:44,height:44,borderRadius:10,background:"linear-gradient(135deg,rgba(139,127,255,0.2),rgba(34,211,238,0.1))",border:"1px solid rgba(139,127,255,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:700,color:C.violet}}>
              {asset.sym.slice(0,2)}
            </div>
            <div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:700,color:C.text}}>{asset.sym}</div>
              <div style={{display:"flex",gap:6,marginTop:3}}>
                <span style={{fontFamily:"monospace",fontSize:9,padding:"2px 7px",borderRadius:4,background:"rgba(16,217,160,0.12)",color:C.mint}}>ACTIVE</span>
                <span style={{fontFamily:"monospace",fontSize:9,padding:"2px 7px",borderRadius:4,background:"rgba(139,127,255,0.1)",color:C.violet}}>{asset.type}</span>
                <span style={{fontFamily:"monospace",fontSize:9,padding:"2px 7px",borderRadius:4,background:"rgba(255,255,255,0.04)",color:C.dim}}>RegD</span>
              </div>
            </div>
            <div style={{marginLeft:"auto",textAlign:"right"}}>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:16,color:C.text}}>{formatPrice(asset.sym,price)}</div>
              <div style={{fontFamily:"monospace",fontSize:10,color:C.muted}}>per token</div>
            </div>
          </div>
        </div>

        {/* body */}
        {status === "confirmed" ? (
          <div style={{padding:"32px 24px",textAlign:"center"}}>
            <CheckCircle2 size={40} color={C.mint} style={{marginBottom:16}}/>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:700,color:C.text,marginBottom:8}}>Order submitted</div>
            <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:C.muted,lineHeight:1.7,marginBottom:20}}>
              Your payment was sent on Solana Mainnet.<br/>
              Token delivery processes via the matching engine.
            </div>
            <a href={explorerUrl(txSig)} target="_blank" rel="noopener noreferrer"
              style={{display:"inline-flex",alignItems:"center",gap:6,fontFamily:"monospace",fontSize:11,color:C.cyan,textDecoration:"none",padding:"8px 14px",borderRadius:8,border:`1px solid rgba(34,211,238,0.25)`,background:"rgba(34,211,238,0.06)"}}>
              <ExternalLink size={12}/>
              View on Solscan
            </a>
            <button onClick={onClose}
              style={{display:"block",width:"100%",marginTop:16,fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:600,padding:"11px",borderRadius:10,border:`1px solid ${C.border}`,background:"transparent",color:C.muted,cursor:"pointer"}}>
              Close
            </button>
          </div>
        ) : (
          <div style={{padding:"24px"}}>
            {/* token amount */}
            <div style={{marginBottom:20}}>
              <label style={{display:"block",fontFamily:"monospace",fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:C.dim,marginBottom:8}}>Token Amount</label>
              <input
                type="number" min="0.01" step="0.01"
                value={tokenAmount}
                onChange={e=>setTokenAmount(e.target.value)}
                style={{width:"100%",background:"rgba(255,255,255,0.04)",border:`1px solid ${C.borderHi}`,borderRadius:10,padding:"14px 16px",fontFamily:"'DM Mono',monospace",fontSize:22,color:C.text,outline:"none",boxSizing:"border-box"}}
              />
              {totalUsd > 0 && (
                <div style={{fontFamily:"monospace",fontSize:11,color:C.dim,marginTop:6}}>
                  ≈ ${totalUsd.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})} USD
                </div>
              )}
            </div>

            {/* payment selector */}
            <div style={{marginBottom:24}}>
              <label style={{display:"block",fontFamily:"monospace",fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:C.dim,marginBottom:8}}>Accepted Payments</label>
              <div style={{display:"flex",gap:8}}>
                {PAYMENT_OPTS.map(opt=>(
                  <button key={opt.id} onClick={()=>setPayment(opt.id)}
                    style={{display:"flex",alignItems:"center",gap:7,padding:"9px 16px",borderRadius:8,border:`1px solid ${payment===opt.id?opt.color:C.border}`,background:payment===opt.id?`${opt.color}18`:"transparent",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:600,color:payment===opt.id?opt.color:C.muted,transition:"all 0.15s"}}>
                    <span style={{width:8,height:8,borderRadius:"50%",background:opt.color,flexShrink:0}}/>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* error */}
            {status==="error" && (
              <div style={{padding:"10px 14px",borderRadius:8,background:"rgba(244,63,94,0.08)",border:"1px solid rgba(244,63,94,0.25)",fontFamily:"'DM Sans',sans-serif",fontSize:12,color:C.rose,marginBottom:16}}>
                {errMsg}
              </div>
            )}

            {/* submit */}
            {connected ? (
              <button onClick={handleSubmit} disabled={status==="signing"}
                style={{width:"100%",fontFamily:"'DM Sans',sans-serif",fontSize:14,fontWeight:700,letterSpacing:"0.06em",padding:"14px",borderRadius:10,border:"none",background:status==="signing"?"rgba(255,255,255,0.06)":`linear-gradient(135deg,${C.violet},${C.cyan})`,color:status==="signing"?C.dim:"#fff",cursor:status==="signing"?"not-allowed":"pointer",transition:"all 0.2s"}}>
                {status==="signing" ? "Waiting for Phantom…" : "SUBMIT"}
              </button>
            ) : (
              <button onClick={connect} disabled={connecting}
                style={{width:"100%",fontFamily:"'DM Sans',sans-serif",fontSize:14,fontWeight:700,padding:"14px",borderRadius:10,border:"none",background:`linear-gradient(135deg,${C.violet},${C.cyan})`,color:"#fff",cursor:"pointer",opacity:connecting?0.6:1}}>
                <Wallet size={14} style={{marginRight:8,verticalAlign:"middle"}}/>
                {connecting ? "Connecting…" : "Connect Wallet"}
              </button>
            )}

            <div style={{display:"flex",alignItems:"flex-start",gap:8,marginTop:14}}>
              <Lock size={10} color={C.dim} style={{marginTop:2,flexShrink:0}}/>
              <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:C.dim,lineHeight:1.6}}>
                DvP order — payment settles atomically on Solana Mainnet. Token delivery via matching engine.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StockModal({ asset, price, prev, onClose }) {
  const [candles, setCandles] = useState(null);
  const [showOrder, setShowOrder] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchCandles(asset.sym, 30).then(d => { if (!cancelled) setCandles(d); });
    return () => { cancelled = true; };
  }, [asset.sym]);

  const up = price >= prev;
  const pct = ((price - prev) / prev * 100).toFixed(2);

  return (
    <>
    <div onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}
      style={{position:"fixed",inset:0,zIndex:1000,background:"rgba(0,0,0,0.78)",backdropFilter:"blur(10px)",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px"}}>
      <div style={{width:"min(880px,100%)",maxHeight:"92vh",overflow:"auto",background:C.bg2,border:`1px solid ${C.border}`,borderRadius:20,position:"relative"}}>
        <button onClick={onClose} style={{position:"absolute",top:18,right:18,background:"transparent",border:"none",color:C.dim,cursor:"pointer",zIndex:2}}><X size={18}/></button>

        {/* header */}
        <div style={{padding:"32px 36px 24px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:20}}>
          <div style={{width:56,height:56,borderRadius:12,background:"linear-gradient(135deg,rgba(139,127,255,0.2),rgba(34,211,238,0.1))",border:"1px solid rgba(139,127,255,0.28)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:700,color:C.violet}}>
            {asset.sym.slice(0,2)}
          </div>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
              <span style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:700,color:C.text,letterSpacing:"-0.02em"}}>{asset.sym}</span>
              <span style={{fontFamily:"monospace",fontSize:10,padding:"3px 8px",borderRadius:4,background:"rgba(16,217,160,0.12)",color:C.mint}}>ACTIVE</span>
              <span style={{fontFamily:"monospace",fontSize:10,padding:"3px 8px",borderRadius:4,background:asset.type==="Equity"?"rgba(139,127,255,0.12)":asset.type==="Bond"?"rgba(34,211,238,0.12)":"rgba(16,217,160,0.12)",color:asset.type==="Equity"?C.violet:asset.type==="Bond"?C.cyan:C.mint}}>{asset.type}</span>
              <span style={{fontFamily:"monospace",fontSize:10,padding:"3px 8px",borderRadius:4,background:"rgba(255,255,255,0.04)",color:C.dim}}>RegD</span>
            </div>
            <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:C.muted}}>{asset.name}</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{textAlign:"right"}}>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:28,fontWeight:600,color:C.text,letterSpacing:"-0.02em"}}>{formatPrice(asset.sym,price)}</div>
              <div style={{display:"inline-flex",alignItems:"center",gap:5,fontFamily:"monospace",fontSize:12,fontWeight:600,color:up?C.mint:C.rose,marginTop:2}}>
                {up?<TrendingUp size={12}/>:<TrendingDown size={12}/>}
                {up?"+":""}{pct}%
              </div>
            </div>
            <button onClick={()=>setShowOrder(true)}
              style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:700,letterSpacing:"0.05em",padding:"12px 20px",borderRadius:10,border:`1px solid ${C.violet}`,background:"rgba(139,127,255,0.12)",color:C.violet,cursor:"pointer",whiteSpace:"nowrap"}}>
              PLACE DVP ORDER
            </button>
          </div>
        </div>

        {/* body */}
        <div style={{padding:"28px 36px",display:"grid",gridTemplateColumns:"1fr 260px",gap:32}}>
          <div>
            <div style={{fontFamily:"monospace",fontSize:10,letterSpacing:"0.14em",textTransform:"uppercase",color:C.dim,marginBottom:12}}>30d · Daily close</div>
            <BigChart data={candles} up={up}/>
            <div style={{marginTop:24,display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
              {[
                ["Sector",asset.sector],
                ["Market cap",asset.cap],
                ["Settlement","Atomic DvP"],
              ].map(([k,v])=>(
                <div key={k} style={{padding:"14px 16px",background:C.surface,border:`1px solid ${C.border}`,borderRadius:10}}>
                  <div style={{fontFamily:"monospace",fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:C.dim,marginBottom:4}}>{k}</div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:600,color:C.text}}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* token details panel */}
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:18}}>
              <div style={{fontFamily:"monospace",fontSize:10,letterSpacing:"0.14em",textTransform:"uppercase",color:C.dim,marginBottom:14}}>Token Details</div>
              {[
                ["Issuer","Wyvern Protocol"],
                ["Jurisdiction","—"],
                ["Restriction","RegD"],
                ["Max Supply","10,000"],
                ["Circulating","—"],
              ].map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${C.border}`}}>
                  <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:C.muted}}>{k}</span>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:C.text}}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:18}}>
              <div style={{fontFamily:"monospace",fontSize:10,letterSpacing:"0.14em",textTransform:"uppercase",color:C.dim,marginBottom:12}}>On-Chain</div>
              <div style={{fontFamily:"monospace",fontSize:10,color:C.dim,marginBottom:4}}>Mint</div>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:C.cyan,wordBreak:"break-all",lineHeight:1.5}}>—</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    {showOrder && (
      <DvpOrderModal
        asset={asset}
        price={price}
        onClose={()=>setShowOrder(false)}
      />
    )}
    </>
  );
}

function Row({label,value}) {
  return(
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:C.muted}}>{label}</span>
      <span style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:C.text}}>{value}</span>
    </div>
  );
}

export default function MarketsPage() {
  const navigate = useNavigate();
  const symbols = useMemo(()=>MARKET_DATA.map(m=>m.sym),[]);
  const priceMap = useStockPrices(symbols);
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("All");
  const [selected, setSelected] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setLastUpdate(new Date()), 3000);
    return () => clearInterval(id);
  }, []);

  const filtered = MARKET_DATA.filter(m => {
    const q = search.toLowerCase();
    return (sector === "All" || m.sector === sector) &&
      (m.sym.toLowerCase().includes(q) || m.name.toLowerCase().includes(q));
  });

  const selectedQuote = selected ? priceMap[selected.sym] : null;

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "100vh", fontFamily: "'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:${C.bg};}::-webkit-scrollbar-thumb{background:rgba(139,127,255,.3);border-radius:2px;}
        .row:hover{background:rgba(139,127,255,0.04);}
        .chip:hover{background:rgba(139,127,255,0.15);color:${C.text};border-color:rgba(139,127,255,0.3);}
        .buy-btn:hover{opacity:0.9;transform:translateY(-1px);transition:all .2s;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
        @keyframes pulse{0%,100%{opacity:1;}50%{opacity:.4;}}
      `}</style>

      <nav style={{ height: 64, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px", background: "rgba(2,2,12,0.9)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <button onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: 8, background: "transparent", border: "none", color: C.muted, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>
            <ArrowLeft size={14} /> Back
          </button>
          <div style={{ width: 1, height: 20, background: C.border }} />
          <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 700, color: C.text }}>Markets</span>
          <span style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "monospace", fontSize: 11, color: C.mint }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.mint, animation: "pulse 1.5s infinite" }} />
            {FINNHUB_API_KEY ? "Live prices" : "Simulated"}
          </span>
        </div>
        <span style={{ fontFamily: "monospace", fontSize: 11, color: C.dim }}>
          Updated {lastUpdate.toLocaleTimeString()}
          <RefreshCw size={11} style={{ marginLeft: 6, display: "inline", color: C.dim }} />
        </span>
      </nav>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 48px" }}>
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(36px,4vw,56px)", fontWeight: 800, letterSpacing: "-0.03em", color: C.text, marginBottom: 12 }}>
            Global <span style={{ background: `linear-gradient(135deg,${C.violet},${C.cyan})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Markets</span>
          </h1>
          <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.7, maxWidth: 560 }}>
            {MARKET_DATA.length} tokenized assets · Click any row for live chart & buy flow · All settled in under 400ms on Solana.
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {SECTORS.map(s => (
              <button key={s} onClick={() => setSector(s)} className="chip"
                style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 500, padding: "6px 14px", borderRadius: 100, border: `1px solid ${sector === s ? C.violet : C.border}`, background: sector === s ? "rgba(139,127,255,0.15)" : "transparent", color: sector === s ? C.violet : C.muted, cursor: "pointer", transition: "all .2s" }}>
                {s}
              </button>
            ))}
          </div>
          <div style={{ position: "relative" }}>
            <Search size={13} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.dim }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search markets…"
              style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 12px 9px 32px", fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.text, outline: "none", width: 220 }}
              onFocus={e => e.target.style.borderColor = C.violet}
              onBlur={e => e.target.style.borderColor = C.border} />
          </div>
        </div>

        <div style={{ border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden", background: C.bg2 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {["#","Asset","Sector","Price","24h Change","Chart","Type","Market Cap",""].map(h => (
                  <th key={h} style={{ padding: "14px 20px", textAlign: h === "#" ? "center" : "left", fontFamily: "monospace", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: C.dim, fontWeight: 400, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((m, i) => {
                const q = priceMap[m.sym];
                const price = q?.price ?? 0;
                const prev = q?.prev ?? price;
                const pct = prev ? ((price - prev) / prev * 100).toFixed(2) : "0.00";
                const up = price >= prev;
                return (
                  <tr key={m.sym} className="row" onClick={()=>setSelected(m)}
                    style={{ borderBottom: `1px solid ${C.border}`, transition: "background .15s", cursor: "pointer", animation: `fadeUp .4s ${i * 25}ms both` }}>
                    <td style={{ padding: "16px 20px", textAlign: "center", fontFamily: "monospace", fontSize: 12, color: C.dim }}>{i + 1}</td>
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(139,127,255,0.1)", border: "1px solid rgba(139,127,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 700, color: C.violet, flexShrink: 0 }}>
                          {m.sym.slice(0, 2)}
                        </div>
                        <div>
                          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 700, color: C.text }}>{m.sym}</div>
                          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.muted, whiteSpace: "nowrap" }}>{m.name}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <span style={{ fontFamily: "monospace", fontSize: 11, padding: "3px 8px", borderRadius: 4, background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, color: C.dim }}>{m.sector}</span>
                    </td>
                    <td style={{ padding: "16px 20px", fontFamily: "'DM Mono',monospace", fontSize: 14, fontWeight: 500, color: C.text }}>
                      {formatPrice(m.sym, price)}
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: "monospace", fontSize: 12, fontWeight: 600, color: up ? C.mint : C.rose }}>
                        {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {up ? "+" : ""}{pct}%
                      </span>
                    </td>
                    <td style={{ padding: "16px 20px" }}><MiniChart up={up} /></td>
                    <td style={{ padding: "16px 20px" }}>
                      <span style={{ fontFamily: "monospace", fontSize: 10, padding: "3px 8px", borderRadius: 4, background: m.type === "Equity" ? "rgba(139,127,255,0.1)" : m.type === "Bond" ? "rgba(34,211,238,0.1)" : "rgba(16,217,160,0.1)", color: m.type === "Equity" ? C.violet : m.type === "Bond" ? C.cyan : C.mint }}>
                        {m.type}
                      </span>
                    </td>
                    <td style={{ padding: "16px 20px", fontFamily: "'DM Mono',monospace", fontSize: 12, color: C.muted }}>{m.cap}</td>
                    <td style={{ padding: "16px 20px" }}>
                      <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.violet }}>
                        Trade →
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p style={{ fontFamily: "monospace", fontSize: 11, color: C.dim, marginTop: 16, textAlign: "center" }}>
          {FINNHUB_API_KEY
            ? "Live prices via Finnhub · Treasury yields simulated."
            : "Prices are simulated for demo. Add a FINNHUB_API_KEY in config.js to enable live data."}
        </p>
      </div>

      {selected && selectedQuote && (
        <StockModal
          asset={selected}
          price={selectedQuote.price}
          prev={selectedQuote.prev ?? selectedQuote.price}
          onClose={()=>setSelected(null)}
        />
      )}
    </div>
  );
}
