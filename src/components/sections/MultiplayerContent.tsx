import { useState } from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";

const scales = [
  { users: 10, bandwidth: 5, label: "Small Room", desc: "Local P2P mesh network. Each user sends to all others. Bandwidth scales O(n²). Feasible for <10 users." },
  { users: 100, bandwidth: 45, label: "Event", desc: "Client-server architecture required. Dedicated game server handles state synchronization. Interest management reduces unnecessary data." },
  { users: 10000, bandwidth: 95, label: "Metaverse", desc: "Distributed server mesh with spatial partitioning. Edge computing nodes handle regional clusters. Cloud load balancing across multiple data centers." },
];

const MultiplayerContent = () => {
  const [activeScale, setActiveScale] = useState(0);
  const current = scales[activeScale];

  return (
    <div className="space-y-8">
      <p className="text-muted-foreground">
        Multiplayer VR presents extreme scaling challenges. Explore how network architecture changes with user count.
      </p>

      {/* Scale selector */}
      <div className="flex gap-3 flex-wrap">
        {scales.map((scale, i) => (
          <motion.button
            key={i}
            className={`glass-card px-5 py-3 rounded-xl font-mono text-sm transition-all duration-300 ${
              activeScale === i ? "neon-border neon-glow bg-primary/10 text-foreground" : "border border-border text-muted-foreground"
            }`}
            onClick={() => setActiveScale(i)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Users className="w-4 h-4 inline mr-2" />
            {scale.users.toLocaleString()} users
          </motion.button>
        ))}
      </div>

      {/* Bandwidth visualization */}
      <div className="glass-card neon-border p-6 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-display font-bold text-foreground">{current.label}</h4>
          <span className="font-mono text-sm text-neon">{current.users.toLocaleString()} concurrent</span>
        </div>

        {/* Dynamic user grid */}
        <div className="relative h-32 bg-muted rounded-lg overflow-hidden mb-4 flex items-center justify-center">
          <div className="flex flex-wrap justify-center gap-1 p-4 max-w-full">
            {Array.from({ length: Math.min(current.users, 50) }).map((_, i) => (
              <motion.div
                key={i}
                className="w-3 h-3 rounded-full bg-neon/70"
                initial={{ scale: 0 }}
                animate={{ scale: 1, opacity: [0.4, 0.8, 0.4] }}
                transition={{ delay: i * 0.02, duration: 2, repeat: Infinity, repeatDelay: Math.random() * 2 }}
              />
            ))}
            {current.users > 50 && (
              <span className="text-xs font-mono text-muted-foreground ml-2 self-center">+{(current.users - 50).toLocaleString()}</span>
            )}
          </div>
        </div>

        {/* Bandwidth bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs font-mono text-muted-foreground mb-1">
            <span>Network Load</span>
            <span>{current.bandwidth}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${current.bandwidth > 80 ? "bg-gradient-to-r from-red-500 to-orange-500" : "bg-gradient-to-r from-neon to-neon-secondary"}`}
              animate={{ width: `${current.bandwidth}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>

        <p className="text-sm text-muted-foreground">{current.desc}</p>

        {/* Key concepts */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          {["Edge Computing", "5G / Wi-Fi 6E", "Load Balancing", "Spatial Partitioning"].map((concept) => (
            <div key={concept} className="bg-muted/50 rounded-lg px-3 py-2 text-xs font-mono text-muted-foreground">
              {concept}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MultiplayerContent;
