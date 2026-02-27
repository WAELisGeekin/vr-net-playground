import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const metrics = [
  { label: "Latency", value: 15, max: 100, unit: "ms", target: "<20ms", desc: "Time from user action to visual response. Must be under 20ms to prevent motion sickness. Known as motion-to-photon latency.", color: "from-green-400 to-emerald-500" },
  { label: "Bandwidth", value: 75, max: 100, unit: "Mbps", target: ">50Mbps", desc: "Data throughput required for streaming high-resolution stereo video. 4K per eye at 90fps requires significant bandwidth.", color: "from-blue-400 to-cyan-500" },
  { label: "Throughput", value: 60, max: 100, unit: "%", target: ">95%", desc: "Actual data delivery rate. Must maintain consistent throughput to avoid frame drops and visual artifacts.", color: "from-violet-400 to-purple-500" },
  { label: "Jitter", value: 8, max: 50, unit: "ms", target: "<5ms", desc: "Variation in packet arrival time. High jitter causes visual stuttering and prediction errors in head tracking.", color: "from-amber-400 to-orange-500" },
  { label: "Packet Loss", value: 2, max: 10, unit: "%", target: "<1%", desc: "Percentage of lost data packets. Even 1% loss can cause visible artifacts in rendered frames.", color: "from-red-400 to-rose-500" },
];

const NetworkRequirementsContent = () => {
  const [activeMetric, setActiveMetric] = useState<number | null>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8">
      <p className="text-muted-foreground leading-relaxed">
        VR demands the most stringent network performance of any consumer application. Here are the critical metrics:
      </p>

      {/* Gauges */}
      <div className="space-y-6">
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            className={`glass-card p-5 rounded-xl cursor-pointer transition-all duration-300 ${
              activeMetric === i ? "neon-border neon-glow" : "border border-border"
            }`}
            onClick={() => setActiveMetric(activeMetric === i ? null : i)}
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="font-display font-bold text-foreground">{metric.label}</span>
                <span className="font-mono text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  Target: {metric.target}
                </span>
              </div>
              <span className="font-mono text-sm font-bold text-foreground">
                {metric.value}{metric.unit}
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${metric.color}`}
                initial={{ width: 0 }}
                animate={{ width: animated ? `${(metric.value / metric.max) * 100}%` : 0 }}
                transition={{ duration: 1.5, delay: i * 0.2, ease: "easeOut" }}
              />
            </div>

            {/* Expanded desc */}
            {activeMetric === i && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 pt-4 border-t border-border"
              >
                <p className="text-sm text-muted-foreground leading-relaxed">{metric.desc}</p>

                {metric.label === "Latency" && (
                  <div className="mt-4">
                    <h4 className="font-display text-sm font-bold text-foreground mb-2">Motion-to-Photon Pipeline</h4>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                      {["Head Movement", "→", "Sensor Read (1ms)", "→", "Network (5ms)", "→", "Compute (5ms)", "→", "Render (4ms)", "→", "Display (5ms)"].map((step, j) => (
                        <motion.span
                          key={j}
                          className={step === "→" ? "text-neon" : "bg-muted px-2 py-1 rounded text-muted-foreground"}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: j * 0.1 }}
                        >
                          {step}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default NetworkRequirementsContent;
