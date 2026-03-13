import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Minus, Info } from "lucide-react";

type Protocol = "tcp" | "udp" | "quic" | "webrtc";

interface ProtocolData {
  id: Protocol;
  name: string;
  fullName: string;
  color: string;
  layer: string;
  vrUseCase: string;
  latency: string;
  reliability: string;
  pros: string[];
  cons: string[];
  vrVerdict: "excellent" | "good" | "limited" | "poor";
  verdictText: string;
  animation: {
    label: string;
    packets: number;
    hasAck: boolean;
    speed: number;
  };
}

const protocols: ProtocolData[] = [
  {
    id: "tcp",
    name: "TCP",
    fullName: "Transmission Control Protocol",
    color: "#3b82f6",
    layer: "Layer 4 – Transport",
    vrUseCase: "Control plane signaling, asset downloads, lobby/chat",
    latency: "50–200ms+ (handshake + retransmission)",
    reliability: "Guaranteed, ordered delivery",
    pros: [
      "Reliable, ordered packet delivery",
      "Built-in congestion control",
      "Universal firewall traversal",
      "Well-understood, mature protocol",
    ],
    cons: [
      "3-way handshake adds 1 RTT setup delay",
      "Head-of-line (HOL) blocking on packet loss",
      "Retransmissions cause latency spikes",
      "Not suitable for real-time VR data",
    ],
    vrVerdict: "limited",
    verdictText: "Only for non-real-time VR tasks: asset loading, chat, session setup. Never for tracking or video.",
    animation: { label: "Reliable + ACK", packets: 3, hasAck: true, speed: 2 },
  },
  {
    id: "udp",
    name: "UDP",
    fullName: "User Datagram Protocol",
    color: "#10b981",
    layer: "Layer 4 – Transport",
    vrUseCase: "IMU sensor data (1000Hz), audio streaming, game state",
    latency: "<1ms protocol overhead",
    reliability: "Best-effort, no guarantees",
    pros: [
      "Zero handshake — send immediately",
      "No HOL blocking",
      "Minimal protocol overhead (8-byte header)",
      "Perfect for fire-and-forget sensor data",
    ],
    cons: [
      "No delivery guarantee — packets may drop",
      "No ordering — must handle in application",
      "No congestion control — can flood network",
      "Must build reliability layer on top if needed",
    ],
    vrVerdict: "excellent",
    verdictText: "The backbone of VR networking. IMU data at 1000Hz, audio, and game state all use UDP. Lost packets are replaced by newer data.",
    animation: { label: "Fire & forget", packets: 6, hasAck: false, speed: 1 },
  },
  {
    id: "quic",
    name: "QUIC",
    fullName: "Quick UDP Internet Connections",
    color: "#f59e0b",
    layer: "Layer 4.5 – Transport (over UDP)",
    vrUseCase: "Multiplexed video + state streams, edge server comms",
    latency: "0-RTT resumption, ~5ms typical",
    reliability: "Per-stream reliability (no HOL blocking)",
    pros: [
      "0-RTT connection resumption",
      "Independent streams — no HOL blocking",
      "Built-in TLS 1.3 encryption",
      "Connection migration (Wi-Fi → cellular)",
    ],
    cons: [
      "Higher CPU usage than raw UDP",
      "Newer — less hardware offload support",
      "Some middleboxes may throttle UDP-based traffic",
      "More complex implementation than TCP/UDP",
    ],
    vrVerdict: "excellent",
    verdictText: "Ideal for multiplexed VR: video stream + game state + audio as independent QUIC streams. Zero HOL blocking across streams.",
    animation: { label: "Multi-stream", packets: 4, hasAck: false, speed: 1.2 },
  },
  {
    id: "webrtc",
    name: "WebRTC",
    fullName: "Web Real-Time Communication",
    color: "#a855f7",
    layer: "Application Layer (over UDP/QUIC)",
    vrUseCase: "Cloud VR rendering, P2P multiplayer, spatial audio",
    latency: "~10-30ms E2E (incl. ICE, DTLS)",
    reliability: "SCTP data channels: configurable reliability",
    pros: [
      "NAT traversal via ICE/STUN/TURN",
      "Built-in DTLS encryption",
      "Adaptive bitrate for video (REMB/TWcc)",
      "Browser-native — works in WebXR",
    ],
    cons: [
      "Complex setup (SDP offer/answer, ICE)",
      "TURN relay adds latency when P2P fails",
      "Jitter buffer adds ~20ms to video",
      "Higher overhead than raw UDP",
    ],
    vrVerdict: "good",
    verdictText: "Best for cloud-rendered VR and browser-based WebXR. SCTP data channels allow unreliable mode for sensor data alongside reliable video.",
    animation: { label: "P2P + DTLS", packets: 4, hasAck: true, speed: 1.5 },
  },
];

const verdictColors: Record<string, string> = {
  excellent: "text-green-400 bg-green-500/10 border-green-500/30",
  good: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  limited: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  poor: "text-red-400 bg-red-500/10 border-red-500/30",
};

const ProtocolPlaygroundContent = () => {
  const [selected, setSelected] = useState<Protocol | null>(null);
  const [showTable, setShowTable] = useState(false);

  const active = protocols.find((p) => p.id === selected);

  return (
    <div className="space-y-8">
      <p className="text-muted-foreground">
        Compare the four transport protocols used in VR networking. Each solves different trade-offs between latency, reliability, and complexity.
      </p>

      {/* Protocol Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {protocols.map((proto) => (
          <motion.button
            key={proto.id}
            className={`glass-card p-4 rounded-xl text-left transition-all duration-300 border ${
              selected === proto.id
                ? "neon-border neon-glow"
                : "border-border hover:border-primary/50"
            }`}
            onClick={() => setSelected(selected === proto.id ? null : proto.id)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: proto.color, boxShadow: `0 0 8px ${proto.color}50` }}
              />
              <h4 className="font-display text-lg font-bold text-foreground">{proto.name}</h4>
            </div>
            <p className="text-[10px] font-mono text-muted-foreground leading-tight">{proto.fullName}</p>
            <div className={`mt-2 text-[9px] font-mono px-2 py-0.5 rounded-full border inline-block ${verdictColors[proto.vrVerdict]}`}>
              {proto.vrVerdict} for VR
            </div>
          </motion.button>
        ))}
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {active && (
          <motion.div
            key={active.id}
            className="glass-card neon-border p-6 rounded-xl space-y-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <h4 className="font-display text-xl font-bold text-foreground">{active.name} — {active.fullName}</h4>
                <span className="text-xs font-mono text-muted-foreground">{active.layer}</span>
              </div>
              <div className={`text-xs font-mono px-3 py-1 rounded-full border ${verdictColors[active.vrVerdict]}`}>
                VR Verdict: {active.vrVerdict.toUpperCase()}
              </div>
            </div>

            {/* Packet Animation */}
            <div className="bg-muted rounded-lg p-4 overflow-hidden">
              <p className="text-xs font-mono text-muted-foreground mb-3">{active.animation.label}:</p>
              <div className="relative h-10">
                {Array.from({ length: active.animation.packets }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute top-1/2 -translate-y-1/2 w-7 h-6 rounded flex items-center justify-center text-[9px] font-mono text-white font-bold"
                    style={{ backgroundColor: active.color }}
                    animate={{ x: [0, 280], opacity: [1, 1, 0.3] }}
                    transition={{
                      duration: active.animation.speed,
                      delay: i * 0.18,
                      repeat: Infinity,
                      repeatDelay: 1,
                    }}
                  >
                    {i + 1}
                  </motion.div>
                ))}
                {active.animation.hasAck &&
                  Array.from({ length: Math.min(active.animation.packets, 3) }).map((_, i) => (
                    <motion.div
                      key={`ack-${i}`}
                      className="absolute top-1/2 -translate-y-1/2 text-[9px] font-mono text-green-400"
                      style={{ left: 280 }}
                      animate={{ x: [0, -260], opacity: [0, 1, 1, 0] }}
                      transition={{
                        duration: active.animation.speed * 0.6,
                        delay: i * 0.18 + active.animation.speed * 0.7,
                        repeat: Infinity,
                        repeatDelay: active.animation.speed + 0.5,
                      }}
                    >
                      ACK
                    </motion.div>
                  ))}
              </div>
            </div>

            {/* Key stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
              <div className="bg-muted/50 rounded-lg p-3">
                <span className="text-muted-foreground">Latency</span>
                <p className="text-foreground mt-1">{active.latency}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <span className="text-muted-foreground">Reliability</span>
                <p className="text-foreground mt-1">{active.reliability}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <span className="text-muted-foreground">VR Use Case</span>
                <p className="text-foreground mt-1">{active.vrUseCase}</p>
              </div>
            </div>

            {/* Pros & Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="text-sm font-display font-bold text-foreground mb-2">Advantages</h5>
                <ul className="space-y-1.5">
                  {active.pros.map((p, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Check className="w-3.5 h-3.5 text-green-400 flex-shrink-0 mt-0.5" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="text-sm font-display font-bold text-foreground mb-2">Disadvantages</h5>
                <ul className="space-y-1.5">
                  {active.cons.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <X className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* VR Verdict */}
            <div className={`p-4 rounded-lg border ${verdictColors[active.vrVerdict]}`}>
              <div className="flex items-center gap-2 mb-1">
                <Info className="w-4 h-4" />
                <span className="text-sm font-bold font-display">VR Networking Verdict</span>
              </div>
              <p className="text-xs leading-relaxed opacity-90">{active.verdictText}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comparison Table Toggle */}
      <button
        onClick={() => setShowTable(!showTable)}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-mono border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
      >
        {showTable ? "Hide" : "Show"} Full Comparison Table
      </button>

      <AnimatePresence>
        {showTable && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 text-muted-foreground font-normal">Feature</th>
                    {protocols.map((p) => (
                      <th key={p.id} className="text-center py-2 px-3 font-bold" style={{ color: p.color }}>
                        {p.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  {[
                    { feature: "Connection Setup", values: ["3-way handshake", "None", "0-RTT resume", "ICE + DTLS"] },
                    { feature: "HOL Blocking", values: ["Yes ✗", "No ✓", "No ✓ (per-stream)", "No ✓"] },
                    { feature: "Encryption", values: ["TLS 1.3 (opt)", "None built-in", "TLS 1.3 built-in", "DTLS built-in"] },
                    { feature: "NAT Traversal", values: ["Limited", "None", "Conn migration", "ICE/STUN/TURN"] },
                    { feature: "Congestion Ctrl", values: ["Yes", "None", "Pluggable (BBR)", "GCC/REMB"] },
                    { feature: "VR Sensor Data", values: ["✗ Too slow", "✓ Primary", "✓ Good", "✓ DataChannel"] },
                    { feature: "VR Video Stream", values: ["✗ HOL issue", "~ Custom needed", "✓ Excellent", "✓ Built-in"] },
                    { feature: "Multiplayer State", values: ["~ Possible", "✓ Primary", "✓ Excellent", "✓ Good"] },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-2 px-3 text-foreground font-bold whitespace-nowrap">{row.feature}</td>
                      {row.values.map((val, j) => (
                        <td key={j} className="py-2 px-3 text-center whitespace-nowrap">
                          <span className={val.includes("✓") ? "text-green-400" : val.includes("✗") ? "text-red-400" : val.includes("~") ? "text-yellow-400" : ""}>
                            {val}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProtocolPlaygroundContent;
