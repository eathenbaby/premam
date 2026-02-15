import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FlowerCardProps {
  id: string;
  name: string;
  image: string;
  selected?: boolean;
  onClick?: () => void;
}

export function FlowerCard({ id, name, image, selected, onClick }: FlowerCardProps) {
  return (
    <motion.button
      whileHover={{ y: -4, rotate: 1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onClick={onClick}
      className={cn(
        "group relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-400",
        selected
          ? "border-burgundy shadow-lg bg-blush-light/30"
          : "border-burgundy/10 hover:border-burgundy/25 bg-parchment-warm"
      )}
      style={{
        boxShadow: selected
          ? '0 6px 20px rgba(107, 15, 26, 0.2)'
          : '0 2px 8px rgba(60, 20, 10, 0.06)',
      }}
    >
      <div className="absolute inset-0 p-3 flex items-center justify-center">
        <div className="w-full h-full rounded-md overflow-hidden bg-parchment-aged relative">
             <img
               src={image}
               alt={name}
               className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
             />
             {/* Vintage overlay */}
             <div className="absolute inset-0 bg-gradient-to-t from-amber-900/10 to-transparent pointer-events-none mix-blend-multiply" />
        </div>
      </div>

      <div className={cn(
        "absolute bottom-0 left-0 right-0 p-2 text-center transition-transform duration-400",
        selected ? "translate-y-0" : "translate-y-full group-hover:translate-y-0"
      )}>
        <span className="inline-block px-3 py-1 bg-parchment-warm/95 text-xs font-ui font-bold uppercase tracking-wider rounded-md shadow-sm text-ink border border-burgundy/10">
          {name}
        </span>
      </div>

      {selected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-burgundy rounded-full flex items-center justify-center text-parchment shadow-md animate-in fade-in zoom-in duration-300">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      )}
    </motion.button>
  );
}
