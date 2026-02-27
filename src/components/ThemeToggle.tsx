import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

const ThemeToggle = ({ isDark, onToggle }: ThemeToggleProps) => {
  return (
    <button
      onClick={onToggle}
      className="relative w-14 h-7 rounded-full glass-card neon-border p-0.5 transition-all duration-300"
      aria-label="Toggle theme"
    >
      <motion.div
        className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
        animate={{ x: isDark ? 0 : 26 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {isDark ? (
          <Moon className="w-3.5 h-3.5 text-primary-foreground" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-primary-foreground" />
        )}
      </motion.div>
    </button>
  );
};

export default ThemeToggle;
