import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, UserX, Zap, Eye, Wifi, Server, Monitor, Router, Headset, AlertTriangle } from "lucide-react";

// Threat topology node type
interface TopoNode {
  id: string;
  label: string;
  icon: React.ReactNode;
  x: number;
  y: number;
  color: string;
  compromised?: boolean;
}

interface TopoFlow {
  from: string;
  to: string;
  label: string;
  color: string;
  dashed?: boolean;
  malicious?: boolean;
}

interface ThreatData {
  id: string;
  icon: React.ReactNode;
  label: string;
  desc: string;
  mitigation: string;
  nodes: TopoNode[];
  flows: TopoFlow[];
  attackLabel: string;
}

const threats: ThreatData[] = [
  {
    id: "mitm",
    icon: <UserX className="w-5 h-5" />,
    label: "Man-in-the-Middle",
    desc: "Attacker intercepts the wireless link between VR headset and AP, capturing sensor data, injecting false spatial coordinates, or harvesting biometric information. In VR, a MITM can manipulate what the user sees, causing disorientation or injecting malicious objects.",
    mitigation: "Certificate pinning, mutual TLS/DTLS, WPA3-SAE authentication, and encrypted control channels prevent interception. Device attestation ensures only legitimate hardware connects.",
    attackLabel: "Attacker intercepts wireless traffic between headset and AP",
    nodes: [
      { id: "headset", label: "VR Headset", icon: <Headset className="w-5 h-5" />, x: 40, y: 50, color: "#a855f7" },
      { id: "attacker", label: "Attacker", icon: <AlertTriangle className="w-5 h-5" />, x: 260, y: 50, color: "#ef4444", compromised: true },
      { id: "ap", label: "Wi-Fi AP", icon: <Router className="w-5 h-5" />, x: 480, y: 50, color: "#10b981" },
      { id: "server", label: "Edge Server", icon: <Server className="w-5 h-5" />, x: 480, y: 180, color: "#3b82f6" },
    ],
    flows: [
      { from: "headset", to: "attacker", label: "Sensor data (intercepted)", color: "#ef4444", malicious: true },
      { from: "attacker", to: "ap", label: "Modified data", color: "#ef4444", malicious: true },
      { from: "ap", to: "attacker", label: "Video stream", color: "#ef4444", malicious: true },
      { from: "attacker", to: "headset", label: "Tampered frames", color: "#ef4444", malicious: true },
      { from: "ap", to: "server", label: "QUIC (legitimate)", color: "#3b82f6" },
    ],
  },
  {
    id: "ddos",
    icon: <Zap className="w-5 h-5" />,
    label: "DDoS Attack",
    desc: "Volumetric flood targeting VR game servers or edge rendering nodes. Even 50ms of added latency causes motion sickness. SYN floods, UDP reflection, and amplification attacks can overwhelm VR infrastructure, causing complete immersion failure for all connected players.",
    mitigation: "Geo-distributed edge nodes, rate limiting, AI-powered traffic analysis, SYN cookies, and anycast routing distribute attack traffic. RTBH (Remote Triggered Black Hole) for emergency mitigation.",
    attackLabel: "Botnet floods edge server, disrupting all VR sessions",
    nodes: [
      { id: "bot1", label: "Bot 1", icon: <Monitor className="w-5 h-5" />, x: 40, y: 30, color: "#ef4444", compromised: true },
      { id: "bot2", label: "Bot 2", icon: <Monitor className="w-5 h-5" />, x: 40, y: 120, color: "#ef4444", compromised: true },
      { id: "bot3", label: "Bot 3", icon: <Monitor className="w-5 h-5" />, x: 40, y: 210, color: "#ef4444", compromised: true },
      { id: "router", label: "Edge Router", icon: <Router className="w-5 h-5" />, x: 260, y: 120, color: "#f59e0b" },
      { id: "server", label: "VR Game Server", icon: <Server className="w-5 h-5" />, x: 480, y: 80, color: "#3b82f6" },
      { id: "headset", label: "VR Headset", icon: <Headset className="w-5 h-5" />, x: 480, y: 200, color: "#a855f7" },
    ],
    flows: [
      { from: "bot1", to: "router", label: "SYN flood", color: "#ef4444", malicious: true },
      { from: "bot2", to: "router", label: "UDP amplification", color: "#ef4444", malicious: true },
      { from: "bot3", to: "router", label: "HTTP flood", color: "#ef4444", malicious: true },
      { from: "router", to: "server", label: "Overwhelmed", color: "#ef4444", dashed: true, malicious: true },
      { from: "server", to: "headset", label: "Degraded / dropped", color: "#f59e0b", dashed: true },
    ],
  },
  {
    id: "encrypt",
    icon: <Lock className="w-5 h-5" />,
    label: "Encryption",
    desc: "All VR data streams must be encrypted end-to-end. DTLS 1.3 (Datagram TLS) over UDP protects real-time sensor and video data without significant latency. AES-256-GCM provides authenticated encryption. Session keys rotate every 60 seconds to limit exposure.",
    mitigation: "DTLS 1.3 with 0-RTT resumption, AES-256-GCM for data, X25519 for key exchange, certificate pinning on edge servers. WPA3-SAE on the wireless link adds a second encryption layer.",
    attackLabel: "Eavesdropper cannot read encrypted traffic",
    nodes: [
      { id: "headset", label: "VR Headset", icon: <Headset className="w-5 h-5" />, x: 40, y: 100, color: "#a855f7" },
      { id: "ap", label: "Wi-Fi AP", icon: <Router className="w-5 h-5" />, x: 200, y: 30, color: "#10b981" },
      { id: "eavesdrop", label: "Eavesdropper", icon: <Eye className="w-5 h-5" />, x: 200, y: 200, color: "#ef4444", compromised: true },
      { id: "server", label: "Edge Server", icon: <Server className="w-5 h-5" />, x: 400, y: 30, color: "#3b82f6" },
      { id: "lock", label: "DTLS 1.3", icon: <Lock className="w-5 h-5" />, x: 400, y: 170, color: "#10b981" },
    ],
    flows: [
      { from: "headset", to: "ap", label: "WPA3 + DTLS encrypted", color: "#10b981" },
      { from: "ap", to: "server", label: "DTLS 1.3 tunnel", color: "#10b981" },
      { from: "eavesdrop", to: "ap", label: "Cannot decrypt ✗", color: "#ef4444", dashed: true, malicious: true },
      { from: "lock", to: "server", label: "AES-256-GCM", color: "#10b981" },
    ],
  },
  {
    id: "auth",
    icon: <Shield className="w-5 h-5" />,
    label: "Identity & Auth",
    desc: "VR devices can use biometric authentication (iris scan, gesture patterns) plus OAuth 2.0 tokens for session management. Device attestation ensures only authorized hardware connects to VR servers. Unauthorized devices are rejected at the AP level before reaching game infrastructure.",
    mitigation: "Multi-factor auth: device attestation + biometric + token. WPA3-Enterprise with RADIUS for AP-level access control. JWT tokens with short TTL for session management.",
    attackLabel: "Rogue device rejected at authentication layer",
    nodes: [
      { id: "legit", label: "Authorized HMD", icon: <Headset className="w-5 h-5" />, x: 40, y: 50, color: "#a855f7" },
      { id: "rogue", label: "Rogue Device", icon: <AlertTriangle className="w-5 h-5" />, x: 40, y: 190, color: "#ef4444", compromised: true },
      { id: "ap", label: "Wi-Fi AP", icon: <Router className="w-5 h-5" />, x: 250, y: 50, color: "#10b981" },
      { id: "radius", label: "RADIUS Server", icon: <Shield className="w-5 h-5" />, x: 250, y: 190, color: "#f59e0b" },
      { id: "server", label: "Game Server", icon: <Server className="w-5 h-5" />, x: 460, y: 50, color: "#3b82f6" },
    ],
    flows: [
      { from: "legit", to: "ap", label: "WPA3-Enterprise + cert", color: "#10b981" },
      { from: "ap", to: "server", label: "Authenticated session", color: "#10b981" },
      { from: "rogue", to: "ap", label: "Auth request", color: "#ef4444", malicious: true },
      { from: "ap", to: "radius", label: "Verify credentials", color: "#f59e0b" },
      { from: "radius", to: "ap", label: "REJECT ✗", color: "#ef4444", dashed: true },
    ],
  },
  {
    id: "privacy",
    icon: <Eye className="w-5 h-5" />,
    label: "Privacy Risks",
    desc: "VR headsets collect eye tracking, body movement, room mapping, and biometric data — all classified as PII under GDPR. This data traverses the network to edge/cloud servers. Data minimization and on-device processing are preferred to reduce exposure surface.",
    mitigation: "On-device sensor fusion (process locally, send only results). Differential privacy for analytics. GDPR-compliant data retention policies. Encrypted at-rest storage. User consent flows for data collection.",
    attackLabel: "Sensitive biometric data processed on-device to minimize exposure",
    nodes: [
      { id: "headset", label: "VR Headset", icon: <Headset className="w-5 h-5" />, x: 40, y: 100, color: "#a855f7" },
      { id: "local", label: "On-Device AI", icon: <Shield className="w-5 h-5" />, x: 220, y: 40, color: "#10b981" },
      { id: "ap", label: "Wi-Fi AP", icon: <Router className="w-5 h-5" />, x: 220, y: 200, color: "#f59e0b" },
      { id: "edge", label: "Edge (Anonymized)", icon: <Server className="w-5 h-5" />, x: 420, y: 40, color: "#3b82f6" },
      { id: "cloud", label: "Cloud (Aggregate)", icon: <Server className="w-5 h-5" />, x: 420, y: 200, color: "#64748b" },
    ],
    flows: [
      { from: "headset", to: "local", label: "Raw biometrics", color: "#a855f7" },
      { from: "local", to: "edge", label: "Anonymized features only", color: "#10b981" },
      { from: "headset", to: "ap", label: "Minimal tracking data", color: "#f59e0b" },
      { from: "ap", to: "cloud", label: "Aggregated stats (no PII)", color: "#64748b" },
    ],
  },
];

function getNodeCenter(node: { x: number; y: number }) {
  return { cx: node.x + 35, cy: node.y + 20 };
}

function ThreatTopology({ threat }: { threat: ThreatData }) {
  return (
    <div className="relative rounded-lg overflow-hidden bg-muted/50 border border-border" style={{ height: 280 }}>
      {/* Attack description banner */}
      <div className="absolute top-2 left-2 right-2 z-10">
        <div className="text-[9px] font-mono px-2 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/20 inline-block">
          ⚠ {threat.attackLabel}
        </div>
      </div>

      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: "visible" }}>
        <defs>
          <marker id="arrowGood" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 Z" fill="#10b981" fillOpacity="0.8" />
          </marker>
          <marker id="arrowBad" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 Z" fill="#ef4444" fillOpacity="0.8" />
          </marker>
          <marker id="arrowWarn" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 Z" fill="#f59e0b" fillOpacity="0.8" />
          </marker>
          <marker id="arrowNeutral" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 Z" fill="#64748b" fillOpacity="0.8" />
          </marker>
        </defs>

        {threat.flows.map((flow, i) => {
          const fromNode = threat.nodes.find((n) => n.id === flow.from);
          const toNode = threat.nodes.find((n) => n.id === flow.to);
          if (!fromNode || !toNode) return null;
          const from = getNodeCenter(fromNode);
          const to = getNodeCenter(toNode);

          const markerRef = flow.malicious ? "arrowBad" : flow.color === "#f59e0b" ? "arrowWarn" : flow.color === "#64748b" ? "arrowNeutral" : "arrowGood";

          const midX = (from.cx + to.cx) / 2;
          const midY = (from.cy + to.cy) / 2;

          return (
            <g key={`flow-${i}`}>
              <motion.line
                x1={from.cx} y1={from.cy}
                x2={to.cx} y2={to.cy}
                stroke={flow.color}
                strokeWidth="1.5"
                strokeOpacity="0.6"
                strokeDasharray={flow.dashed ? "6 4" : "none"}
                markerEnd={`url(#${markerRef})`}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
              />
              {/* Animated packet dot */}
              {!flow.dashed && (
                <motion.circle
                  r="3"
                  fill={flow.color}
                  filter={`drop-shadow(0 0 3px ${flow.color})`}
                  animate={{
                    cx: [from.cx, to.cx],
                    cy: [from.cy, to.cy],
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.3, ease: "linear" }}
                />
              )}
              <foreignObject x={midX - 45} y={midY - 12} width="90" height="24" className="pointer-events-none">
                <div className="text-[7px] font-mono text-center leading-tight px-1 py-0.5 rounded bg-background/80 border border-border/30" style={{ color: flow.color }}>
                  {flow.label}
                </div>
              </foreignObject>
            </g>
          );
        })}
      </svg>

      {/* Nodes */}
      {threat.nodes.map((node, i) => (
        <motion.div
          key={node.id}
          className="absolute z-20 flex flex-col items-center"
          style={{ left: node.x, top: node.y }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.08, type: "spring" }}
        >
          <div
            className={`w-14 h-10 rounded-lg flex items-center justify-center border-2 ${
              node.compromised ? "border-red-500/60 bg-red-500/10" : "border-border bg-card"
            }`}
            style={{
              color: node.color,
              boxShadow: node.compromised ? "0 0 12px rgba(239,68,68,0.3)" : "none",
            }}
          >
            {node.icon}
          </div>
          <span className={`text-[9px] font-mono mt-1 text-center leading-tight max-w-[70px] ${node.compromised ? "text-red-400 font-bold" : "text-foreground"}`}>
            {node.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

const SecurityContent = () => {
  const [activeThreat, setActiveThreat] = useState<string | null>(null);
  const active = threats.find((t) => t.id === activeThreat);

  return (
    <div className="space-y-8">
      <p className="text-muted-foreground">
        VR introduces unique security challenges due to the volume and sensitivity of data transmitted. Click each threat to see its network topology and attack vector.
      </p>

      {/* Shield center */}
      <div className="flex justify-center mb-4">
        <div className="w-20 h-20 rounded-full border-2 border-neon/30 flex items-center justify-center neon-glow">
          <Shield className="w-10 h-10 text-neon" />
        </div>
      </div>

      {/* Threat buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {threats.map((threat) => (
          <button
            key={threat.id}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300 ${
              activeThreat === threat.id
                ? "bg-primary/10 neon-border neon-glow"
                : "glass-card border border-border hover:border-neon/30"
            }`}
            onClick={() => setActiveThreat(activeThreat === threat.id ? null : threat.id)}
          >
            <span className={activeThreat === threat.id ? "text-primary" : "text-muted-foreground"}>
              {threat.icon}
            </span>
            <span className="text-xs font-mono text-center">{threat.label}</span>
          </button>
        ))}
      </div>

      {/* Detail Panel with Topology */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="glass-card neon-border p-6 rounded-xl space-y-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="text-neon">{active.icon}</div>
              <h4 className="font-display font-bold text-foreground text-lg">{active.label}</h4>
            </div>

            {/* Network Topology Diagram */}
            <ThreatTopology threat={active} />

            {/* Description */}
            <div>
              <h5 className="text-sm font-display font-bold text-foreground mb-1">Attack Vector</h5>
              <p className="text-sm text-muted-foreground leading-relaxed">{active.desc}</p>
            </div>

            {/* Mitigation */}
            <div className="p-4 rounded-lg border border-green-500/20 bg-green-500/5">
              <h5 className="text-sm font-display font-bold text-green-400 mb-1 flex items-center gap-2">
                <Shield className="w-4 h-4" /> Mitigation
              </h5>
              <p className="text-xs text-muted-foreground leading-relaxed">{active.mitigation}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SecurityContent;
