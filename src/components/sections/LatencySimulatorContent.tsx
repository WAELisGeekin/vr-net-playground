import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Gauge, Wifi, Zap, AlertTriangle, CheckCircle2, XCircle, Eye, MonitorSmartphone, Gamepad2 } from "lucide-react";

interface NetworkParams {
  latency: number;      // ms one-way
  jitter: number;       // ms variance
  packetLoss: number;   // percentage
  bandwidth: number;    // Mbps
}

const defaultParams: NetworkParams = {
  latency: 5,
  jitter: 1,
  packetLoss: 0.1,
  bandwidth: 300,
};

// Presets
const presets: { label: string; params: NetworkParams; desc: string }[] = [
  { label: "Wi-Fi 6E (Ideal)", params: { latency: 2, jitter: 0.5, packetLoss: 0.01, bandwidth: 1200 }, desc: "6GHz, dedicated AP, line-of-sight" },
  { label: "Wi-Fi 5 (Good)", params: { latency: 8, jitter: 3, packetLoss: 0.5, bandwidth: 300 }, desc: "5GHz, moderate interference" },
  { label: "Wi-Fi 4 (Poor)", params: { latency: 25, jitter: 12, packetLoss: 3, bandwidth: 50 }, desc: "2.4GHz, congested environment" },
  { label: "5G mmWave", params: { latency: 4, jitter: 2, packetLoss: 0.2, bandwidth: 800 }, desc: "Edge server, <100m from tower" },
  { label: "4G LTE", params: { latency: 35, jitter: 15, packetLoss: 1, bandwidth: 30 }, desc: "Cloud VR, typical urban" },
];

function getVRQuality(p: NetworkParams) {
  const motionToPhoton = p.latency * 2 + p.jitter + 3; // rough MTP estimate
  const effectiveBw = p.bandwidth * (1 - p.packetLoss / 100);

  // Scoring
  let score = 100;
  if (motionToPhoton > 20) score -= (motionToPhoton - 20) * 3;
  if (motionToPhoton > 50) score -= 20;
  if (p.packetLoss > 1) score -= p.packetLoss * 8;
  if (p.packetLoss > 5) score -= 20;
  if (effectiveBw < 150) score -= (150 - effectiveBw) * 0.3;
  if (effectiveBw < 50) score -= 20;
  if (p.jitter > 5) score -= (p.jitter - 5) * 2;
  score = Math.max(0, Math.min(100, score));

  const resolution = effectiveBw >= 150 ? "4K (2160p)" : effectiveBw >= 80 ? "1440p" : effectiveBw >= 40 ? "1080p" : "720p";
  const fps = motionToPhoton <= 11 ? 90 : motionToPhoton <= 16 ? 72 : motionToPhoton <= 22 ? 60 : 45;
  const sicknessProbability = motionToPhoton > 40 ? "High" : motionToPhoton > 20 ? "Moderate" : "Low";
  const timewarpActive = motionToPhoton > 15;
  const fecOverhead = p.packetLoss > 0.5 ? Math.min(30, Math.round(p.packetLoss * 5)) : 0;

  return { score, motionToPhoton, resolution, fps, sicknessProbability, timewarpActive, fecOverhead, effectiveBw };
}

const qualityColor = (score: number) =>
  score >= 80 ? "text-green-400" : score >= 50 ? "text-amber-400" : "text-destructive";

const qualityBg = (score: number) =>
  score >= 80 ? "from-green-500/20 to-emerald-500/10" : score >= 50 ? "from-amber-500/20 to-yellow-500/10" : "from-red-500/20 to-rose-500/10";

const qualityLabel = (score: number) =>
  score >= 80 ? "Excellent" : score >= 60 ? "Good" : score >= 40 ? "Degraded" : score >= 20 ? "Poor" : "Unusable";

const QualityIcon = ({ score }: { score: number }) =>
  score >= 60 ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : score >= 30 ? <AlertTriangle className="w-5 h-5 text-amber-400" /> : <XCircle className="w-5 h-5 text-destructive" />;

const LatencySimulatorContent = () => {
  const [params, setParams] = useState<NetworkParams>(defaultParams);
  const quality = useMemo(() => getVRQuality(params), [params]);

  const sliders: { key: keyof NetworkParams; label: string; unit: string; min: number; max: number; step: number; icon: React.ReactNode }[] = [
    { key: "latency", label: "Network Latency", unit: "ms", min: 1, max: 100, step: 1, icon: <Gauge className="w-4 h-4 text-primary" /> },
    { key: "jitter", label: "Jitter", unit: "ms", min: 0, max: 30, step: 0.5, icon: <Zap className="w-4 h-4 text-amber-400" /> },
    { key: "packetLoss", label: "Packet Loss", unit: "%", min: 0, max: 10, step: 0.1, icon: <AlertTriangle className="w-4 h-4 text-destructive" /> },
    { key: "bandwidth", label: "Bandwidth", unit: "Mbps", min: 10, max: 1500, step: 10, icon: <Wifi className="w-4 h-4 text-cyan-400" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Presets */}
      <div>
        <h4 className="font-display text-sm font-bold text-foreground mb-3">Network Presets</h4>
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p.label}
              onClick={() => setParams(p.params)}
              className="px-3 py-1.5 rounded-lg text-xs font-mono border border-border hover:border-primary/50 hover:bg-primary/10 transition-all text-muted-foreground hover:text-foreground"
              title={p.desc}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sliders */}
        <div className="space-y-5">
          <h4 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
            <Gauge className="w-4 h-4 text-primary" />
            Adjust Network Conditions
          </h4>
          {sliders.map((s) => (
            <div key={s.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                  {s.icon} {s.label}
                </label>
                <span className="text-xs font-mono text-foreground font-bold tabular-nums">
                  {s.key === "packetLoss" ? params[s.key].toFixed(1) : params[s.key]} {s.unit}
                </span>
              </div>
              <Slider
                value={[params[s.key]]}
                min={s.min}
                max={s.max}
                step={s.step}
                onValueChange={([v]) => setParams((prev) => ({ ...prev, [s.key]: v }))}
              />
            </div>
          ))}
        </div>

        {/* Quality Dashboard */}
        <div className="space-y-4">
          <h4 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
            <Eye className="w-4 h-4 text-primary" />
            VR Experience Quality
          </h4>

          {/* Score Card */}
          <motion.div
            className={`rounded-xl p-5 bg-gradient-to-br ${qualityBg(quality.score)} border border-border`}
            key={quality.score}
            initial={{ scale: 0.98, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <QualityIcon score={quality.score} />
                <span className={`font-display text-2xl font-black tabular-nums ${qualityColor(quality.score)}`}>
                  {Math.round(quality.score)}
                </span>
                <span className="text-xs text-muted-foreground font-mono">/ 100</span>
              </div>
              <span className={`font-display font-bold text-sm ${qualityColor(quality.score)}`}>
                {qualityLabel(quality.score)}
              </span>
            </div>

            {/* Score bar */}
            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${
                  quality.score >= 80 ? "bg-green-500" : quality.score >= 50 ? "bg-amber-500" : "bg-destructive"
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${quality.score}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
          </motion.div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Motion-to-Photon", value: `${quality.motionToPhoton.toFixed(1)}ms`, icon: <Gauge className="w-3.5 h-3.5" />, warn: quality.motionToPhoton > 20 },
              { label: "Resolution", value: quality.resolution, icon: <MonitorSmartphone className="w-3.5 h-3.5" />, warn: quality.resolution === "720p" },
              { label: "Frame Rate", value: `${quality.fps} fps`, icon: <Eye className="w-3.5 h-3.5" />, warn: quality.fps < 72 },
              { label: "Motion Sickness", value: quality.sicknessProbability, icon: <AlertTriangle className="w-3.5 h-3.5" />, warn: quality.sicknessProbability !== "Low" },
              { label: "TimeWarp Active", value: quality.timewarpActive ? "Yes" : "No", icon: <Zap className="w-3.5 h-3.5" />, warn: quality.timewarpActive },
              { label: "FEC Overhead", value: `${quality.fecOverhead}%`, icon: <Wifi className="w-3.5 h-3.5" />, warn: quality.fecOverhead > 10 },
            ].map((m) => (
              <div
                key={m.label}
                className={`glass-card rounded-lg p-3 border ${m.warn ? "border-amber-500/30" : "border-border"}`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={m.warn ? "text-amber-400" : "text-muted-foreground"}>{m.icon}</span>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase">{m.label}</span>
                </div>
                <span className={`font-mono text-sm font-bold ${m.warn ? "text-amber-400" : "text-foreground"}`}>
                  {m.value}
                </span>
              </div>
            ))}
          </div>

          {/* Adaptive Explanation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={qualityLabel(quality.score)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="glass-card rounded-lg p-3 border border-border"
            >
              <p className="text-xs text-muted-foreground leading-relaxed font-mono">
                {quality.score >= 80
                  ? "✅ Network conditions support full-quality VR streaming. No perceptible latency, full resolution, and smooth 90fps rendering with no reprojection needed."
                  : quality.score >= 50
                  ? "⚠️ Degraded experience. Adaptive bitrate is reducing resolution, TimeWarp reprojection is compensating for late frames, and FEC is adding overhead to recover lost packets."
                  : "🚨 Critical: Motion-to-photon latency exceeds the 20ms threshold. Users will experience motion sickness, visual artifacts, and frame drops. VR streaming is not viable under these conditions."}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* VR Use Case Impact */}
      <div>
        <h4 className="font-display text-sm font-bold text-foreground mb-3 flex items-center gap-2">
          <Gamepad2 className="w-4 h-4 text-primary" />
          Impact by VR Application
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              app: "Beat Saber (Rhythm)",
              requirement: "< 15ms MTP, < 1% loss",
              viable: quality.motionToPhoton < 15 && params.packetLoss < 1,
              reason: "Timing-critical hit detection requires near-zero latency",
            },
            {
              app: "VRChat (Social)",
              requirement: "< 30ms MTP, > 50 Mbps",
              viable: quality.motionToPhoton < 30 && quality.effectiveBw > 50,
              reason: "Avatar sync tolerates some latency; bandwidth needed for voice + world",
            },
            {
              app: "Surgery Simulation",
              requirement: "< 10ms MTP, 0% loss",
              viable: quality.motionToPhoton < 10 && params.packetLoss < 0.1,
              reason: "Haptic feedback and precision demand hospital-grade networking",
            },
          ].map((app) => (
            <motion.div
              key={app.app}
              className={`glass-card rounded-xl p-4 border transition-colors ${
                app.viable ? "border-green-500/30" : "border-destructive/30"
              }`}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-display text-sm font-bold text-foreground">{app.app}</h5>
                {app.viable ? (
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-destructive" />
                )}
              </div>
              <p className="text-[10px] font-mono text-primary mb-1">{app.requirement}</p>
              <p className="text-xs text-muted-foreground">{app.reason}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LatencySimulatorContent;
