import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight, ExternalLink, Copy, Check, GitFork, X } from "lucide-react";
import { SOCIALS } from "../config";

const C = {
  bg:"#02020c", bg2:"#07071a", surface:"rgba(255,255,255,0.03)",
  border:"rgba(255,255,255,0.07)", borderHi:"rgba(255,255,255,0.14)",
  violet:"#8b7fff", cyan:"#22d3ee", mint:"#10d9a0",
  text:"#f0efff", muted:"rgba(240,239,255,0.55)", dim:"rgba(240,239,255,0.25)",
};

const DOCS = [
  {
    id:"intro", label:"Introduction", section:"Getting Started",
    title:"What is Wyvern Protocol?",
    content:`Wyvern Protocol is a decentralized infrastructure layer for tokenizing and trading real-world securities on the Solana blockchain.

We provide the rails for institutions, developers, and individuals to:
• Tokenize any real-world security (equities, bonds, funds, real estate)
• Trade those tokens 24/7 with sub-400ms settlement
• Compose tokenized assets natively within Solana DeFi
• Maintain full regulatory compliance through programmable compliance rules

Wyvern is currently in public testnet. Mainnet launch is scheduled for Q4 2025.`,
    code: null,
  },
  {
    id:"quickstart", label:"Quick Start", section:"Getting Started",
    title:"Quick Start",
    content:`Get up and running with Wyvern Protocol in minutes.

Prerequisites:
• A Solana wallet (Phantom recommended)
• SOL for transaction fees (~0.01 SOL is more than enough)
• Completed KYC verification

Step 1: Connect your wallet
Navigate to app.wyvernprotocol.io and click "Connect Wallet". Select Phantom and approve the connection.

Step 2: Complete KYC
First-time users must complete identity verification. This takes 2–5 minutes and is required by our compliance module.

Step 3: Browse the Marketplace
Browse available tokenized securities in the Marketplace. Each token is backed 1:1 by the underlying asset held in regulated custody.

Step 4: Place your first trade
Select an asset, enter your desired quantity, review the atomic DvP settlement terms, and confirm. Your position settles on-chain in under 400ms.`,
    code: null,
  },
  {
    id:"tokenization", label:"Tokenization", section:"Core Concepts",
    title:"How Tokenization Works",
    content:`Wyvern uses a three-layer architecture to tokenize real-world assets securely.

Layer 1: Custody
The underlying asset (e.g., Apple shares) is deposited with a regulated custodian partner. Wyvern currently works with institutional-grade custodians holding appropriate regulatory licenses.

Layer 2: Oracle Verification
Our decentralized oracle network (powered by Pyth) continuously verifies that the on-chain token supply matches the custodied assets. Proof-of-reserve is published on-chain every block.

Layer 3: Token Issuance
A Token-2022 compliant security token is minted on Solana. The token embeds:
• Compliance rules (transfer restrictions, KYC requirements)
• Dividend/coupon distribution logic
• Cap table management
• Voting rights (for equity tokens)`,
    code: `// Example: Fetch token metadata
const connection = new Connection("https://api.mainnet-beta.solana.com");
const tokenMint = new PublicKey("WYV...mint");
const tokenInfo = await getMint(connection, tokenMint);
console.log("Supply:", tokenInfo.supply.toString());`,
  },
  {
    id:"settlement", label:"Settlement Engine", section:"Core Concepts",
    title:"Atomic DvP Settlement",
    content:`Wyvern uses atomic Delivery vs Payment (DvP) settlement — the gold standard for eliminating counterparty risk in securities trading.

What is DvP?
In traditional markets, the delivery of securities and the payment of funds happen at different times (T+2), creating a window of counterparty risk. If one party defaults, the other is exposed.

Wyvern's atomic DvP executes both legs of a trade simultaneously in a single Solana transaction. Either both legs succeed, or neither does — counterparty risk is eliminated entirely.

Settlement Stats:
• Average finality: 382ms
• Average fee: <$0.001
• Failed settlements: 0 (atomic guarantee)
• Uptime: 99.99% (inherited from Solana)`,
    code: `// Settlement happens atomically — no separate confirm step
const tx = await wyvernClient.trade({
  buy:  { token: "AAPL_WYV", amount: 10 },
  pay:  { token: "USDC",     amount: 2143.00 },
  mode: "atomic-dvp",
});
// tx.signature proves atomic settlement on-chain
console.log("Settled:", tx.signature);`,
  },
  {
    id:"compliance", label:"Compliance", section:"Core Concepts",
    title:"Programmable Compliance",
    content:`Wyvern embeds compliance rules directly at the token layer using Solana's Token-2022 standard and custom transfer hooks.

Supported Compliance Frameworks:
• MiCA (EU) — Markets in Crypto-Assets regulation
• RegD — US accredited investor exemption
• RegA+ — US Regulation A+ offering
• RegS — Offshore US securities exemption
• RegCF — US crowdfunding regulation
• FATF Travel Rule — Cross-border transaction reporting

How it works:
Every token transfer is intercepted by Wyvern's compliance hook, which checks:
1. KYC/AML status of sender and receiver
2. Transfer restriction rules (lock-ups, accreditation)
3. Geographic restrictions
4. FATF travel rule requirements

If any check fails, the transaction reverts — no partial settlement, no compliance breach.`,
    code: null,
  },
  {
    id:"defi", label:"DeFi Integration", section:"Developers",
    title:"DeFi Composability",
    content:`Wyvern tokens are standard Token-2022 SPL tokens. Any Solana DeFi protocol that supports Token-2022 can integrate natively.

Supported Use Cases:
• Collateral — Use tokenized AAPL as collateral in lending protocols
• Liquidity — Provide tokenized securities in AMM pools
• Staking — Stake WYV governance token to earn yield
• Yield strategies — Auto-compound dividend income in DeFi vaults

Developer Notes:
Wyvern tokens include a transfer hook for compliance checks. Protocols integrating Wyvern tokens must call the compliance hook on every transfer. See our SDK for details.`,
    code: `import { WyvernClient } from "@wyvern-protocol/sdk";

const client = new WyvernClient({
  network: "mainnet-beta",
  wallet: phantomWallet,
});

// Use tokenized AAPL as collateral
const position = await client.collateral.deposit({
  token: "AAPL_WYV",
  amount: 10,
  protocol: "marginfi",
});`,
  },
  {
    id:"sdk", label:"SDK Reference", section:"Developers",
    title:"SDK Reference",
    content:`The Wyvern SDK is a TypeScript-first library for building on top of Wyvern Protocol.

Installation:`,
    code: `npm install @wyvern-protocol/sdk

# or with yarn
yarn add @wyvern-protocol/sdk`,
  },
  {
    id:"security", label:"Security", section:"Protocol",
    title:"Security & Audits",
    content:`Wyvern Protocol takes security seriously. Our smart contracts have undergone multiple independent audits.

Audit Reports:
• OtterSec — Core settlement engine (Q2 2025) — 0 critical, 0 high
• Halborn — Compliance hook module (Q2 2025) — 0 critical, 1 medium (fixed)
• Neodyme — Token issuance contracts (Q3 2025) — In progress

Bug Bounty:
We run an ongoing bug bounty program. Critical vulnerabilities pay up to $250,000 USDC.

Responsible Disclosure:
security@wyvernprotocol.io

What we don't cover:
• Third-party custodian risk
• Oracle price manipulation (mitigated by multi-oracle design)
• Social engineering attacks`,
    code: null,
  },
];

const SECTIONS = [...new Set(DOCS.map(d => d.section))];

function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }
  return (
    <div style={{ position: "relative", marginTop: 20, marginBottom: 20 }}>
      <button onClick={copy} style={{ position: "absolute", top: 12, right: 12, background: "rgba(255,255,255,0.06)", border: `1px solid ${C.border}`, borderRadius: 6, padding: "4px 10px", cursor: "pointer", color: C.dim, display: "flex", alignItems: "center", gap: 5, fontFamily: "monospace", fontSize: 11 }}>
        {copied ? <><Check size={11} color={C.mint}/> Copied</> : <><Copy size={11}/> Copy</>}
      </button>
      <pre style={{ background: "#0a0a18", border: `1px solid ${C.border}`, borderRadius: 10, padding: "20px 24px", overflowX: "auto", fontFamily: "'DM Mono',monospace", fontSize: 12, lineHeight: 1.7, color: "#c9d1d9", margin: 0 }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function DocsPage() {
  const navigate = useNavigate();
  const [active, setActive] = useState("intro");
  const doc = DOCS.find(d => d.id === active);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:${C.bg};}::-webkit-scrollbar-thumb{background:rgba(139,127,255,.3);border-radius:2px;}
        .doc-link{display:block;padding:7px 14px;borderRadius:6px;cursor:pointer;border:none;background:transparent;text-align:left;width:100%;font-family:'DM Sans',sans-serif;font-size:13px;transition:all .15s;color:${C.muted};}
        .doc-link:hover{color:${C.text};background:rgba(255,255,255,0.03);}
        .doc-link.active{color:${C.violet};background:rgba(139,127,255,0.08);}
      `}</style>

      {/* sidebar */}
      <aside style={{ width: 260, borderRight: `1px solid ${C.border}`, padding: "24px 16px", position: "sticky", top: 0, height: "100vh", overflowY: "auto", flexShrink: 0, background: C.bg2 }}>
        <button onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: 8, background: "transparent", border: "none", color: C.muted, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 13, marginBottom: 24, padding: "4px 0" }}>
          <ArrowLeft size={14} /> Wyvern Home
        </button>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 24, paddingLeft: 14 }}>Documentation</div>
        {SECTIONS.map(sec => (
          <div key={sec} style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: C.dim, padding: "0 14px", marginBottom: 6 }}>{sec}</div>
            {DOCS.filter(d => d.section === sec).map(d => (
              <button key={d.id} onClick={() => setActive(d.id)} className={`doc-link${active === d.id ? " active" : ""}`}>
                {d.label}
              </button>
            ))}
          </div>
        ))}
        <div style={{ marginTop: 32, paddingTop: 20, borderTop: `1px solid ${C.border}` }}>
          <a href={SOCIALS.github} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 14px", borderRadius: 6, color: C.muted, textDecoration: "none", fontFamily: "'DM Sans',sans-serif", fontSize: 13, transition: "color .15s" }}
            onMouseEnter={e => e.currentTarget.style.color = C.text}
            onMouseLeave={e => e.currentTarget.style.color = C.muted}>
            <GitFork size={14} /> GitHub
          </a>
          <a href={SOCIALS.twitter} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 14px", borderRadius: 6, color: C.muted, textDecoration: "none", fontFamily: "'DM Sans',sans-serif", fontSize: 13, transition: "color .15s" }}
            onMouseEnter={e => e.currentTarget.style.color = C.text}
            onMouseLeave={e => e.currentTarget.style.color = C.muted}>
            <X size={14} /> Twitter / X
          </a>
        </div>
      </aside>

      {/* content */}
      <main style={{ flex: 1, padding: "60px 80px", maxWidth: 860, overflowY: "auto" }}>
        {/* breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "monospace", fontSize: 11, color: C.dim, marginBottom: 32 }}>
          <span>Docs</span><ChevronRight size={12}/><span>{doc?.section}</span><ChevronRight size={12}/><span style={{ color: C.muted }}>{doc?.label}</span>
        </div>

        <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", color: C.text, marginBottom: 32, lineHeight: 1.1 }}>
          {doc?.title}
        </h1>

        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, lineHeight: 1.9, color: C.muted }}>
          {doc?.content.split("\n").map((line, i) => {
            if (line.startsWith("•")) return <p key={i} style={{ paddingLeft: 20, marginBottom: 8, color: C.muted }}>{line}</p>;
            if (line === "") return <div key={i} style={{ height: 16 }} />;
            if (line.match(/^[A-Z][^a-z]*:$/) || line.match(/^(Step \d+:|Layer \d+:|What is|How it works|Supported|Developer Notes|Audit Reports|Bug Bounty|What we don't|Installation:)/)) {
              return <p key={i} style={{ fontFamily: "'Syne',sans-serif", fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 8, marginTop: 4 }}>{line}</p>;
            }
            return <p key={i} style={{ marginBottom: 4 }}>{line}</p>;
          })}
        </div>

        {doc?.code && <CodeBlock code={doc.code} />}

        {/* nav between docs */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 56, paddingTop: 32, borderTop: `1px solid ${C.border}` }}>
          {(() => {
            const idx = DOCS.findIndex(d => d.id === active);
            const prev = DOCS[idx - 1], next = DOCS[idx + 1];
            return (
              <>
                {prev ? (
                  <button onClick={() => setActive(prev.id)} style={{ display: "flex", alignItems: "center", gap: 8, background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 18px", cursor: "pointer", color: C.muted, fontFamily: "'DM Sans',sans-serif", fontSize: 13, transition: "all .2s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderHi; e.currentTarget.style.color = C.text; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}>
                    ← {prev.label}
                  </button>
                ) : <div />}
                {next && (
                  <button onClick={() => setActive(next.id)} style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(139,127,255,0.08)", border: "1px solid rgba(139,127,255,0.2)", borderRadius: 8, padding: "10px 18px", cursor: "pointer", color: C.violet, fontFamily: "'DM Sans',sans-serif", fontSize: 13, transition: "all .2s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(139,127,255,0.15)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(139,127,255,0.08)"; }}>
                    {next.label} →
                  </button>
                )}
              </>
            );
          })()}
        </div>
      </main>
    </div>
  );
}
