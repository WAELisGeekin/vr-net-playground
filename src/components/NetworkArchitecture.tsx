import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, Server, Cpu, Shield, Radio, MonitorSmartphone, Cloud, ArrowRight } from "lucide-react";

interface NetworkNode {
  id: string;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
  color: string;
  protocol: string;
  desc: string;
  x: number; // percentage
}

const networkNodes: NetworkNode[] = [
  {
    id: "headset", label: "VR Headset", shortLabel: "HMD",
    icon: <MonitorSmartphone className="w-5 h-5" />, color: "#a855f7",
    protocol: "USB/BLE 5.3", x: 5,
    desc: "Captures IMU sensor data at 1000Hz and streams it upstream as 64-byte UDP packets. Receives decoded stereo video frames at 90fps for each eye.",
  },
  {
    id: "wifi", label: "Wi-Fi 6E AP", shortLabel: "AP",
    icon: <Wifi className="w-5 h-5" />, color: "#3b82f6",
    protocol: "802.11ax 6GHz", x: 22,
    desc: "Access point on 6GHz band provides <2ms air-interface latency. Uses OFDMA for simultaneous upstream sensor + downstream video. MU-MIMO supports multiple headsets.",
  },
  {
    id: "router", label: "Edge Router", shortLabel: "RTR",
    icon: <ArrowRight className="w-5 h-5" />, color: "#06b6d4",
    protocol: "MPLS / QoS", x: 39,
    desc: "Applies DSCP EF marking to VR traffic for priority routing. Manages traffic shaping to guarantee <5ms hop latency. Implements ECN for congestion signaling.",
  },
  {
    id: "firewall", label: "Security Layer", shortLabel: "FW",
    icon: <Shield className="w-5 h-5" />, color: "#10b981",
    protocol: "DTLS 1.3", x: 56,
    desc: "DTLS 1.3 encryption for all VR data in transit. Stateless packet filtering at line rate. DPI exemption for VR traffic class to avoid latency penalty.",
  },
  {
    id: "edge", label: "Edge Server", shortLabel: "EDGE",
    icon: <Server className="w-5 h-5" />, color: "#f59e0b",
    protocol: "WebRTC / QUIC", x: 73,
    desc: "GPU-equipped edge node <10ms away. Renders stereo frames, compresses via H.265/AV1, streams over WebRTC data channels. Runs predictive head-pose estimation.",
  },
  {
    id: "cloud", label: "Cloud Backend", shortLabel: "CLOUD",
    icon: <Cloud className="w-5 h-5" />, color: "#ef4444",
    protocol: "gRPC / HTTP/3", x: 90,
    desc: "Central infrastructure for matchmaking, persistent world state, and user profiles. Not latency-critical. Syncs game state via gRPC streams to edge servers.",
  },
];

// Packet types that flow between nodes
const packetTypes = [
  { label: "Sensor Data", color: "#a855f7", direction: "upstream" as const, size: "64B", rate: "1000Hz" },
  { label: "Video Frame", color: "#3b82f6", direction: "downstream" as const, size: "~2MB", rate: "90fps" },
  { label: "Game State", color: "#10b981", direction: "downstream" as const, size: "~1KB", rate: "60Hz" },
];

const NetworkArchitecture = () => {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [showPackets, setShowPackets] = useState(true);

  const active = networkNodes.find((n) => n.id === activeNode);

  return (
    <div className="space-y-6">
      {/* Packet Legend */}
      <div className="flex flex-wrap items-center gap-4">
        <span className="text-xs font-mono text-muted-foreground">Live packets:</span>
        {packetTypes.map((p) => (
          <div key={p.label} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color, boxShadow: `0 0 8px ${p.color}60` }} />
            <span className="text-xs font-mono text-muted-foreground">
              {p.label} <span className="text-foreground">({p.size} @ {p.rate})</span>
            </span>
          </div>
        ))}
      </div>

      {/* Network Topology Diagram */}
      <div className="relative glass-card neon-border rounded-xl p-6 overflow-hidden" style={{ minHeight: 220 }}>
        {/* Background grid */}
        <div className="absolute inset-0 particle-grid opacity-30" />

        {/* Connection backbone line */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
          {/* Main backbone */}
          <line x1="8%" y1="50%" x2="93%" y2="50%" stroke="hsl(270 20% 25%)" strokeWidth="2" strokeDasharray="6 4" />
          {/* Animated glow line */}
          <motion.line
            x1="8%" y1="50%" x2="93%" y2="50%"
            stroke="url(#neonGrad)" strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="neonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>

          {/* Protocol labels on links */}
          {networkNodes.slice(0, -1).map((node, i) => {
            const next = networkNodes[i + 1];
            const midX = (node.x + next.x) / 2;
            return (
              <text
                key={`proto-${node.id}`}
                x={`${midX}%`}
                y="42%"
                textAnchor="middle"
                className="fill-muted-foreground"
                style={{ fontSize: 9, fontFamily: "var(--font-mono)" }}
              >
                {next.protocol}
              </text>
            );
          })}
        </svg>

        {/* Animated packets */}
        {showPackets && packetTypes.map((packet, pi) => (
          <motion.div
            key={packet.label}
            className="absolute rounded-full z-10 pointer-events-none"
            style={{
              width: 10, height: 10,
              backgroundColor: packet.color,
              boxShadow: `0 0 12px ${packet.color}, 0 0 24px ${packet.color}40`,
              top: `calc(50% - 5px + ${(pi - 1) * 8}px)`,
            }}
            animate={
              packet.direction === "upstream"
                ? { left: ["8%", "93%"] }
                : { left: ["93%", "8%"] }
            }
            transition={{
              duration: 2.5 + pi * 0.5,
              repeat: Infinity,
              ease: "linear",
              delay: pi * 0.8,
            }}
          />
        ))}

        {/* Nodes */}
        <div className="relative z-20 flex justify-between items-center" style={{ minHeight: 160 }}>
          {networkNodes.map((node, i) => (
            <motion.button
              key={node.id}
              className="flex flex-col items-center gap-2 group"
              style={{ width: `${100 / networkNodes.length}%` }}
              onClick={() => setActiveNode(activeNode === node.id ? null : node.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {/* Node circle */}
              <div
                className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center transition-all duration-300 border-2 ${
                  activeNode === node.id ? "scale-110" : ""
                }`}
                style={{
                  borderColor: activeNode === node.id ? node.color : "hsl(var(--border))",
                  backgroundColor: activeNode === node.id ? `${node.color}20` : "hsl(var(--card))",
                  boxShadow: activeNode === node.id ? `0 0 20px ${node.color}40, 0 0 40px ${node.color}15` : "none",
                  color: node.color,
                }}
              >
                {node.icon}
              </div>
              {/* Label */}
              <span className="text-[10px] md:text-xs font-mono text-muted-foreground group-hover:text-foreground transition-colors text-center leading-tight">
                {node.shortLabel}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Latency markers */}
        <div className="relative z-10 flex justify-between px-[8%] mt-1">
          {["<1ms", "<2ms", "<3ms", "<1ms", "<5ms"].map((lat, i) => (
            <span key={i} className="text-[8px] font-mono text-primary/60">{lat}</span>
          ))}
        </div>
      </div>

      {/* Node Detail Panel */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="glass-card neon-border p-5 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${active.color}20`, color: active.color }}
              >
                {active.icon}
              </div>
              <div>
                <h4 className="font-display font-bold text-foreground">{active.label}</h4>
                <span className="font-mono text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${active.color}15`, color: active.color }}>
                  {active.protocol}
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{active.desc}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Round-trip Latency Budget */}
      <div className="glass-card p-4 rounded-xl border border-border">
        <h5 className="font-display text-sm font-bold text-foreground mb-3 flex items-center gap-2">
          <Radio className="w-4 h-4 text-neon" />
          Motion-to-Photon Latency Budget
        </h5>
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {[
            { step: "Sensor", ms: 1, color: "#a855f7" },
            { step: "Wi-Fi", ms: 2, color: "#3b82f6" },
            { step: "Router", ms: 2, color: "#06b6d4" },
            { step: "Firewall", ms: 1, color: "#10b981" },
            { step: "Edge Render", ms: 8, color: "#f59e0b" },
            { step: "Encode", ms: 2, color: "#ef4444" },
            { step: "Return Trip", ms: 3, color: "#ec4899" },
            { step: "Decode+Display", ms: 1, color: "#8b5cf6" },
          ].map((s, i) => (
            <motion.div
              key={s.step}
              className="flex flex-col items-center flex-shrink-0"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
            >
              <div
                className="rounded-md px-2 py-1.5 text-[9px] font-mono font-bold text-white text-center whitespace-nowrap"
                style={{
                  backgroundColor: s.color,
                  minWidth: Math.max(40, s.ms * 12),
                  boxShadow: `0 0 8px ${s.color}40`,
                }}
              >
                {s.step}
              </div>
              <span className="text-[8px] font-mono text-muted-foreground mt-1">{s.ms}ms</span>
              {i < 7 && <span className="text-[8px] text-primary mx-0.5">→</span>}
            </motion.div>
          ))}
          <div className="flex flex-col items-center flex-shrink-0 ml-2 pl-2 border-l border-border">
            <div className="rounded-md px-3 py-1.5 text-[10px] font-mono font-bold text-white bg-gradient-to-r from-primary to-accent whitespace-nowrap neon-glow">
              Total: 20ms
            </div>
            <span className="text-[8px] font-mono text-primary mt-1">✓ Under threshold</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkArchitecture;
