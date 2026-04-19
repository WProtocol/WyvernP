import {
  Shield, Zap, Globe, TrendingUp, Lock, Layers, Link2,
  Building2, Banknote, Briefcase, Scale,
  Eye, UserCheck, Crown,
} from "lucide-react";

export const BASE_PRICES = {
  AAPL: 207.99, MSFT: 378.80, TSLA: 241.37, NVDA: 109.02,
  "US10Y": 4.33, AMZN: 186.40, GOOGL: 159.62, BTC: 84000, SPY: 537.50,
};

export const FEATURES = [
  { num: "01", icon: <Zap size={16}/>, title: "Sub-second settlement", desc: "Solana settles every trade in under 400ms. T+2 is dead. Forget counterparty risk and clearing delays.", stat: "0.4s", statLabel: "avg finality", bars: [{ label: "Wyvern", pct: 98, val: "0.4s", hi: true }, { label: "NASDAQ", pct: 14, val: "T+1", hi: false }, { label: "NYSE", pct: 9, val: "T+2", hi: false }, { label: "LSE", pct: 7, val: "T+2", hi: false }] },
  { num: "02", icon: <Shield size={16}/>, title: "Compliance-native", desc: "Built-in KYC/AML, MiCA-ready architecture, and programmable compliance rules embedded at the token layer.", stat: "MiCA", statLabel: "ready", bars: [{ label: "KYC/AML", pct: 100, val: "✓", hi: true }, { label: "MiCA", pct: 100, val: "✓", hi: true }, { label: "FATF", pct: 90, val: "90%", hi: false }, { label: "SEC", pct: 70, val: "70%", hi: false }] },
  { num: "03", icon: <Lock size={16}/>, title: "Full proof-of-reserve", desc: "Every tokenized asset is backed 1:1 and auditable on-chain in real time. No trust required.", stat: "1:1", statLabel: "backing", bars: [{ label: "Backing", pct: 100, val: "100%", hi: true }, { label: "Audited", pct: 100, val: "✓", hi: true }, { label: "On-chain", pct: 100, val: "✓", hi: false }, { label: "Insurance", pct: 80, val: "80%", hi: false }] },
  { num: "04", icon: <Layers size={16}/>, title: "DeFi composable", desc: "WYV tokens plug natively into Solana DeFi — use tokenized Apple stock as collateral, in LPs, anywhere.", stat: "Open", statLabel: "protocol", bars: [{ label: "Collateral", pct: 95, val: "✓", hi: true }, { label: "AMM LPs", pct: 90, val: "✓", hi: false }, { label: "Lending", pct: 85, val: "85%", hi: false }, { label: "Staking", pct: 100, val: "✓", hi: true }] },
  { num: "05", icon: <Globe size={16}/>, title: "Global access", desc: "Anyone with a wallet can access any market. No broker account, no minimum deposit, no geography restrictions.", stat: "180+", statLabel: "countries", bars: [{ label: "Countries", pct: 90, val: "180+", hi: true }, { label: "Languages", pct: 70, val: "24", hi: false }, { label: "Currencies", pct: 80, val: "40+", hi: true }, { label: "Assets", pct: 60, val: "500+", hi: false }] },
  { num: "06", icon: <Link2 size={16}/>, title: "XRP identity layer", desc: "XRPL Credentials for battle-tested KYC. wXRP and RLUSD for cross-border stablecoin settlement. Two decades of proven infrastructure, plugged into tokenized securities on Solana.", stat: "20yr", statLabel: "proven infra", bars: [{ label: "XRPL Creds", pct: 100, val: "✓", hi: true }, { label: "wXRP", pct: 100, val: "Live", hi: true }, { label: "RLUSD", pct: 80, val: "Q3", hi: false }, { label: "On-chain ID", pct: 90, val: "✓", hi: true }] },
];

/* Stats shown pre-launch.
   When TOKEN.launched and TOKEN.ca are set in config.js, `useTokenStats`
   overrides `marketCap` and `volume24h` slots with live DexScreener data. */
export const STATS = [
  { key: "marketCap", num: 0,     suffix: "",  prefix: "$", label: "Market cap",      sub: "Live after launch",        color: "#8b7fff" },
  { key: "settle",   num: 0.4,   suffix: "s", prefix: "",  label: "Settlement time", sub: "Avg. Solana finality",     color: "#22d3ee" },
  { key: "volume",   num: 0,     suffix: "",  prefix: "$", label: "24h volume",      sub: "Live after launch",        color: "#10d9a0" },
  { key: "fee",      num: 0.001, suffix: "",  prefix: "$", label: "Avg. trade fee",  sub: "Near-zero, always",         color: "#8b7fff" },
];

export const STEPS = [
  { n: "01", icon: <TrendingUp size={20}/>, title: "Submit your asset",  em: "asset",     body: "Connect any real-world security — equities, bonds, funds, real estate. Wyvern's custody layer wraps it for on-chain issuance." },
  { n: "02", icon: <Shield size={20}/>,     title: "Verify on-chain",    em: "on-chain",  body: "Our decentralized oracle network verifies 1:1 backing. Every token is auditable in real time — transparency baked in." },
  { n: "03", icon: <Zap size={20}/>,        title: "Trade instantly",    em: "instantly", body: "Markets open 24/7. No closing bells, no broker intermediaries. Solana settles every trade in under 400ms." },
  { n: "04", icon: <Globe size={20}/>,      title: "Earn real yield",    em: "real yield",body: "Dividends and coupon payments stream automatically to your wallet. Real yield from real assets — no forms, no waiting." },
];

export const QUOTES = [
  { quote: "Settlement speed is what it says on the tin. Clean Token-2022 implementation. We're running a pilot bond issuance on the testnet now.", author: "Mikael Lindqvist", role: "Quant · Tagg Capital", stars: 5 },
  { quote: "The <b>KYC-oracle approach</b> fits how small funds actually work — regulated without being painful. Testing their compliance flow on a pilot issuance.", author: "Noor Rashid", role: "Compliance Lead · Vestra Partners", stars: 5 },
  { quote: "Plugged a Wyvern token into our lending vault in under a day. That's the bar for TradFi-on-chain composability.", author: "Takuma Watanabe", role: "Protocol Dev · Emberlane Finance", stars: 5 },
];

export const SECURITY_TYPES = [
  { Icon: Building2,  title: "Public Equities",   desc: "Tokenized shares in listed companies — Apple, Microsoft, Nvidia and more. Programmable dividends, on-chain cap tables and 24/7 price discovery.", tags: ["REG D", "REG A+"], accent: false },
  { Icon: Banknote,   title: "Fixed Income",      desc: "Treasury bonds, corporate debt and yield-bearing instruments. Coupons stream straight to your wallet via Token-2022's interest-bearing extension.", tags: ["REG D", "REG S"],  accent: true  },
  { Icon: Briefcase,  title: "Private Funds",     desc: "Tokenized LP interests and structured products. NAV backed by Pyth oracles, programmatic redemption windows and compliant secondary liquidity.", tags: ["REG D", "REG CF"], accent: false },
  { Icon: Scale,      title: "Real-World Rights", desc: "Ricardian LLC memberships and off-chain legal claims hashed to Arweave. Every token carries an immutable, enforceable legal document.", tags: ["RICARDIAN"],      accent: false },
];

export const TIERS = [
  { Icon: Eye,       name: "Observer",  price: "Free",       tagline: "Read-only access to the protocol.",
    features: ["Live market data", "On-chain explorer access", "Real-time settlement feed", "Protocol documentation"],
    cta: "Start exploring", highlighted: false },
  { Icon: UserCheck, name: "Investor",  price: "KYC required", tagline: "Buy, hold and trade tokenized securities.",
    features: ["All Observer features", "Full marketplace access", "Dividend & coupon streams", "DeFi collateral & lending", "Portfolio analytics"],
    cta: "Begin KYC", highlighted: true },
  { Icon: Crown,     name: "Issuer",    price: "Enterprise", tagline: "Tokenize and distribute your own securities.",
    features: ["All Investor features", "Issuance toolkit", "Compliance rule engine", "Custodial integrations", "Dedicated solutions team"],
    cta: "Talk to sales", highlighted: false },
];

export const ROADMAP = [
  { q: "Q1 2026", title: "Foundation",     status: "done",     items: ["Protocol architecture finalized", "Smart contract audit v1", "Testnet launch on Solana Devnet", "Core team assembled"] },
  { q: "Q2 2026", title: "Private Beta",   status: "done",     items: ["KYC/AML module deployed", "First tokenized equity on testnet", "Institutional partner onboarding", "MiCA compliance review"] },
  { q: "Q3 2026", title: "Public Testnet", status: "active",   items: ["Public testnet open to all", "DeFi composability (collateral, LP)", "Pyth oracle integration", "Community governance v1"] },
  { q: "Q4 2026", title: "Mainnet Launch", status: "upcoming", items: ["Solana mainnet deployment", "First live tokenized securities", "Exchange integrations", "WYV token launch"] },
  { q: "Q1 2027", title: "Scale",          status: "upcoming", items: ["180+ country access", "Real estate & fund tokenization", "Institutional custody partnerships", "Cross-chain bridges"] },
];

export const TEAM = [
  { initials: "—", name: "Founder & CEO", role: "Founder & CEO",
    bio: "Serial fintech builder. Saw T+2 settlement break a deal in 2023 and decided to fix it. Wyvern is the result.",
    tags: ["Protocol design", "Tokenization", "Business strategy"], accent: "#8b7fff", anon: true },
  { initials: "—", name: "CTO", role: "Chief Technology Officer",
    bio: "Solana core contributor. Previously led smart contract engineering at a top-10 DeFi protocol.",
    tags: ["Solana", "Rust", "ZK proofs"], accent: "#22d3ee", anon: true },
  { initials: "—", name: "Head of Compliance", role: "Compliance & Legal",
    bio: "10 years in securities law. Architected MiCA frameworks for two European asset managers.",
    tags: ["MiCA", "RegD", "KYC/AML"], accent: "#10d9a0", anon: true },
  { initials: "—", name: "Head of DeFi", role: "DeFi & Integrations",
    bio: "Built liquidity layers across Solana and Ethereum. Obsessed with composable finance primitives.",
    tags: ["DeFi", "Liquidity", "Cross-chain"], accent: "#f59e0b", anon: true },
];
