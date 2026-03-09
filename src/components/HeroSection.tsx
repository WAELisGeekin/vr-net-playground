import { motion } from "framer-motion";
import { Wifi, Globe, Headphones, Users } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <Headphones className="w-5 h-5 text-neon" />
            <span className="font-mono text-xs text-muted-foreground tracking-widest uppercase">
              Advanced Networking Course • 2026
            </span>
            <Globe className="w-5 h-5 text-neon" />
          </div>

          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-black mb-4 leading-tight">
            <span className="text-gradient-neon">Virtual Reality</span>
            <br />
            <span className="text-foreground">&</span>{" "}
            <span className="text-gradient-neon">Advanced Networking</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-body">
            How immersive systems depend on ultra-low latency networks
          </p>
        </motion.div>

        {/* Feature pills - static, no infinite animations */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {[
            { icon: <Wifi className="w-4 h-4" />, label: "< 20ms Latency" },
            { icon: <Globe className="w-4 h-4" />, label: "Edge Computing" },
            { icon: <Users className="w-4 h-4" />, label: "Multiplayer Sync" },
          ].map((item, i) => (
            <div
              key={i}
              className="glass-card neon-border px-4 py-2 rounded-full flex items-center gap-2 text-sm font-mono text-foreground"
            >
              <span className="text-neon">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </motion.div>

        {/* Team info */}
        <motion.div
          className="glass-card neon-border rounded-2xl p-6 md:p-8 max-w-lg mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="font-display text-sm tracking-widest text-neon uppercase mb-4">Team</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {["Member 1", "Member 2", "Member 3", "Member 4"].map((name, i) => (
              <div key={i} className="bg-muted/50 rounded-lg px-3 py-2 font-mono text-muted-foreground">
                {name}
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-border flex flex-col sm:flex-row justify-between text-xs font-mono text-muted-foreground gap-2">
            <span>Instructor: <span className="text-foreground">Prof. [Name]</span></span>
            <span>Course: <span className="text-foreground">Advanced Networking</span></span>
          </div>
        </motion.div>

        {/* Scroll indicator - simple CSS animation */}
        <div className="mt-12 flex flex-col items-center gap-2 animate-bounce" style={{ animationDuration: '2s' }}>
          <span className="text-xs font-mono text-muted-foreground">Scroll to explore</span>
          <div className="w-5 h-8 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-neon animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
