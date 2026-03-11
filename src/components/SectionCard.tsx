import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface SectionCardProps {
  title: string;
  icon: ReactNode;
  subtitle: string;
  children: ReactNode;
  index: number;
}

const SectionCard = ({ title, icon, subtitle, children, index }: SectionCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Card in grid */}
      <motion.div
        className="glass-card neon-border p-6 cursor-pointer group relative overflow-hidden"
        onClick={() => setIsExpanded(true)}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="absolute inset-0 bg-gradient-neon opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">
          <div className="text-3xl mb-3">{icon}</div>
          <h3 className="font-display text-lg font-bold text-foreground mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-neon/10 to-transparent" />
        <div className="absolute bottom-3 right-3 text-xs font-mono text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
          Click to explore →
        </div>
      </motion.div>

      {/* Expanded fullscreen - no layoutId, use simple animation */}
      <AnimatePresence>
        {isExpanded && (
          <>
            {/* Portal-style fullscreen overlay */}
            <motion.div
              className="fixed inset-0"
              style={{ zIndex: 99999, backgroundColor: 'hsl(260, 25%, 4%)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* Content panel */}
              <div className="absolute inset-0 overflow-y-auto bg-card">
                <div className="sticky top-0 z-10 flex items-center justify-between p-4 md:p-6 border-b border-border bg-card">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{icon}</span>
                    <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">{title}</h2>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
                    className="w-10 h-10 rounded-full flex items-center justify-center border border-border hover:bg-primary/20 transition-colors bg-card"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4 md:p-8 lg:p-12">{children}</div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default SectionCard;
