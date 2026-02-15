import { usePublicMessages, useVotes, useCastVote } from "@/hooks/use-messages";
import { useAuth } from "@/hooks/use-auth";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { Loader2, Heart, Flower, Sparkles, Send, ThumbsUp, ThumbsDown } from "lucide-react";
import { format } from "date-fns";
import { Navigation } from "@/components/Navigation";
import { cn } from "@/lib/utils";
import { GlassCard, CutesyButton } from "@/components/InteractiveComponents";

import bouquet01 from "@assets/64603-OB2R9V-578_1771092125803.jpg";
import bouquet02 from "@assets/6502939_1771092125804.jpg";
import bouquet03 from "@assets/6523075_1771092125804.jpg";
import bouquet04 from "@assets/6463769_1771092135717.jpg";
import bouquet05 from "@assets/6517084_1771092142814.jpg";
import bouquet06 from "@assets/6518416_1771092148926.jpg";

const FLOWER_IMAGES: Record<string, string> = {
  "bouquet-01": bouquet01,
  "bouquet-02": bouquet02,
  "bouquet-03": bouquet03,
  "bouquet-04": bouquet04,
  "bouquet-05": bouquet05,
  "bouquet-06": bouquet06,
};

const VIBE_LABELS: Record<string, string> = {
  chai: "☕ Chai Date",
  movie: "🎬 Movie Time",
  brunch: "🥞 Brunch",
  walk: "🌿 A Walk",
  arcade: "🕹️ Arcade Date",
  study: "📚 Study Date",
};

function VotePoll({ messageId }: { messageId: number }) {
  const { data: votes, isLoading } = useVotes(messageId);
  const castVote = useCastVote();
  const { isAuthenticated } = useAuth();

  if (isLoading) return null;

  const yesCount = votes?.yes || 0;
  const noCount = votes?.no || 0;
  const total = votes?.total || 0;
  const yesPercent = total > 0 ? Math.round((yesCount / total) * 100) : 0;
  const noPercent = total > 0 ? Math.round((noCount / total) * 100) : 0;
  const myVote = votes?.myVote;

  return (
    <div className="mt-4 pt-4 border-t border-burgundy/10">
      <p className="text-xs font-ui font-bold uppercase tracking-widest text-ink-light mb-3">
        Would you say yes? 👀
      </p>
      {!isAuthenticated ? (
        <Link href="/auth" className="block text-center py-3 px-4 bg-blush-light/20 border border-burgundy/15 rounded-lg text-sm font-bold text-burgundy hover:bg-blush-light/30 transition-colors duration-300 font-body">
          🔐 Login to vote
        </Link>
      ) : (
      <>
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => castVote.mutate({ messageId, vote: 'yes' })}
          disabled={castVote.isPending}
          className={cn(
            "flex-1 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 font-ui",
            myVote === 'yes'
              ? "bg-accent text-parchment shadow-md"
              : "bg-parchment-aged/50 text-accent border border-burgundy/10 hover:bg-parchment-aged"
          )}
        >
          <ThumbsUp className="w-4 h-4" />
          Yes! {yesCount > 0 && `(${yesCount})`}
        </button>
        <button
          onClick={() => castVote.mutate({ messageId, vote: 'no' })}
          disabled={castVote.isPending}
          className={cn(
            "flex-1 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 font-ui",
            myVote === 'no'
              ? "bg-burgundy-dark text-parchment shadow-md"
              : "bg-blush-light/20 text-burgundy-dark border border-burgundy/10 hover:bg-blush-light/30"
          )}
        >
          <ThumbsDown className="w-4 h-4" />
          Nah {noCount > 0 && `(${noCount})`}
        </button>
      </div>

      {total > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-parchment-aged rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${yesPercent}%` }}
                className="h-full bg-accent rounded-full"
              />
            </div>
            <span className="text-[10px] font-bold text-accent w-8 text-right font-ui">{yesPercent}%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-parchment-aged rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${noPercent}%` }}
                className="h-full bg-burgundy-wine rounded-full"
              />
            </div>
            <span className="text-[10px] font-bold text-burgundy-wine w-8 text-right font-ui">{noPercent}%</span>
          </div>
          <p className="text-[10px] text-ink-light text-center font-ui">{total} vote{total !== 1 ? 's' : ''}</p>
        </div>
      )}
      </>
      )}
    </div>
  );
}

export default function Feed() {
  const { data: messages, isLoading } = usePublicMessages();
  const [, setLocation] = useLocation();

  const tilts = ['scrapbook-tilt-1', 'scrapbook-tilt-2', 'scrapbook-tilt-3', 'scrapbook-tilt-4', 'scrapbook-tilt-5'];

  return (
    <div className="min-h-screen pb-20">
      <Navigation />

      <header className="pt-12 px-6 pb-6 border-b border-burgundy/10 bg-parchment-warm/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-end justify-between">
          <div>
            <span className="text-xs font-ui font-bold uppercase tracking-widest text-ink-light">Public Feed</span>
            <h1 className="text-4xl font-display text-ink font-semibold">Confessions</h1>
          </div>
          <div className="text-right">
            <span className="text-3xl font-display text-burgundy block leading-none font-semibold">
              {messages?.length || 0}
            </span>
            <span className="text-[10px] font-ui font-bold uppercase tracking-widest text-ink-light">Shared</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-8">
        {isLoading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-burgundy" />
          </div>
        ) : messages?.length === 0 ? (
          <GlassCard className="text-center py-20">
            <div className="w-20 h-20 bg-blush-light/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-burgundy/40" />
            </div>
            <p className="font-display text-xl text-ink">No confessions yet.</p>
            <p className="font-body text-sm mt-2 text-ink-light italic">Send one to see it here!</p>
            <div className="mt-6">
              <CutesyButton onClick={() => setLocation('/')}>
                <Send className="w-4 h-4 mr-2" /> Send a Confession
              </CutesyButton>
            </div>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {messages?.map((msg: any, i: number) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
                className={tilts[i % tilts.length]}
              >
                <GlassCard className={cn(
                  "p-6 rounded-lg relative overflow-hidden border",
                  msg.type === 'bouquet' ? "border-blush-dark/30" : "border-burgundy/15"
                )}>
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      {msg.type === 'bouquet' ? (
                        <span className="w-8 h-8 bg-blush-light/40 text-burgundy-wine rounded-full flex items-center justify-center">
                          <Flower className="w-4 h-4" />
                        </span>
                      ) : (
                        <span className="w-8 h-8 bg-blush-light/40 text-burgundy rounded-full flex items-center justify-center">
                          <Heart className="w-4 h-4" />
                        </span>
                      )}
                      <div>
                        <span className="block text-[10px] font-ui font-bold uppercase tracking-widest text-ink-light">
                          {msg.type === 'bouquet' ? 'Bouquet' : 'Confession'}
                        </span>
                        {msg.senderTimestamp && (
                          <span className="text-xs text-ink-light font-body italic">
                            {format(new Date(msg.senderTimestamp), "MMM d, h:mm a")}
                          </span>
                        )}
                      </div>
                    </div>

                    {msg.vibe && (
                      <span className="px-2.5 py-1 bg-parchment-aged/60 rounded-lg text-xs font-ui font-bold text-accent border border-burgundy/10">
                        {VIBE_LABELS[msg.vibe] || msg.vibe}
                      </span>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {msg.datePreference && (
                      <span className="px-2 py-0.5 bg-parchment-aged/40 rounded-full text-[10px] font-bold text-ink-light font-ui border border-burgundy/5">
                        {msg.datePreference === 'random' ? '🎲 Random' : '💘 Specific'}
                      </span>
                    )}
                    {msg.genderPreference && (
                      <span className="px-2 py-0.5 bg-parchment-aged/40 rounded-full text-[10px] font-bold text-ink-light font-ui border border-burgundy/5">
                        {msg.genderPreference === 'girl' ? '👩 Girl' : msg.genderPreference === 'boy' ? '👦 Boy' : '✨ Anyone'}
                      </span>
                    )}
                    {msg.recipientName && (
                      <span className="px-2 py-0.5 bg-blush-light/20 rounded-full text-[10px] font-bold text-burgundy font-ui border border-burgundy/10">
                        💌 For {msg.recipientName}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    {msg.type === 'confession' ? (
                      <p className="font-body text-lg text-ink leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </p>
                    ) : (
                      <div className="flex items-start gap-4">
                        {msg.bouquetId && (
                          <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-parchment-aged border border-burgundy/10 shadow-sm">
                            <img
                              src={FLOWER_IMAGES[msg.bouquetId as string]}
                              alt="Bouquet"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <p className="font-body text-lg text-ink italic">"{msg.note}"</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Vote Poll */}
                  <VotePoll messageId={msg.id} />
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
