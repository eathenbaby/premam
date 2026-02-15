import { Link, useLocation } from "wouter";
import { Heart, Mail, PenTool, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/90 backdrop-blur-md border border-stone-200 shadow-xl rounded-full px-6 py-3 flex items-center gap-6 md:bottom-auto md:top-6">
      <Link href="/" className={cn(
        "flex flex-col items-center gap-1 transition-colors hover:text-rose-700",
        location === "/" ? "text-rose-700" : "text-stone-500"
      )}>
        <Heart className="w-5 h-5" />
        <span className="text-[10px] font-ui uppercase tracking-widest font-bold">Home</span>
      </Link>

      <div className="w-px h-8 bg-stone-200" />

      <Link href="/feed" className={cn(
        "flex flex-col items-center gap-1 transition-colors hover:text-rose-700",
        location === "/feed" ? "text-rose-700" : "text-stone-500"
      )}>
        <Sparkles className="w-5 h-5" />
        <span className="text-[10px] font-ui uppercase tracking-widest font-bold">Feed</span>
      </Link>

      <div className="w-px h-8 bg-stone-200" />

      <Link href="/inbox" className={cn(
        "flex flex-col items-center gap-1 transition-colors hover:text-rose-700",
        location.startsWith("/inbox") ? "text-rose-700" : "text-stone-500"
      )}>
        <Mail className="w-5 h-5" />
        <span className="text-[10px] font-ui uppercase tracking-widest font-bold">Inbox</span>
      </Link>
    </nav>
  );
}
