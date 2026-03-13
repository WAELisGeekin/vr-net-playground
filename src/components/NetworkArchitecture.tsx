import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, Server, Cpu, Shield, Radio, Monitor, Cloud, Gamepad2, Headset, Router, Users, User } from "lucide-react";

type Mode = "single" | "multiplayer";

// ── Single-player topology (matches MDPI VR-WLAN reference) ──────────────
const singlePlayerNodes = [
  {
    id: "pc",
    label: "VR-Ready PC",
    sub: "GPU Rendering",
    icon: <Monitor className="w-6 h-6" />,
    x: 80, y: 130,
    color: "#3b82f6",
    timing: "T_proc_PC",
    timingDesc: "Frame rendering + encoding: ~8ms",
    desc: "Renders stereo frames at 90fps using GPU pipeline. Encodes via H.265/AV1 for wireless streaming or sends raw over DisplayPort for tethered setups.",
  },
  {
    id: "ap",
    label: "Wi-Fi 6E AP",
    sub: "802.11ax · 6GHz",
    icon: <Router className="w-6 h-6" />,
    x: 320, y: 30,
    color: "#10b981",
    timing: "T_transfer",
    timingDesc: "Air-interface latency: <2ms",
    desc: "Dedicated 6GHz band with 160MHz channels. OFDMA multiplexes UL sensor data + DL video simultaneously. MU-MIMO supports multiple headsets. Target Wake Time (TWT) optimizes power.",
  },
  {
    id: "headset",
    label: "VR Headset",
    sub: "HMD · Standalone/Tethered",
    icon: <Headset className="w-6 h-6" />,
    x: 540, y: 100,
    color: "#a855f7",
    timing: "T_proc_device",
    timingDesc: "Decode + timewarp: ~3ms",
    desc: "Receives compressed video, decodes on-device SoC, applies Asynchronous TimeWarp (ATW) to compensate for late frames. Streams IMU data upstream at 1000Hz.",
  },
  {
    id: "controller1",
    label: "Controller L",
    sub: "BLE 5.3 · 6DoF",
    icon: <Gamepad2 className="w-5 h-5" />,
    x: 460, y: 260,
    color: "#06b6d4",
    timing: "T_sensing",
    timingDesc: "Input sampling: <1ms",
    desc: "Tracks position via IMU + IR LEDs at 1000Hz. Sends 64-byte input packets over BLE 5.3 to headset. Haptic feedback received at 250Hz for tactile response.",
  },
  {
    id: "controller2",
    label: "Controller R",
    sub: "BLE 5.3 · 6DoF",
    icon: <Gamepad2 className="w-5 h-5" />,
    x: 620, y: 260,
    color: "#06b6d4",
    timing: "T_sensing",
    timingDesc: "Input sampling: <1ms",
    desc: "Mirror of left controller. Both controllers maintain independent BLE connections to headset. Combined tracking enables full hand-presence in VR space.",
  },
];

// Data flow arrows for single-player
const singlePlayerFlows = [
  { from: "pc", to: "ap", type: "DL" as const, label: "Video stream\n~150 Mbps", color: "#ef4444" },
  { from: "ap", to: "headset", type: "DL" as const, label: "Compressed frames\n90fps", color: "#ef4444" },
  { from: "headset", to: "ap", type: "UL" as const, label: "Sensor data\n64B @ 1000Hz", color: "#3b82f6" },
  { from: "ap", to: "pc", type: "UL" as const, label: "Tracking + input\nUDP", color: "#3b82f6" },
  { from: "controller1", to: "headset", type: "UL" as const, label: "BLE input", color: "#06b6d4" },
  { from: "controller2", to: "headset", type: "UL" as const, label: "BLE input", color: "#06b6d4" },
];

// ── Multiplayer topology ──────────────────────────────────────────────────
const multiplayerNodes = [
  {
    id: "headset1",
    label: "Player 1 HMD",
    sub: "VR Headset",
    icon: <Headset className="w-6 h-6" />,
    x: 60, y: 80,
    color: "#a855f7",
    timing: "T_local",
    timingDesc: "Local processing: ~3ms",
    desc: "First player's headset. In P2P mode, sends state directly to other headsets. In client-server mode, sends input to dedicated server for authoritative state.",
  },
  {
    id: "headset2",
    label: "Player 2 HMD",
    sub: "VR Headset",
    icon: <Headset className="w-6 h-6" />,
    x: 60, y: 230,
    color: "#8b5cf6",
    timing: "T_local",
    timingDesc: "Local processing: ~3ms",
    desc: "Second player's headset. Receives world state updates and other players' avatar positions at 60-90Hz. Runs local prediction to mask network latency.",
  },
  {
    id: "ap",
    label: "Wi-Fi 6E AP",
    sub: "802.11ax · MU-MIMO",
    icon: <Router className="w-6 h-6" />,
    x: 250, y: 50,
    color: "#10b981",
    timing: "T_transfer_UL",
    timingDesc: "Uplink latency: <2ms",
    desc: "Handles concurrent streams from multiple headsets using MU-MIMO. OFDMA assigns dedicated resource units to each player's UL/DL streams. BSS Coloring reduces interference.",
  },
  {
    id: "router",
    label: "Edge Router",
    sub: "QoS · DSCP EF",
    icon: <Shield className="w-6 h-6" />,
    x: 420, y: 50,
    color: "#f59e0b",
    timing: "T_network",
    timingDesc: "Routing + QoS: <2ms",
    desc: "Applies DiffServ marking (DSCP EF) to VR traffic. ECN-capable for congestion without drops. Maintains separate queues for sensor data (priority) and video (bulk).",
  },
  {
    id: "gameserver",
    label: "Game Server",
    sub: "Authoritative State",
    icon: <Server className="w-6 h-6" />,
    x: 580, y: 50,
    color: "#ef4444",
    timing: "T_server",
    timingDesc: "Tick rate: 60-128Hz",
    desc: "Dedicated server running game logic. Receives input from all players, simulates physics, resolves conflicts, and broadcasts authoritative state. Tick rate of 60-128Hz determines update frequency.",
  },
  {
    id: "cloud",
    label: "Cloud / CDN",
    sub: "Matchmaking · Persistence",
    icon: <Cloud className="w-6 h-6" />,
    x: 580, y: 220,
    color: "#64748b",
    timing: "T_cloud",
    timingDesc: "Non-critical: 20-100ms OK",
    desc: "Handles matchmaking, lobby management, user profiles, and persistent world state. Not latency-critical. Connected via gRPC/HTTP3 to game servers.",
  },
];

const multiplayerFlows = [
  { from: "headset1", to: "ap", type: "UL" as const, label: "Player 1 input\nUDP 1000Hz", color: "#a855f7" },
  { from: "headset2", to: "ap", type: "UL" as const, label: "Player 2 input\nUDP 1000Hz", color: "#8b5cf6" },
  { from: "ap", to: "router", type: "UL" as const, label: "Aggregated UL\nDSCP EF", color: "#3b82f6" },
  { from: "router", to: "gameserver", type: "UL" as const, label: "Player inputs\nQUIC", color: "#3b82f6" },
  { from: "gameserver", to: "router", type: "DL" as const, label: "World state\n60-128Hz", color: "#ef4444" },
  { from: "router", to: "ap", type: "DL" as const, label: "State + video\nMPLS", color: "#ef4444" },
  { from: "ap", to: "headset1", type: "DL" as const, label: "P1 state\n90fps", color: "#ef4444" },
  { from: "ap", to: "headset2", type: "DL" as const, label: "P2 state\n90fps", color: "#ef4444" },
  { from: "gameserver", to: "cloud", type: "DL" as const, label: "Persistence\ngRPC", color: "#64748b" },
];

// Helper to get node center for arrow drawing
function getNodeCenter(node: { x: number; y: number }) {
  return { cx: node.x + 35, cy: node.y + 25 };
}

const NetworkArchitecture = () => {
  const [mode, setMode] = useState<Mode>("single");
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const nodes = mode === "single" ? singlePlayerNodes : multiplayerNodes;
  const flows = mode === "single" ? singlePlayerFlows : multiplayerFlows;
  const active = nodes.find((n) => n.id === activeNode);

  return (
    <div className="space-y-6">
      {/* Mode Switcher */}
      <div className="flex gap-2">
        <button
          onClick={() => { setMode("single"); setActiveNode(null); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-mono transition-all border ${
            mode === "single"
              ? "bg-primary/20 border-primary text-foreground neon-border"
              : "border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
          }`}
        >
          <User className="w-4 h-4" />
          Single Player
        </button>
        <button
          onClick={() => { setMode("multiplayer"); setActiveNode(null); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-mono transition-all border ${
            mode === "multiplayer"
              ? "bg-primary/20 border-primary text-foreground neon-border"
              : "border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
          }`}
        >
          <Users className="w-4 h-4" />
          Multiplayer
        </button>
      </div>

      {/* Data Flow Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
        <div className="flex items-center gap-2">
          <svg width="30" height="10"><line x1="0" y1="5" x2="24" y2="5" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrowRed)" /><defs><marker id="arrowRed" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#ef4444" /></marker></defs></svg>
          <span className="text-muted-foreground">DL Data flow <span className="text-foreground">(downstream)</span></span>
        </div>
        <div className="flex items-center gap-2">
          <svg width="30" height="10"><line x1="0" y1="5" x2="24" y2="5" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowBlue)" /><defs><marker id="arrowBlue" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#3b82f6" /></marker></defs></svg>
          <span className="text-muted-foreground">UL Data flow <span className="text-foreground">(upstream)</span></span>
        </div>
      </div>

      {/* Topology Diagram */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          className="relative glass-card neon-border rounded-xl overflow-hidden"
          style={{ height: 340 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Background grid */}
          <div className="absolute inset-0 particle-grid opacity-20" />

          {/* SVG arrows */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: "visible" }}>
            <defs>
              <marker id="arrowDL" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 Z" fill="#ef4444" fillOpacity="0.8" />
              </marker>
              <marker id="arrowUL" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 Z" fill="#3b82f6" fillOpacity="0.8" />
              </marker>
              <marker id="arrowDev" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 Z" fill="#06b6d4" fillOpacity="0.8" />
              </marker>
              <marker id="arrowGray" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 Z" fill="#64748b" fillOpacity="0.8" />
              </marker>
            </defs>
            {flows.map((flow, i) => {
              const fromNode = nodes.find(n => n.id === flow.from);
              const toNode = nodes.find(n => n.id === flow.to);
              if (!fromNode || !toNode) return null;
              const from = getNodeCenter(fromNode);
              const to = getNodeCenter(toNode);
              // Offset parallel arrows
              const offset = flow.type === "UL" ? -6 : 6;
              const dx = to.cx - from.cx;
              const dy = to.cy - from.cy;
              const len = Math.sqrt(dx * dx + dy * dy);
              const nx = -dy / len * offset;
              const ny = dx / len * offset;

              const markerColor = flow.color === "#ef4444" ? "arrowDL" : flow.color === "#3b82f6" ? "arrowUL" : flow.color === "#06b6d4" ? "arrowDev" : "arrowGray";

              // Label position at midpoint
              const midX = (from.cx + nx + to.cx + nx) / 2;
              const midY = (from.cy + ny + to.cy + ny) / 2;

              return (
                <g key={`flow-${i}`}>
                  <motion.line
                    x1={from.cx + nx} y1={from.cy + ny}
                    x2={to.cx + nx} y2={to.cy + ny}
                    stroke={flow.color}
                    strokeWidth="2"
                    strokeOpacity="0.7"
                    markerEnd={`url(#${markerColor})`}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                  />
                  {/* Flow label */}
                  <foreignObject x={midX - 50} y={midY - 18} width="100" height="36" className="pointer-events-none">
                    <div className="text-[8px] font-mono text-center leading-tight whitespace-pre-line px-1 py-0.5 rounded bg-background/80 backdrop-blur-sm border border-border/50" style={{ color: flow.color }}>
                      {flow.label}
                    </div>
                  </foreignObject>
                </g>
              );
            })}

            {/* Animated packets along flows */}
            {flows.slice(0, 4).map((flow, i) => {
              const fromNode = nodes.find(n => n.id === flow.from);
              const toNode = nodes.find(n => n.id === flow.to);
              if (!fromNode || !toNode) return null;
              const from = getNodeCenter(fromNode);
              const to = getNodeCenter(toNode);
              return (
                <motion.circle
                  key={`packet-${i}`}
                  r="4"
                  fill={flow.color}
                  filter={`drop-shadow(0 0 4px ${flow.color})`}
                  initial={{ cx: from.cx, cy: from.cy, opacity: 0 }}
                  animate={{
                    cx: [from.cx, to.cx],
                    cy: [from.cy, to.cy],
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.6,
                    ease: "linear",
                  }}
                />
              );
            })}
          </svg>

          {/* Device Nodes */}
          {nodes.map((node, i) => (
            <motion.button
              key={node.id}
              className="absolute z-20 flex flex-col items-center group"
              style={{ left: node.x, top: node.y }}
              onClick={() => setActiveNode(activeNode === node.id ? null : node.id)}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08, type: "spring" }}
              whileHover={{ scale: 1.1 }}
            >
              {/* Timing label above */}
              <span className="text-[9px] font-mono italic mb-1 opacity-70" style={{ color: node.color }}>
                {node.timing}
              </span>
              {/* Device icon box */}
              <div
                className={`w-16 h-12 rounded-lg flex items-center justify-center border-2 transition-all duration-300 ${
                  activeNode === node.id ? "scale-110" : ""
                }`}
                style={{
                  borderColor: activeNode === node.id ? node.color : "hsl(var(--border))",
                  backgroundColor: activeNode === node.id ? `${node.color}20` : "hsl(var(--card))",
                  boxShadow: activeNode === node.id ? `0 0 20px ${node.color}40` : "none",
                  color: node.color,
                }}
              >
                {node.icon}
              </div>
              {/* Label below */}
              <span className="text-[10px] font-mono mt-1 text-foreground font-bold text-center leading-tight max-w-[80px]">
                {node.label}
              </span>
              <span className="text-[8px] font-mono text-muted-foreground text-center leading-tight max-w-[90px]">
                {node.sub}
              </span>
            </motion.button>
          ))}
        </motion.div>
      </AnimatePresence>

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
                <div className="flex gap-2 mt-0.5">
                  <span className="font-mono text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${active.color}15`, color: active.color }}>
                    {active.sub}
                  </span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground italic">
                    {active.timingDesc}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{active.desc}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Latency Budget */}
      <div className="glass-card p-4 rounded-xl border border-border">
        <h5 className="font-display text-sm font-bold text-foreground mb-3 flex items-center gap-2">
          <Radio className="w-4 h-4 text-neon" />
          Motion-to-Photon Latency Budget ({mode === "single" ? "Single Player" : "Multiplayer"})
        </h5>
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {(mode === "single"
            ? [
                { step: "Sensor", ms: 1, color: "#a855f7" },
                { step: "Wi-Fi UL", ms: 2, color: "#10b981" },
                { step: "PC Render", ms: 8, color: "#3b82f6" },
                { step: "Encode", ms: 2, color: "#f59e0b" },
                { step: "Wi-Fi DL", ms: 2, color: "#10b981" },
                { step: "Decode", ms: 2, color: "#a855f7" },
                { step: "Timewarp", ms: 1, color: "#8b5cf6" },
                { step: "Display", ms: 2, color: "#ec4899" },
              ]
            : [
                { step: "Sensor", ms: 1, color: "#a855f7" },
                { step: "Wi-Fi UL", ms: 2, color: "#10b981" },
                { step: "Router", ms: 2, color: "#f59e0b" },
                { step: "Server Tick", ms: 8, color: "#ef4444" },
                { step: "State Broadcast", ms: 2, color: "#ef4444" },
                { step: "Router DL", ms: 2, color: "#f59e0b" },
                { step: "Wi-Fi DL", ms: 2, color: "#10b981" },
                { step: "Render + Display", ms: 3, color: "#a855f7" },
              ]
          ).map((s, i) => (
            <motion.div
              key={s.step}
              className="flex flex-col items-center flex-shrink-0"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}
            >
              <div
                className="rounded-md px-2 py-1.5 text-[9px] font-mono font-bold text-white text-center whitespace-nowrap"
                style={{
                  backgroundColor: s.color,
                  minWidth: Math.max(40, s.ms * 10),
                  boxShadow: `0 0 8px ${s.color}40`,
                }}
              >
                {s.step}
              </div>
              <span className="text-[8px] font-mono text-muted-foreground mt-1">{s.ms}ms</span>
            </motion.div>
          ))}
          <div className="flex flex-col items-center flex-shrink-0 ml-2 pl-2 border-l border-border">
            <div className="rounded-md px-3 py-1.5 text-[10px] font-mono font-bold text-white bg-gradient-to-r from-primary to-accent whitespace-nowrap neon-glow">
              Total: {mode === "single" ? "20ms" : "22ms"}
            </div>
            <span className="text-[8px] font-mono text-primary mt-1">
              {mode === "single" ? "✓ Under 20ms threshold" : "⚠ Near threshold"}
            </span>
          </div>
        </div>
      </div>

      {/* WiFi Connectivity Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card p-4 rounded-xl border border-border">
          <h5 className="font-display text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <Wifi className="w-4 h-4 text-neon" />
            Wi-Fi Specifications for VR
          </h5>
          <div className="space-y-2">
            {[
              { spec: "Standard", value: "Wi-Fi 6E (802.11ax) / Wi-Fi 7 (802.11be)" },
              { spec: "Band", value: "6 GHz (preferred) · 5 GHz (fallback)" },
              { spec: "Channel Width", value: "160 MHz (6E) · 320 MHz (Wi-Fi 7)" },
              { spec: "Max Throughput", value: "2.4 Gbps (6E) · 5.8 Gbps (Wi-Fi 7)" },
              { spec: "Latency", value: "<2ms air-interface RTT" },
              { spec: "Features", value: "MU-MIMO, OFDMA, TWT, BSS Coloring" },
            ].map((row) => (
              <div key={row.spec} className="flex justify-between text-xs font-mono">
                <span className="text-muted-foreground">{row.spec}</span>
                <span className="text-foreground text-right max-w-[60%]">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border border-border">
          <h5 className="font-display text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-neon" />
            {mode === "single" ? "Connection Modes" : "Multiplayer Networking"}
          </h5>
          {mode === "single" ? (
            <div className="space-y-3">
              {[
                { mode: "Standalone", desc: "All processing on-device SoC. No network needed for single-player. Lower visual fidelity but zero latency.", icon: "📱" },
                { mode: "PC VR (Tethered)", desc: "USB-C / DisplayPort to PC. Zero wireless latency. Limited mobility. Best visual quality.", icon: "🔌" },
                { mode: "PC VR (Wireless)", desc: "Wi-Fi 6E streaming from PC. ~2ms added latency. Full mobility. Requires dedicated AP.", icon: "📡" },
              ].map((m) => (
                <div key={m.mode} className="flex gap-2 items-start">
                  <span className="text-lg">{m.icon}</span>
                  <div>
                    <span className="text-xs font-mono font-bold text-foreground">{m.mode}</span>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {[
                { mode: "P2P Mesh", desc: "Direct connections between headsets. O(n²) bandwidth. Only feasible for <8 players. Low server cost.", icon: "🔗" },
                { mode: "Client-Server", desc: "Dedicated authoritative server. Tick rate 60-128Hz. Handles anti-cheat and state reconciliation. Scales to hundreds.", icon: "🖥️" },
                { mode: "Cloud Edge", desc: "Distributed edge servers <10ms away. GPU rendering offloaded. Enables photorealistic multiplayer VR.", icon: "☁️" },
              ].map((m) => (
                <div key={m.mode} className="flex gap-2 items-start">
                  <span className="text-lg">{m.icon}</span>
                  <div>
                    <span className="text-xs font-mono font-bold text-foreground">{m.mode}</span>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetworkArchitecture;
