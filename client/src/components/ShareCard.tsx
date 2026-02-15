import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Share2, Heart } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

interface ShareCardProps {
  slug: string;
  displayName: string;
}

export function ShareCard({ slug, displayName }: ShareCardProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/to/${slug}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Link Copied!",
        description: "Now go send it to your crush! 💌",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Copy failed",
        description: "Please copy the link manually.",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="paper-card p-8 rounded-lg border border-burgundy/15 bg-parchment-warm relative overflow-hidden"
      style={{ boxShadow: '0 6px 24px rgba(60, 20, 10, 0.1)' }}
    >
      {/* Decorative fold */}
      <div className="absolute top-0 right-0 w-12 h-12 bg-parchment shadow-sm -mr-6 -mt-6 rotate-45 border-b border-l border-burgundy/10" />

      <div className="text-center space-y-6 relative z-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blush-light/40 mb-2">
          <Heart className="w-8 h-8 text-burgundy" />
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-display text-ink font-semibold">It's ready, <span className="font-script text-burgundy">{displayName}</span>!</h2>
          <p className="font-body text-ink-light text-lg">
            Your unique Valentine link is active.
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-parchment border border-burgundy/10 rounded-lg flex items-center justify-between gap-3 group">
            <code className="text-sm font-mono text-burgundy truncate flex-1">
              {shareUrl}
            </code>
            <Button
              size="icon"
              variant="ghost"
              onClick={copyToClipboard}
              className="shrink-0 hover:bg-blush-light/30"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-700" />
              ) : (
                <Copy className="w-4 h-4 text-ink-light" />
              )}
            </Button>
          </div>

          <Button
            onClick={copyToClipboard}
            className="w-full h-14 wax-seal flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Copy & Share Link
          </Button>
        </div>

        <div className="vintage-divider" />

        <div className="space-y-4 text-left">
          <p className="text-xs font-ui font-bold uppercase tracking-widest text-ink-light">
            Next Steps:
          </p>
          <ul className="space-y-3 font-body text-ink-light text-sm">
            <li className="flex gap-2">
              <span className="text-burgundy font-bold font-display text-base">1.</span>
              Copy the unique link above.
            </li>
            <li className="flex gap-2">
              <span className="text-burgundy font-bold font-display text-base">2.</span>
              Send it to your crush via DM, story, or bio.
            </li>
            <li className="flex gap-2">
              <span className="text-burgundy font-bold font-display text-base">3.</span>
              Wait for them to open it and share their heart.
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
