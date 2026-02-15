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
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-3 p-6 rounded-xl border transition-all duration-300",
        selected 
          ? "bg-rose-50 border-rose-200 shadow-md shadow-rose-100" 
          : "bg-white border-stone-200 hover:border-stone-300 hover:shadow-sm"
      )}
    >
      <div className={cn(
        "w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300",
        selected ? "bg-rose-100 text-rose-600" : "bg-stone-100 text-stone-500 group-hover:bg-stone-200"
      )}>
        <Icon className="w-6 h-6" />
      </div>
      <span className={cn(
        "font-display text-lg font-medium",
        selected ? "text-rose-900" : "text-stone-600"
      )}>
        {label}
      </span>
    </motion.button>
  );
}
