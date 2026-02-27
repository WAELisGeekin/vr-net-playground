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

      {/* Shield visualization */}
      <div className="relative flex justify-center py-8">
        <motion.div
          className="w-40 h-40 rounded-full border-2 border-neon/30 flex items-center justify-center"
          animate={{ boxShadow: ["0 0 20px hsl(270 100% 65% / 0.1)", "0 0 40px hsl(270 100% 65% / 0.3)", "0 0 20px hsl(270 100% 65% / 0.1)"] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <motion.div
            className="w-28 h-28 rounded-full border border-neon/50 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Shield className="w-12 h-12 text-neon" />
          </motion.div>
        </motion.div>

        {/* Threat icons around shield */}
        {threats.map((threat, i) => {
          const angle = (i * 72 - 90) * (Math.PI / 180);
          const radius = 110;
          return (
            <motion.button
              key={threat.id}
              className={`absolute w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                activeThreat === threat.id ? "bg-primary text-primary-foreground neon-glow" : "glass-card neon-border text-foreground"
              }`}
              style={{
                left: `calc(50% + ${Math.cos(angle) * radius}px - 24px)`,
                top: `calc(50% + ${Math.sin(angle) * radius}px - 24px + 32px)`,
              }}
              onClick={() => setActiveThreat(activeThreat === threat.id ? null : threat.id)}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              {threat.icon}
            </motion.button>
          );
        })}
      </div>

      {/* Detail */}
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
                  <motion.div animate={{ x: [-10, 10, -10] }} transition={{ duration: 1, repeat: Infinity }}>
                    <span className="text-muted-foreground">→ data →</span>
                  </motion.div>
                  <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded">⚠ Attacker</span>
                  <motion.div animate={{ x: [-10, 10, -10] }} transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}>
                    <span className="text-muted-foreground">→ data →</span>
                  </motion.div>
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
