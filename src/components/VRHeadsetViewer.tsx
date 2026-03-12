import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Glasses, Cpu, Wifi, Eye, Radio, Zap, Server, Shield, Move3D } from "lucide-react";
import VRHeadset3D, { type ComponentData } from "@/components/VRHeadset3D";

// Hotspots positioned over the Sketchfab iframe — networking-focused descriptions
const hotspots = [
  {
    id: "lenses",
    icon: <Eye className="w-4 h-4" />,
    title: "Lenses & Display Output",
    top: "42%",
    left: "38%",
    color: "from-violet-500 to-purple-600",
    networkRole: "Receives decoded video frames from the rendering pipeline. Each eye requires a separate 2K+ stream at 90fps, demanding ~150 Mbps of decoded bandwidth. Frame delivery must stay under 11ms per cycle.",
    protocol: "H.265 / AV1",
  },
  {
    id: "sensors",
    icon: <Radio className="w-4 h-4" />,
    title: "IMU & Motion Sensors",
    top: "28%",
    left: "62%",
    color: "from-cyan-500 to-teal-600",
    networkRole: "Sends orientation data (quaternion) at 1000Hz upstream. Each packet is ~64 bytes but must arrive within 1ms. Uses UDP for zero-overhead delivery. Sensor fusion combines accelerometer + gyroscope + magnetometer.",
    protocol: "UDP @ 1000Hz",
  },
  {
    id: "wifi",
    icon: <Wifi className="w-4 h-4" />,
    title: "Wi-Fi 6E / 7 Radio",
    top: "55%",
    left: "72%",
    color: "from-blue-500 to-indigo-600",
    networkRole: "The wireless transceiver operating on 6GHz band. Provides <2ms air-interface latency with MU-MIMO. Handles both upstream sensor data and downstream video stream simultaneously via OFDMA.",
    protocol: "802.11ax/be",
  },
  {
    id: "processor",
    icon: <Cpu className="w-4 h-4" />,
    title: "Onboard SoC",
    top: "48%",
    left: "50%",
    color: "from-amber-500 to-orange-600",
    networkRole: "Runs the network stack, handles packet reassembly, and performs timewarp reprojection while waiting for late frames. Manages QoS tagging (DSCP EF) for all outgoing VR traffic to prioritize over background data.",
    protocol: "QUIC / WebRTC",
  },
  {
    id: "strap",
    icon: <Zap className="w-4 h-4" />,
    title: "Battery & Power Management",
    top: "18%",
    left: "50%",
    color: "from-green-500 to-emerald-600",
    networkRole: "Powers the network radio and SoC. Wi-Fi 6E consumes ~2W during active streaming. Smart power management switches between low-latency active mode and power-save mode based on network traffic patterns.",
    protocol: "Power States: Active/Doze",
  },
];

const networkingInsights = [
  {
    icon: <Server className="w-5 h-5 text-neon" />,
    title: "Edge Rendering Pipeline",
    desc: "VR frames are rendered on edge servers <10ms away, compressed via H.265/AV1, and streamed over WebRTC data channels to minimize round-trip latency below the 20ms motion-sickness threshold.",
  },
  {
    icon: <Shield className="w-5 h-5 text-neon" />,
    title: "DTLS Encryption Layer",
    desc: "All sensor and video data is encrypted with DTLS 1.3 in-transit. Session keys rotate every 60 seconds. Biometric head-tracking data is classified as PII under GDPR.",
  },
  {
    icon: <Wifi className="w-5 h-5 text-neon" />,
    title: "Protocol Stack",
    desc: "Upstream: UDP with custom reliability layer for sensor data. Downstream: QUIC/WebRTC for adaptive bitrate video. Fallback: TCP with Nagle disabled for control plane signaling.",
  },
];

type Tab = "model" | "system";

const VRHeadsetViewer = () => {
  const [activeTab, setActiveTab] = useState<Tab>("model");
  const [selectedComponent, setSelectedComponent] = useState<ComponentData | null>(null);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  const activeSpot = hotspots.find((h) => h.id === activeHotspot);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h3 className="font-display text-xl font-bold text-foreground mb-1">
          VR Headset – Networking Anatomy
        </h3>
        <p className="text-sm text-muted-foreground font-mono">
          How every component connects to the network stack
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2">
        {([
          { key: "model" as Tab, label: "3D Hardware View", icon: <Glasses className="w-4 h-4" /> },
          { key: "system" as Tab, label: "Network Architecture", icon: <Cpu className="w-4 h-4" /> },
        ]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setSelectedComponent(null); setActiveHotspot(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-mono transition-all border ${
              activeTab === tab.key
                ? "bg-primary/20 border-primary text-foreground neon-border"
                : "border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {activeTab === "model" ? (
          <motion.div
            key="model"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* Sketchfab with Hotspot Overlays */}
            <div className="relative rounded-xl overflow-hidden border border-border neon-border">
              <iframe
                title="Samsung Gear VR"
                className="w-full"
                style={{ height: 500 }}
                src="https://sketchfab.com/models/55a9b75a90ad4b65891668d850a8dd36/embed?autostart=1&ui_theme=dark"
                frameBorder="0"
                allow="autoplay; fullscreen; xr-spatial-tracking"
                allowFullScreen
              />

              {/* Hotspot Buttons */}
              {hotspots.map((spot) => (
                <motion.button
                  key={spot.id}
                  className={`absolute z-20 group`}
                  style={{ top: spot.top, left: spot.left }}
                  onClick={() => setActiveHotspot(activeHotspot === spot.id ? null : spot.id)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {/* Ping animation ring */}
                  <span className="absolute inset-0 rounded-full bg-neon/30 animate-ping" />
                  {/* Inner dot */}
                  <span
                    className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                      activeHotspot === spot.id
                        ? "bg-primary border-primary text-primary-foreground scale-110 shadow-lg shadow-primary/50"
                        : "bg-background/80 backdrop-blur-sm border-border text-foreground hover:border-primary"
                    }`}
                  >
                    {spot.icon}
                  </span>
                  {/* Tooltip label */}
                  <span className="absolute left-1/2 -translate-x-1/2 -top-8 text-[10px] font-mono bg-background/90 backdrop-blur-sm text-foreground px-2 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-border">
                    {spot.title}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Hotspot Detail Panel */}
            <AnimatePresence>
              {activeSpot && (
                <motion.div
                  className="glass-card neon-border p-5 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${activeSpot.color} flex items-center justify-center text-white`}>
                      {activeSpot.icon}
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-foreground">{activeSpot.title}</h4>
                      <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        {activeSpot.protocol}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{activeSpot.networkRole}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Networking Insight Cards */}
            <div>
              <h4 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Move3D className="w-5 h-5 text-neon" />
                Networking Deep Dive
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {networkingInsights.map((item, i) => (
                  <motion.div
                    key={item.title}
                    className="glass-card p-4 rounded-xl border border-border"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {item.icon}
                      <h5 className="font-display font-bold text-foreground text-sm">{item.title}</h5>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="system"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            <p className="text-sm text-muted-foreground">
              Click each node to explore the VR networking system architecture
            </p>

            <VRHeadset3D onComponentSelect={setSelectedComponent} />

            <AnimatePresence>
              {selectedComponent && (
                <motion.div
                  className="glass-card neon-border p-5 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <h4 className="font-display font-bold text-gradient-neon text-lg mb-2">
                    {selectedComponent.fullName}
                  </h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {selectedComponent.desc}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VRHeadsetViewer;
