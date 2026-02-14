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
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "group relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300",
        selected 
          ? "border-rose-500 shadow-lg shadow-rose-500/20 bg-rose-50" 
          : "border-transparent hover:border-stone-300 bg-white"
      )}
    >
      <div className="absolute inset-0 p-4 flex items-center justify-center">
        {/* Using a placeholder visual if image fails or for stylistic consistency */}
        <div className="w-full h-full rounded-lg overflow-hidden bg-stone-100 relative">
             <img 
               src={image} 
               alt={name}
               className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
             />
             {/* Texture overlay */}
             <div className="absolute inset-0 bg-gradient-to-t from-stone-900/10 to-transparent pointer-events-none" />
        </div>
      </div>
      
      <div className={cn(
        "absolute bottom-0 left-0 right-0 p-2 text-center transition-transform duration-300",
        selected ? "translate-y-0" : "translate-y-full group-hover:translate-y-0"
      )}>
        <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur text-xs font-ui font-bold uppercase tracking-wider rounded-full shadow-sm text-stone-800">
          {name}
        </span>
      </div>

      {selected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-md animate-in fade-in zoom-in duration-200">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      )}
    </motion.button>
  );
}
