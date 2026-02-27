import { motion } from "framer-motion";
import { Wifi, Globe, Headphones, Users } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
      {/* Animated network globe */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-[400px] h-[400px] md:w-[500px] md:h-[500px]">
          {/* Orbiting rings */}
          {[0, 60, 120].map((rotation, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border border-neon/20"
              style={{ transform: `rotateX(60deg) rotateZ(${rotation}deg)` }}
              animate={{ rotateZ: [rotation, rotation + 360] }}
              transition={{ duration: 20 + i * 5, repeat: Infinity, ease: "linear" }}
            />
          ))}

          {/* Center glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-neon/10 border border-neon/30"
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </div>

          {/* Orbiting nodes */}
          {[0, 90, 180, 270].map((angle, i) => (
            <motion.div
              key={angle}
              className="absolute top-1/2 left-1/2 w-4 h-4"
              animate={{ rotate: [angle, angle + 360] }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
              style={{ transformOrigin: "0 0" }}
            >
              <div
                className="w-3 h-3 rounded-full bg-neon neon-glow"
                style={{ transform: `translate(${80 + i * 20}px, -6px)` }}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <Headphones className="w-5 h-5 text-neon animate-pulse-neon" />
            <span className="font-mono text-xs text-muted-foreground tracking-widest uppercase">
              Advanced Networking Course • 2026
            </span>
            <Globe className="w-5 h-5 text-neon animate-pulse-neon" />
          </div>

          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-black mb-4 leading-tight">
            <span className="text-gradient-neon">Virtual Reality</span>
            <br />
            <span className="text-foreground">&</span>{" "}
            <span className="text-gradient-neon">Advanced Networking</span>
          </h1>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-body"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            How immersive systems depend on ultra-low latency networks
          </motion.p>
        </motion.div>

        {/* Animated feature pills */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {[
            { icon: <Wifi className="w-4 h-4" />, label: "< 20ms Latency" },
            { icon: <Globe className="w-4 h-4" />, label: "Edge Computing" },
            { icon: <Users className="w-4 h-4" />, label: "Multiplayer Sync" },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="glass-card neon-border px-4 py-2 rounded-full flex items-center gap-2 text-sm font-mono text-foreground"
              whileHover={{ scale: 1.05 }}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
            >
              <span className="text-neon">{item.icon}</span>
              {item.label}
            </motion.div>
          ))}
        </motion.div>

        {/* Team info */}
        <motion.div
          className="glass-card neon-border rounded-2xl p-6 md:p-8 max-w-lg mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
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

        {/* Scroll indicator */}
        <motion.div
          className="mt-12 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-xs font-mono text-muted-foreground">Scroll to explore</span>
          <div className="w-5 h-8 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-1.5">
            <motion.div
              className="w-1 h-2 rounded-full bg-neon"
              animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
