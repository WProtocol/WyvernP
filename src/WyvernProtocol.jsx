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
import { ProtocolSection } from "./components/landing/ProtocolSection";
import { SettlementSection } from "./components/landing/SettlementSection";
import { FeaturesSection } from "./components/landing/FeaturesSection";
import { SecurityTypesSection } from "./components/landing/SecurityTypesSection";
import { StatsSection } from "./components/landing/StatsSection";
import { AccessTiersSection } from "./components/landing/AccessTiersSection";
import { RoadmapSection } from "./components/landing/RoadmapSection";
import { TrustSection } from "./components/landing/TrustSection";
import { AboutSection } from "./components/landing/AboutSection";
import { TeamSection } from "./components/landing/TeamSection";
import { CTASection } from "./components/landing/CTASection";
import { Footer } from "./components/landing/Footer";

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
      <ProtocolSection/>
      <SettlementSection/>
      <FeaturesSection/>
      <SecurityTypesSection/>
      <StatsSection/>
      <AccessTiersSection/>
      <RoadmapSection/>
      <TrustSection/>
      <AboutSection/>
      <TeamSection/>
      <CTASection/>
      <Footer/>
    </div>
  );
}
