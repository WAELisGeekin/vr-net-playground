import { Monitor, Smartphone } from "lucide-react";

interface PresentationToggleProps {
  isPresentation: boolean;
  onToggle: () => void;
}

const PresentationToggle = ({ isPresentation, onToggle }: PresentationToggleProps) => {
  return (
    <button
      onClick={onToggle}
      className={`glass-card neon-border px-3 py-1.5 rounded-full text-xs font-mono flex items-center gap-1.5 transition-all duration-300 ${
        isPresentation ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
      aria-label="Toggle presentation mode"
    >
      {isPresentation ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
      <span>{isPresentation ? "Presenting" : "Present"}</span>
    </button>
  );
};

export default PresentationToggle;
