# Wyvern Protocol

**Real assets. On-chain. Unchained.**

Wyvern is a Solana-native protocol for tokenizing and trading real-world securities — equities, bonds, fund interests, and RWAs — with atomic DvP settlement and compliance embedded at the token layer.

- **Sub-second settlement** via Solana (T+2 is dead)
- **MiCA-ready compliance** — KYC/AML and transfer rules embedded on-chain
- **Full proof-of-reserve** — 1:1 backing, verifiable in real time
- **DeFi composable** — tokens plug natively into Solana lending, AMMs, vaults
- **XRP identity layer** — XRPL Credentials for KYC, wXRP / RLUSD for cross-border settlement

Status: **Pre-mainnet. Building in stealth.**

---

## Getting started

```bash
git clone https://github.com/<your-org>/wyvern.git
cd wyvern
npm install
cp .env.example .env.local   # fill in VITE_FINNHUB_API_KEY
npm run dev
```

App runs at `http://localhost:5173`.

## Environment variables

All secrets live in `.env.local` (gitignored). Copy `.env.example` to `.env.local` and fill in:

| Variable | Required | Purpose |
|----------|----------|---------|
| `VITE_FINNHUB_API_KEY` | optional | Live stock-price ticker on the landing page. Get a free key at [finnhub.io](https://finnhub.io). If empty, the ticker falls back to simulated prices. |

## Project structure

```
src/
  WyvernProtocol.jsx          landing-page composition
  App.jsx                     routes
  components/
    landing/                  landing sections + shared UI
    ui/                       primitive UI components
  hooks/                      useWallet, useLivePrices, useTokenStats, …
  data/                       static landing content
  theme/                      colors
  config.js                   token + socials config (edit when launching)
pages/                        route-level screens (Markets, Docs, Contact, App)
public/                       static assets (wallet logos, demo video, poster)
```

## Launching the WYV token

When the token launches, update [`src/config.js`](src/config.js):

```js
export const TOKEN = {
  launched: true,
  ca: "<your pump.fun contract address>",
  pumpfunUrl: "https://pump.fun/coin/<ca>",
  symbol: "WYV",
  name: "Wyvern Protocol",
};
```

Live market cap and 24h volume on the stats section auto-populate from DexScreener.

## Tech

- React 19 + Vite
- Solana Web3.js + SPL Token
- Token-2022 extensions for programmable compliance
- Phantom / Solflare / Backpack wallet adapters

## License

MIT
