import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, UserX, Zap, Eye } from "lucide-react";

const threats = [
  { id: "encrypt", icon: <Lock className="w-5 h-5" />, label: "Encryption", desc: "VR data streams must be encrypted end-to-end. DTLS (Datagram TLS) over UDP protects real-time data without significant latency overhead. AES-256-GCM provides authenticated encryption for both position data and rendered frames." },
  { id: "auth", icon: <Shield className="w-5 h-5" />, label: "Identity Auth", desc: "Biometric authentication through VR headsets (iris scanning, gesture patterns). OAuth 2.0 tokens for session management. Device attestation ensures only authorized hardware connects to VR servers." },
  { id: "ddos", icon: <Zap className="w-5 h-5" />, label: "DDoS in VR", desc: "DDoS attacks on VR servers cause complete immersion failure. Rate limiting, geo-distributed edge nodes, and AI-powered traffic analysis protect against volumetric attacks. SYN flood protection is critical for session establishment." },
  { id: "mitm", icon: <UserX className="w-5 h-5" />, label: "Man-in-the-Middle", desc: "Attackers intercepting VR data can manipulate spatial data, inject false objects, or harvest biometric information. Certificate pinning and mutual TLS prevent MITM attacks on VR data streams." },
  { id: "privacy", icon: <Eye className="w-5 h-5" />, label: "Privacy Risks", desc: "VR headsets collect eye tracking, body movement, room mapping, and biometric data. GDPR compliance requires data minimization. Local processing preferred over cloud for sensitive biometric data." },
];

const SecurityContent = () => {
  const [activeThreat, setActiveThreat] = useState<string | null>(null);
  const active = threats.find(t => t.id === activeThreat);

  return (
    <div className="space-y-8">
      <p className="text-muted-foreground">
        VR introduces unique security challenges due to the volume and sensitivity of data transmitted. Click each threat to explore.
      </p>

      {/* Shield + threats as a simple grid instead of rotating animation */}
      <div className="flex justify-center mb-4">
        <div className="w-20 h-20 rounded-full border-2 border-neon/30 flex items-center justify-center neon-glow">
          <Shield className="w-10 h-10 text-neon" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {threats.map((threat) => (
          <button
            key={threat.id}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300 ${
              activeThreat === threat.id ? "bg-primary/10 neon-border neon-glow" : "glass-card border border-border hover:border-neon/30"
            }`}
            onClick={() => setActiveThreat(activeThreat === threat.id ? null : threat.id)}
          >
            <span className={activeThreat === threat.id ? "text-primary" : "text-muted-foreground"}>{threat.icon}</span>
            <span className="text-xs font-mono text-center">{threat.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="glass-card neon-border p-6 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="text-neon">{active.icon}</div>
              <h4 className="font-display font-bold text-foreground">{active.label}</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{active.desc}</p>

            {active.id === "mitm" && (
              <div className="mt-4 bg-muted rounded-lg p-4">
                <p className="text-xs font-mono text-muted-foreground mb-2">Visual: MITM Attack</p>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded">User</span>
                  <span className="text-muted-foreground">→ data →</span>
                  <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded">⚠ Attacker</span>
                  <span className="text-muted-foreground">→ data →</span>
                  <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded">Server</span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SecurityContent;
