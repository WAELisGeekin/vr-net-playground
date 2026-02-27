import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, ChevronDown } from "lucide-react";

const questions = [
  {
    q: "Why is latency more critical in VR than video streaming?",
    a: "In video streaming, buffering compensates for latency — you can pre-load seconds of video. In VR, the rendered frame must match your exact head position at the moment of display. Even 20ms delay between head movement and visual update causes vestibular-ocular conflict, leading to motion sickness. The brain expects zero delay between movement and vision, making VR latency requirements 10-50x more stringent than video streaming.",
  },
  {
    q: "Would TCP be suitable for real-time VR?",
    a: "TCP is unsuitable for real-time VR due to three critical issues: (1) Head-of-line blocking — if one packet is lost, all subsequent packets wait, causing frame freezes. (2) Three-way handshake adds connection setup latency. (3) Retransmission of old packets is pointless in VR since old positional data is irrelevant. UDP with custom reliability layers (like WebRTC's SCTP) provides the right balance of speed and selective reliability.",
  },
  {
    q: "How does edge computing reduce motion sickness?",
    a: "Edge computing places rendering servers physically closer to users (within 5-10ms network distance). This reduces the round-trip time for the motion-to-photon pipeline. By offloading compute-intensive rendering to nearby edge nodes instead of distant cloud data centers, the total latency drops below the critical 20ms threshold. Edge nodes can also cache predicted frames and use AI-based extrapolation to compensate for remaining network jitter.",
  },
];

const DiscussionContent = () => {
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {questions.map((item, i) => (
        <motion.div
          key={i}
          className="glass-card neon-border rounded-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
        >
          <button
            className="w-full p-5 flex items-start gap-3 text-left"
            onClick={() => setOpenQuestion(openQuestion === i ? null : i)}
          >
            <MessageSquare className="w-5 h-5 text-neon mt-0.5 flex-shrink-0" />
            <span className="font-body font-semibold text-foreground text-sm md:text-base flex-1">{item.q}</span>
            <motion.div
              animate={{ rotate: openQuestion === i ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            </motion.div>
          </button>

          <AnimatePresence>
            {openQuestion === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 pl-13 border-t border-border pt-4">
                  <p className="text-sm text-muted-foreground leading-relaxed ml-8">{item.a}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};

export default DiscussionContent;
