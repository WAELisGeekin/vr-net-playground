import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Glasses, Smartphone, HardDrive, Hand, Activity, Cpu, Eye, Move3D } from "lucide-react";
import VRHeadset3D, { type ComponentData } from "@/components/VRHeadset3D";

const physicalComponents = [
  { icon: <Eye className="w-5 h-5 text-neon" />, title: "Lenses", desc: "Dual convex lenses that focus and reshape the display image for each eye, creating stereoscopic 3D depth perception." },
  { icon: <Smartphone className="w-5 h-5 text-neon" />, title: "Smartphone Display", desc: "A high-resolution smartphone screen serves as the visual output, split into two halves for left and right eye views." },
  { icon: <HardDrive className="w-5 h-5 text-neon" />, title: "Head Strap", desc: "Adjustable elastic straps distribute weight evenly across the head for comfortable, hands-free extended use." },
  { icon: <Hand className="w-5 h-5 text-neon" />, title: "Touchpad Controls", desc: "A side-mounted capacitive touchpad allows navigation, selection, and gesture-based interaction within VR experiences." },
  { icon: <Activity className="w-5 h-5 text-neon" />, title: "Motion Sensors", desc: "Built-in accelerometer, gyroscope, and proximity sensors track head orientation and movement for responsive VR rendering." },
];

type Tab = "model" | "system";

const VRHeadsetViewer = () => {
  const [activeTab, setActiveTab] = useState<Tab>("model");
  const [selectedComponent, setSelectedComponent] = useState<ComponentData | null>(null);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h3 className="font-display text-xl font-bold text-foreground mb-1">
          Interactive VR Headset – Samsung Gear VR
        </h3>
        <p className="text-sm text-muted-foreground font-mono">
          Explore the hardware and system architecture
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2">
        {([
          { key: "model" as Tab, label: "3D Model", icon: <Glasses className="w-4 h-4" /> },
          { key: "system" as Tab, label: "System Architecture", icon: <Cpu className="w-4 h-4" /> },
        ]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setSelectedComponent(null); }}
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
            {/* Sketchfab Embed */}
            <div className="rounded-xl overflow-hidden border border-border neon-border">
              <iframe
                title="Samsung Gear VR"
                className="w-full"
                style={{ height: 500 }}
                src="https://sketchfab.com/models/55a9b75a90ad4b65891668d850a8dd36/embed?autostart=1&ui_theme=dark"
                frameBorder="0"
                allow="autoplay; fullscreen; xr-spatial-tracking"
                allowFullScreen
              />
            </div>

            {/* Physical Component Cards */}
            <div>
              <h4 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Move3D className="w-5 h-5 text-neon" />
                Key Physical Components
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {physicalComponents.map((item, i) => (
                  <motion.div
                    key={item.title}
                    className="glass-card p-4 rounded-xl border border-border"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
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
              Click each component node in the 3D scene to learn about the system architecture
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
