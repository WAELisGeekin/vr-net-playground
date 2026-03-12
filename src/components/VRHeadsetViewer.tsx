import { motion } from "framer-motion";
import { Glasses, Smartphone, HardDrive, Hand, Activity } from "lucide-react";

const components = [
  { icon: <Glasses className="w-5 h-5 text-neon" />, title: "Lenses", desc: "Dual convex lenses that focus and reshape the display image for each eye, creating stereoscopic 3D depth perception." },
  { icon: <Smartphone className="w-5 h-5 text-neon" />, title: "Smartphone Display", desc: "A high-resolution smartphone screen serves as the visual output, split into two halves for left and right eye views." },
  { icon: <HardDrive className="w-5 h-5 text-neon" />, title: "Head Strap", desc: "Adjustable elastic straps distribute weight evenly across the head for comfortable, hands-free extended use." },
  { icon: <Hand className="w-5 h-5 text-neon" />, title: "Touchpad Controls", desc: "A side-mounted capacitive touchpad allows navigation, selection, and gesture-based interaction within VR experiences." },
  { icon: <Activity className="w-5 h-5 text-neon" />, title: "Motion Sensors", desc: "Built-in accelerometer, gyroscope, and proximity sensors track head orientation and movement for responsive VR rendering." },
];

const VRHeadsetViewer = () => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-display text-xl font-bold text-foreground mb-2">
          Interactive VR Headset – Samsung Gear VR
        </h3>
        <p className="text-sm text-muted-foreground mb-4 font-mono">
          Rotate, zoom, and inspect the 3D model below
        </p>
      </div>

      <div className="rounded-xl overflow-hidden border border-border neon-border">
        <iframe
          title="Samsung Gear VR"
          className="w-full"
          style={{ height: 600 }}
          src="https://sketchfab.com/models/55a9b75a90ad4b65891668d850a8dd36/embed?autostart=1&ui_theme=dark"
          frameBorder="0"
          allow="autoplay; fullscreen; xr-spatial-tracking"
          allowFullScreen
        />
      </div>

      <div>
        <h4 className="font-display text-lg font-bold text-foreground mb-4">Key Components</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {components.map((item) => (
            <motion.div
              key={item.title}
              className="glass-card p-5 rounded-xl border border-border"
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-2">
                {item.icon}
                <h5 className="font-display font-bold text-foreground">{item.title}</h5>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VRHeadsetViewer;
