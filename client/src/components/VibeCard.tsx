import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Coffee, Utensils, MessagesSquare, Mountain, Heart, Users } from "lucide-react";

interface VibeCardProps {
  vibe: string;
  label: string;
  selected?: boolean;
  onClick?: () => void;
}

const icons: Record<string, any> = {
  coffee: Coffee,
  dinner: Utensils,
  talk: MessagesSquare,
  adventure: Mountain,
  romance: Heart,
  friends: Users,
};

export function VibeCard({ vibe, label, selected, onClick }: VibeCardProps) {
  const Icon = icons[vibe] || Heart;

  return (
    <motion.button
      whileHover={{ y: -3, rotate: selected ? 0 : 1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-3 p-5 rounded-lg border transition-all duration-400 relative",
        selected
          ? "bg-blush-light/40 border-burgundy/30 shadow-md"
          : "bg-parchment border-burgundy/10 hover:border-burgundy/20 hover:shadow-sm"
      )}
      style={{
        boxShadow: selected ? '0 4px 16px rgba(60, 20, 10, 0.12)' : undefined,
      }}
    >
      <div className={cn(
        "w-11 h-11 rounded-full flex items-center justify-center transition-colors duration-400",
        selected ? "bg-burgundy/10 text-burgundy" : "bg-parchment-aged text-ink-light"
      )}>
        <Icon className="w-5 h-5" />
      </div>
      <span className={cn(
        "font-body text-sm font-medium",
        selected ? "text-burgundy-dark" : "text-ink-light"
      )}>
        {label}
      </span>
    </motion.button>
  );
}
