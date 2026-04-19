import { useState } from "react";
import { C } from "./theme/colors";
import { useLivePrices } from "./hooks/useLivePrices";
import { GlobalStyles } from "./components/landing/GlobalStyles";
import { ScrollProgress } from "./components/landing/ScrollProgress";
import { Orbs } from "./components/landing/Orbs";
import { Nav } from "./components/landing/Nav";
import { WalletModal } from "./components/landing/WalletModal";
import { WatchDemoModal } from "./components/landing/WatchDemoModal";
import { HeroSection } from "./components/landing/HeroSection";
import { TickerBar } from "./components/landing/TickerBar";
import { LoreSection } from "./components/landing/LoreSection";
import { TokenomicsSection } from "./components/landing/TokenomicsSection";
import { CommunitySection } from "./components/landing/CommunitySection";
import { StatsSection } from "./components/landing/StatsSection";
import { AboutSection } from "./components/landing/AboutSection";
import { CTASection } from "./components/landing/CTASection";
import { Footer } from "./components/landing/Footer";
import { PullQuote } from "./components/landing/shared";

export default function WyvernProtocol() {
  const [walletOpen, setWalletOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const prices = useLivePrices();
  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "100vh", position: "relative" }}>
      <GlobalStyles/>
      <ScrollProgress/>
      <Orbs/>
      <Nav onSignIn={() => setWalletOpen(true)}/>
      {walletOpen && <WalletModal onClose={() => setWalletOpen(false)}/>}
      {demoOpen && <WatchDemoModal onClose={() => setDemoOpen(false)}/>}
      <HeroSection prices={prices} onWatchDemo={() => setDemoOpen(true)}/>
      <TickerBar prices={prices}/>
      <LoreSection/>
      <PullQuote attribution="The dragon awakens">
        T+2 is theft. Banks are slow. <em>Finance</em> belongs to the dragons.
      </PullQuote>
      <TokenomicsSection/>
      <StatsSection/>
      <CommunitySection/>
      <AboutSection/>
      <CTASection/>
      <Footer/>
    </div>
  );
}
