import { useState } from "react";
import { motion } from "framer-motion";

const timeline = [
  { year: "2024", label: "Wi-Fi 6E & 5G", desc: "Sub-10ms wireless latency enables untethered VR. 5G mmWave provides 1Gbps+ for mobile VR." },
  { year: "2026", label: "AI Traffic Optimization", desc: "Neural networks predict user movement and pre-render frames. Adaptive bitrate based on network conditions." },
  { year: "2028", label: "Haptic Networks", desc: "Tactile internet with <1ms latency for force-feedback. New protocols for encoding touch sensations over networks." },
  { year: "2030", label: "6G Networks", desc: "Terahertz frequencies, 1Tbps speeds, sub-microsecond latency. Holographic communication becomes feasible." },
  { year: "2035", label: "Metaverse Infra", desc: "Persistent, interconnected virtual worlds. Decentralized compute mesh. Neural interfaces reduce bandwidth needs." },
];

const FutureContent = () => {
  const [activeYear, setActiveYear] = useState(0);

  return (
    <div className="space-y-8">
      <p className="text-muted-foreground">
        The future of VR networking will be defined by breakthroughs in wireless technology, AI, and new network paradigms.
      </p>

      {/* Timeline slider */}
      <div className="relative">
        <div className="flex justify-between items-center mb-2">
          {timeline.map((item, i) => (
            <motion.button
              key={i}
              className={`relative z-10 flex flex-col items-center gap-1 cursor-pointer ${
                activeYear === i ? "text-foreground" : "text-muted-foreground"
              }`}
              onClick={() => setActiveYear(i)}
              whileHover={{ scale: 1.1 }}
            >
              <div className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                activeYear === i
                  ? "bg-neon border-neon neon-glow scale-125"
                  : i < activeYear ? "bg-neon/50 border-neon/50" : "border-border bg-muted"
              }`} />
              <span className="text-[10px] md:text-xs font-mono">{item.year}</span>
            </motion.button>
          ))}
        </div>

        {/* Progress bar */}
        <div className="absolute top-2 left-0 right-0 h-0.5 bg-border -z-0">
          <motion.div
            className="h-full bg-gradient-to-r from-neon to-neon-secondary"
            animate={{ width: `${(activeYear / (timeline.length - 1)) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Active content */}
      <motion.div
        key={activeYear}
        className="glass-card neon-border p-6 rounded-xl"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h4 className="font-display text-lg font-bold text-gradient-neon mb-2">
          {timeline[activeYear].label}
        </h4>
        <p className="text-sm text-muted-foreground leading-relaxed">{timeline[activeYear].desc}</p>
      </motion.div>

      {/* Key future tech */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "6G Networks", stat: "1 Tbps" },
          { label: "AI Optimization", stat: "50% less bandwidth" },
          { label: "Haptic Feedback", stat: "<1ms latency" },
          { label: "Neural Interface", stat: "Direct brain link" },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            className="glass-card neon-border p-4 rounded-xl text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="font-display text-sm font-bold text-foreground mb-1">{item.label}</div>
            <div className="font-mono text-xs text-neon">{item.stat}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FutureContent;
