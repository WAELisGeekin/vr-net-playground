import { useState, useEffect, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { Glasses, Wifi, ArrowRightLeft, Shield, Users, Rocket, MessageSquare, Activity, Gauge, HelpCircle } from "lucide-react";
import ParticleBackground from "@/components/ParticleBackground";
import ThemeToggle from "@/components/ThemeToggle";
import PresentationToggle from "@/components/PresentationToggle";
import HeroSection from "@/components/HeroSection";
import SectionCard from "@/components/SectionCard";

const WhatIsVRContent = lazy(() => import("@/components/sections/WhatIsVRContent"));
const NetworkRequirementsContent = lazy(() => import("@/components/sections/NetworkRequirementsContent"));
const DataFlowContent = lazy(() => import("@/components/sections/DataFlowContent"));
const ProtocolPlaygroundContent = lazy(() => import("@/components/sections/ProtocolPlaygroundContent"));
const SecurityContent = lazy(() => import("@/components/sections/SecurityContent"));
const MultiplayerContent = lazy(() => import("@/components/sections/MultiplayerContent"));
const FutureContent = lazy(() => import("@/components/sections/FutureContent"));
const DiscussionContent = lazy(() => import("@/components/sections/DiscussionContent"));
const LatencySimulatorContent = lazy(() => import("@/components/sections/LatencySimulatorContent"));

const LazyWrap = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<div className="flex items-center justify-center py-12"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
    {children}
  </Suspense>
);

const sections = [
  { title: "VR Architecture", subtitle: "Definition, types, system components & data pipeline", icon: <Glasses className="w-8 h-8 text-neon" />, presenter: "Bousselham Mohamed Yassine", content: <LazyWrap><WhatIsVRContent /><div className="mt-12 pt-8 border-t border-border"><h3 className="font-display text-xl font-bold text-foreground mb-6">VR Data Flow</h3><DataFlowContent /></div></LazyWrap> },
  { title: "Network Performance", subtitle: "Latency, bandwidth, metrics & real-time simulation", icon: <Activity className="w-8 h-8 text-neon" />, presenter: "Belhadj Aimen Wail", content: <LazyWrap><NetworkRequirementsContent /><div className="mt-12 pt-8 border-t border-border"><h3 className="font-display text-xl font-bold text-foreground mb-6">Latency Simulator</h3><LatencySimulatorContent /></div></LazyWrap> },
 
  { title: "Protocol Playground", subtitle: "TCP vs UDP vs QUIC vs WebRTC for real-time VR", icon: <Wifi className="w-8 h-8 text-neon" />, presenter: "Boutaiba Ghoulam Allah", content: <LazyWrap><ProtocolPlaygroundContent /></LazyWrap> },
  { title: "Multiplayer Scaling", subtitle: "From 10 to 10,000 users in VR", icon: <Users className="w-8 h-8 text-neon" />, presenter: "Bousselham Mohamed Yassine", content: <LazyWrap><MultiplayerContent /></LazyWrap> },
  { title: "VR Security Zone", subtitle: "Threats, encryption, topologies & privacy", icon: <Shield className="w-8 h-8 text-neon" />, presenter: "Belhadj Aimen Wail", content: <LazyWrap><SecurityContent /></LazyWrap> },
  { title: "Future of VR Networking", subtitle: "6G, AI optimization & beyond", icon: <Rocket className="w-8 h-8 text-neon" />, presenter: "Boutaiba Ghoulam Allah", content: <LazyWrap><FutureContent /></LazyWrap> },
  { title: "Quiz", subtitle: "Test your understanding", icon: <HelpCircle className="w-8 h-8 text-neon" />, presenter: "Everyone", content: <LazyWrap><DiscussionContent /></LazyWrap> },
];

const Index = () => {
  const [isDark, setIsDark] = useState(true);
  const [isPresentation, setIsPresentation] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <div className={`min-h-screen bg-background text-foreground transition-colors duration-500 ${isPresentation ? "presentation-mode" : ""}`}>
      <ParticleBackground />

      {/* Top bar */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 glass-card border-b border-border backdrop-blur-xl"
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <span className="font-display text-xs md:text-sm font-bold text-gradient-neon tracking-wider">VR // NET</span>
        <div className="flex items-center gap-3">
          <PresentationToggle isPresentation={isPresentation} onToggle={() => setIsPresentation(!isPresentation)} />
          <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
        </div>
      </motion.nav>

      {/* Hero */}
      <HeroSection />

      {/* Section Grid */}
      <section className="relative z-10 container mx-auto px-4 pb-20">
        <motion.h2
          className="font-display text-2xl md:text-3xl font-bold text-center mb-2 text-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Explore the <span className="text-gradient-neon">Playground</span>
        </motion.h2>
        <p className="text-center text-muted-foreground text-sm mb-12 font-mono">Click any module to dive deeper</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {sections.map((section, i) => (
            <SectionCard
              key={i}
              index={i}
              title={section.title}
              subtitle={section.subtitle}
              icon={section.icon}
              presenter={section.presenter}
            >
              {section.content}
            </SectionCard>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-12 px-4">
        <div className="container mx-auto text-center space-y-3">
          <h3 className="font-display text-lg font-bold text-gradient-neon">VR & Advanced Networking</h3>
          <p className="text-sm text-muted-foreground font-mono">Advanced Networking Course • 2026</p>
          <p className="text-xs text-muted-foreground">
            Presented by Belhadj Aimen Wail, Bousselham Mohamed Yassine & Boutaiba Ghoulam Allah • Instructor: Prof. Cherifa Dad
          </p>
          <div className="flex justify-center gap-2 pt-2">
            {["React", "Framer Motion", "Tailwind"].map((tech) => (
              <span key={tech} className="text-[10px] font-mono bg-muted px-2 py-1 rounded text-muted-foreground">{tech}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
