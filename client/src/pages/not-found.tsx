import { Link } from "wouter";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-parchment p-4">
      <div className="paper-card max-w-md w-full p-8 rounded-lg text-center">
        <div className="w-16 h-16 bg-blush-light/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="h-8 w-8 text-ink-light" />
        </div>

        <h1 className="text-3xl font-display text-ink mb-2 font-semibold">Page Not Found</h1>
        <p className="font-body text-ink-light mb-6 italic">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <Link href="/" className="inline-flex items-center justify-center px-6 py-3 text-sm font-ui font-bold uppercase tracking-widest rounded-lg text-parchment bg-burgundy hover:bg-burgundy-dark transition-colors duration-300">
          Return Home
        </Link>
      </div>
    </div>
  );
}
