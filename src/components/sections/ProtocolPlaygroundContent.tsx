import { useState } from "react";
import { motion } from "framer-motion";

const ProtocolPlaygroundContent = () => {
  const [selected, setSelected] = useState<"tcp" | "udp" | null>(null);

  return (
    <div className="space-y-8">
      <p className="text-muted-foreground">
        Compare the two fundamental transport protocols and understand why VR predominantly uses UDP.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* TCP */}
        <motion.button
          className={`glass-card p-6 rounded-xl text-left transition-all duration-300 ${
            selected === "tcp" ? "neon-border neon-glow ring-2 ring-neon/30" : "border border-border"
          }`}
          onClick={() => setSelected("tcp")}
          whileHover={{ scale: 1.02 }}
        >
          <h4 className="font-display text-xl font-bold text-foreground mb-2">TCP</h4>
          <p className="text-sm text-muted-foreground mb-4">Transmission Control Protocol</p>

          {selected === "tcp" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {/* Packet animation - reliable but slow */}
              <div className="bg-muted rounded-lg p-4 overflow-hidden">
                <p className="text-xs font-mono text-muted-foreground mb-3">Packet delivery with acknowledgment:</p>
                <div className="space-y-2">
                  {[1, 2, 3].map((pkt) => (
                    <div key={pkt} className="flex items-center gap-2">
                      <motion.div
                        className="w-8 h-6 rounded bg-blue-500/80 flex items-center justify-center text-[10px] font-mono text-white"
                        animate={{ x: [0, 100, 100] }}
                        transition={{ duration: 2, delay: pkt * 0.5, repeat: Infinity, repeatDelay: 2 }}
                      >
                        P{pkt}
                      </motion.div>
                      <motion.div
                        className="text-[10px] font-mono text-green-400"
                        animate={{ opacity: [0, 0, 1] }}
                        transition={{ duration: 2, delay: pkt * 0.5 + 1, repeat: Infinity, repeatDelay: 2 }}
                      >
                        ← ACK
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>

              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Reliable delivery</li>
                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Error correction</li>
                <li className="flex items-center gap-2"><span className="text-red-400">✗</span> Higher latency (3-way handshake)</li>
                <li className="flex items-center gap-2"><span className="text-red-400">✗</span> Head-of-line blocking</li>
                <li className="flex items-center gap-2"><span className="text-red-400">✗</span> Not suitable for real-time VR</li>
              </ul>
            </motion.div>
          )}
        </motion.button>

        {/* UDP */}
        <motion.button
          className={`glass-card p-6 rounded-xl text-left transition-all duration-300 ${
            selected === "udp" ? "neon-border neon-glow ring-2 ring-neon/30" : "border border-border"
          }`}
          onClick={() => setSelected("udp")}
          whileHover={{ scale: 1.02 }}
        >
          <h4 className="font-display text-xl font-bold text-foreground mb-2">UDP</h4>
          <p className="text-sm text-muted-foreground mb-4">User Datagram Protocol</p>

          {selected === "udp" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {/* Packet animation - fast streaming */}
              <div className="bg-muted rounded-lg p-4 overflow-hidden">
                <p className="text-xs font-mono text-muted-foreground mb-3">Fast fire-and-forget streaming:</p>
                <div className="relative h-12">
                  {[0, 1, 2, 3, 4, 5].map((pkt) => (
                    <motion.div
                      key={pkt}
                      className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded bg-neon/80 flex items-center justify-center text-[10px] font-mono text-primary-foreground"
                      animate={{ x: [0, 250], opacity: [1, 1, 0.5] }}
                      transition={{ duration: 1, delay: pkt * 0.15, repeat: Infinity, repeatDelay: 0.5 }}
                    >
                      {pkt + 1}
                    </motion.div>
                  ))}
                </div>
              </div>

              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Minimal latency</li>
                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> No handshake overhead</li>
                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Perfect for real-time streaming</li>
                <li className="flex items-center gap-2"><span className="text-yellow-400">~</span> No guaranteed delivery</li>
                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Preferred for VR applications</li>
              </ul>
            </motion.div>
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default ProtocolPlaygroundContent;
