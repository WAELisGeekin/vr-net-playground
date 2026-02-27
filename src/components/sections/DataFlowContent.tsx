import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const nodes = [
  { id: "user", label: "VR User", x: 5, desc: "End user wearing VR headset. Generates input data (head position, controller state) at 90-1000Hz.", protocol: "USB/BT" },
  { id: "router", label: "Router", x: 20, desc: "Local network gateway. Must support Wi-Fi 6E or wired connection for minimal latency. QoS priority for VR traffic.", protocol: "Wi-Fi 6E" },
  { id: "isp", label: "ISP", x: 35, desc: "Internet Service Provider network. Fiber preferred for symmetric bandwidth. Latency budget: <5ms to edge.", protocol: "MPLS" },
  { id: "edge", label: "Edge Server", x: 50, desc: "Edge computing node closest to user. Handles real-time rendering offloading and content caching. Reduces round-trip by 40-60%.", protocol: "UDP/RTP" },
  { id: "cloud", label: "Cloud", x: 65, desc: "Central cloud infrastructure. Hosts game state, physics simulation, and persistent world data. Handles matchmaking.", protocol: "WebRTC" },
  { id: "engine", label: "VR Engine", x: 80, desc: "Server-side rendering engine. Generates stereoscopic frames, handles physics, spatial audio. Uses predictive algorithms.", protocol: "QUIC" },
  { id: "return", label: "Return", x: 95, desc: "Compressed video stream sent back to user. Uses H.265/AV1 encoding. Total round-trip must be <20ms.", protocol: "H.265" },
];

const DataFlowContent = () => {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const active = nodes.find(n => n.id === activeNode);

  return (
    <div className="space-y-8">
      <p className="text-muted-foreground">
        Click each node to understand the complete VR data journey from user input to rendered frame.
      </p>

      {/* Flow diagram */}
      <div className="relative py-8">
        {/* Connection line */}
        <div className="absolute top-1/2 left-[5%] right-[5%] h-0.5 bg-border -translate-y-1/2">
          <motion.div
            className="h-full bg-gradient-to-r from-neon to-neon-secondary"
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 2 }}
          />
        </div>

        {/* Data packet animation */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-neon neon-glow z-10"
          style={{ left: "5%" }}
          animate={{ left: ["5%", "95%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />

        {/* Nodes - scrollable on mobile */}
        <div className="flex justify-between items-center relative z-10 overflow-x-auto pb-4 gap-2 min-h-[120px]">
          {nodes.map((node) => (
            <motion.button
              key={node.id}
              className={`flex-shrink-0 flex flex-col items-center gap-2 cursor-pointer ${
                activeNode === node.id ? "scale-110" : ""
              }`}
              onClick={() => setActiveNode(activeNode === node.id ? null : node.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center text-xs font-mono font-bold transition-all duration-300 ${
                activeNode === node.id
                  ? "bg-primary text-primary-foreground neon-glow"
                  : "glass-card neon-border text-foreground"
              }`}>
                {node.label.slice(0, 3)}
              </div>
              <span className="text-[10px] font-mono text-muted-foreground text-center w-16">{node.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Node detail */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="glass-card neon-border p-6 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <h4 className="font-display font-bold text-foreground text-lg">{active.label}</h4>
              <span className="font-mono text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">{active.protocol}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{active.desc}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DataFlowContent;
