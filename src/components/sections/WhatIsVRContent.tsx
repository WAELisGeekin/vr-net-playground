import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VRHeadset3D, { type ComponentData } from "@/components/VRHeadset3D";
import VRHeadsetViewer from "@/components/VRHeadsetViewer";

const comparisons = [
  { type: "VR", desc: "Fully immersive digital environment. User is completely surrounded by virtual world." },
  { type: "AR", desc: "Digital overlays on real world. Physical environment remains visible with added digital elements." },
  { type: "MR", desc: "Digital objects interact with physical world. Virtual and real elements coexist and react to each other." },
];

const WhatIsVRContent = () => {
  const [selectedComponent, setSelectedComponent] = useState<ComponentData | null>(null);

  return (
    <div className="space-y-10">
      <div>
        <h3 className="font-display text-xl font-bold text-foreground mb-3">Definition</h3>
        <p className="text-muted-foreground leading-relaxed">
          Virtual Reality is a computer-generated simulation of a three-dimensional environment that can be interacted with using specialized electronic equipment.
          It creates an immersive experience by replacing the real world with a simulated one, requiring ultra-low latency network communication for multi-user scenarios.
        </p>
      </div>

      <div>
        <h3 className="font-display text-xl font-bold text-foreground mb-4">VR vs AR vs MR</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {comparisons.map((item) => (
            <div key={item.type} className="glass-card p-5 rounded-xl border border-border">
              <h4 className="font-display text-lg font-bold text-gradient-neon mb-2">{item.type}</h4>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-display text-xl font-bold text-foreground mb-4">Interactive VR System</h3>
        <p className="text-sm text-muted-foreground mb-4">Click each component node in the 3D scene to learn more</p>
        
        <VRHeadset3D onComponentSelect={setSelectedComponent} />

        <AnimatePresence>
          {selectedComponent && (
            <motion.div
              className="mt-6 glass-card neon-border p-6 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <h4 className="font-display font-bold text-gradient-neon text-lg mb-2">{selectedComponent.fullName}</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">{selectedComponent.desc}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <VRHeadsetViewer />
    </div>
  );
};

export default WhatIsVRContent;
