import { Link, useLocation } from "wouter";
import { Heart, Mail, Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

export function Navigation() {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-parchment-warm/95 backdrop-blur-sm border border-burgundy/10 shadow-lg rounded-lg px-6 py-3 flex items-center gap-6 md:bottom-auto md:top-6"
      style={{ boxShadow: '0 4px 20px rgba(60, 20, 10, 0.12)' }}
    >
      <Link href="/" className={cn(
        "flex flex-col items-center gap-1 transition-colors duration-300 hover:text-burgundy",
        location === "/" ? "text-burgundy" : "text-ink-light"
      )}>
        <Heart className="w-5 h-5" />
        <span className="text-[10px] font-ui uppercase tracking-widest font-bold">Home</span>
      </Link>

      <div className="w-px h-8 bg-burgundy/10" />

      <Link href="/feed" className={cn(
        "flex flex-col items-center gap-1 transition-colors duration-300 hover:text-burgundy",
        location === "/feed" ? "text-burgundy" : "text-ink-light"
      )}>
        <Sparkles className="w-5 h-5" />
        <span className="text-[10px] font-ui uppercase tracking-widest font-bold">Feed</span>
      </Link>

      <div className="w-px h-8 bg-burgundy/10" />

      <Link href="/inbox" className={cn(
        "flex flex-col items-center gap-1 transition-colors duration-300 hover:text-burgundy",
        location.startsWith("/inbox") ? "text-burgundy" : "text-ink-light"
      )}>
        <Mail className="w-5 h-5" />
        <span className="text-[10px] font-ui uppercase tracking-widest font-bold">Inbox</span>
      </Link>

      <div className="w-px h-8 bg-burgundy/10" />

      <Link href="/auth" className={cn(
        "flex flex-col items-center gap-1 transition-colors duration-300 hover:text-burgundy relative",
        location === "/auth" ? "text-burgundy" : "text-ink-light"
      )}>
        {isAuthenticated ? (
          <div className="w-5 h-5 bg-burgundy rounded-full flex items-center justify-center text-[10px] font-bold text-parchment">
            {user!.fullName.charAt(0).toUpperCase()}
          </div>
        ) : (
          <User className="w-5 h-5" />
        )}
        <span className="text-[10px] font-ui uppercase tracking-widest font-bold">
          {isAuthenticated ? "You" : "Login"}
        </span>
      </Link>
    </nav>
  );
}
