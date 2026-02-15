import { Link } from "wouter";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-paper p-4">
      <div className="paper-card max-w-md w-full p-8 rounded-lg text-center">
        <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="h-8 w-8 text-stone-400" />
        </div>
        
        <h1 className="text-3xl font-display text-ink mb-2">Page Not Found</h1>
        <p className="font-body text-stone-500 mb-6">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <Link href="/" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-ui font-bold uppercase tracking-widest rounded-full text-white bg-rose-900 hover:bg-rose-800 transition-colors">
          Return Home
        </Link>
      </div>
    </div>
  );
}
