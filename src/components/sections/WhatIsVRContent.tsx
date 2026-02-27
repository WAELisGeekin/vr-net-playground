import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const vrComponents = [
  { id: "hmd", label: "HMD", fullName: "Head-Mounted Display", x: 50, y: 15, desc: "Dual-lens stereoscopic display worn on the head. Renders separate images for each eye at 90-120Hz to create depth perception. Resolution of 2K-4K per eye." },
  { id: "sensors", label: "Sensors", fullName: "Motion Sensors", x: 15, y: 50, desc: "IMU (Inertial Measurement Unit) combining accelerometer, gyroscope, and magnetometer. Tracks head orientation at 1000Hz for sub-millimeter accuracy." },
  { id: "tracking", label: "Tracking", fullName: "Positional Tracking", x: 85, y: 50, desc: "Inside-out or outside-in camera-based tracking system. Maps physical space using SLAM algorithms. 6DoF (6 Degrees of Freedom) tracking for full movement." },
  { id: "render", label: "Engine", fullName: "Rendering Engine", x: 50, y: 85, desc: "GPU-intensive pipeline rendering stereo frames at 90fps minimum. Uses techniques like foveated rendering, ASW (Asynchronous SpaceWarp) to maintain framerate." },
];

const comparisons = [
  { type: "VR", desc: "Fully immersive digital environment. User is completely surrounded by virtual world.", color: "neon" },
  { type: "AR", desc: "Digital overlays on real world. Physical environment remains visible with added digital elements.", color: "neon-secondary" },
  { type: "MR", desc: "Digital objects interact with physical world. Virtual and real elements coexist and react to each other.", color: "neon-glow" },
];

const WhatIsVRContent = () => {
  const [activeComponent, setActiveComponent] = useState<string | null>(null);
  const active = vrComponents.find(c => c.id === activeComponent);

  return (
    <div className="space-y-10">
      {/* Definition */}
      <div>
        <h3 className="font-display text-xl font-bold text-foreground mb-3">Definition</h3>
        <p className="text-muted-foreground leading-relaxed">
          Virtual Reality is a computer-generated simulation of a three-dimensional environment that can be interacted with using specialized electronic equipment.
          It creates an immersive experience by replacing the real world with a simulated one, requiring ultra-low latency network communication for multi-user scenarios.
        </p>
      </div>

      {/* VR vs AR vs MR */}
      <div>
        <h3 className="font-display text-xl font-bold text-foreground mb-4">VR vs AR vs MR</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {comparisons.map((item) => (
            <motion.div
              key={item.type}
              className="glass-card p-5 rounded-xl border border-border"
              whileHover={{ scale: 1.03 }}
            >
              <h4 className="font-display text-lg font-bold text-gradient-neon mb-2">{item.type}</h4>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Interactive VR System Diagram */}
      <div>
        <h3 className="font-display text-xl font-bold text-foreground mb-4">VR System Components</h3>
        <p className="text-sm text-muted-foreground mb-6">Click each component to learn more</p>

        <div className="relative w-full aspect-square max-w-lg mx-auto">
          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            {vrComponents.map((comp, i) => {
              const next = vrComponents[(i + 1) % vrComponents.length];
              return (
                <motion.line
                  key={comp.id}
                  x1={comp.x} y1={comp.y} x2={next.x} y2={next.y}
                  stroke="hsl(var(--neon))"
                  strokeWidth="0.3"
                  strokeDasharray="2 2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: i * 0.3 }}
                />
              );
            })}
          </svg>

          {/* Nodes */}
          {vrComponents.map((comp) => (
            <motion.button
              key={comp.id}
              className={`absolute w-20 h-20 -ml-10 -mt-10 rounded-full flex flex-col items-center justify-center text-xs font-mono transition-all duration-300 ${
                activeComponent === comp.id
                  ? "bg-primary text-primary-foreground neon-glow scale-110"
                  : "glass-card neon-border text-foreground hover:neon-glow"
              }`}
              style={{ left: `${comp.x}%`, top: `${comp.y}%` }}
              onClick={() => setActiveComponent(activeComponent === comp.id ? null : comp.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="font-bold text-[10px]">{comp.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Component detail */}
        <AnimatePresence>
          {active && (
            <motion.div
              className="mt-6 glass-card neon-border p-6 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <h4 className="font-display font-bold text-gradient-neon text-lg mb-2">{active.fullName}</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">{active.desc}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WhatIsVRContent;
