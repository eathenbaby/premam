import { useState } from "react";
import { useRoute } from "wouter";
import { useCreator } from "@/hooks/use-creators";
import { useSendMessage } from "@/hooks/use-messages";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Send as SendIcon, Heart } from "lucide-react";
import { VibeCard } from "@/components/VibeCard";
import { FlowerCard } from "@/components/FlowerCard";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";
import { CutesyButton, DodgingButton, GlassCard } from "@/components/InteractiveComponents";
import { useConfetti } from "@/hooks/useConfetti";

import bouquet01 from "@assets/64603-OB2R9V-578_1771092125803.jpg";
import bouquet02 from "@assets/6502939_1771092125804.jpg";
import bouquet03 from "@assets/6523075_1771092125804.jpg";
import bouquet04 from "@assets/6463769_1771092135717.jpg";
import bouquet05 from "@assets/6517084_1771092142814.jpg";
import bouquet06 from "@assets/6518416_1771092148926.jpg";

// Mock data for flowers - using provided assets
const FLOWERS = [
  { id: "bouquet-01", name: "Red Roses", image: bouquet01 },
  { id: "bouquet-02", name: "Pink Heart", image: bouquet02 },
  { id: "bouquet-03", name: "Heart & Bow", image: bouquet03 },
  { id: "bouquet-04", name: "Vintage Blooms", image: bouquet04 },
  { id: "bouquet-05", name: "Vibrant Coral", image: bouquet05 },
  { id: "bouquet-06", name: "Yellow Tulips", image: bouquet06 },
];

const VIBES = [
  { id: "coffee", label: "Coffee Date" },
  { id: "dinner", label: "Dinner" },
  { id: "talk", label: "Just Talk" },
  { id: "adventure", label: "Adventure" },
  { id: "romance", label: "Romance" },
  { id: "friends", label: "Friendship" },
];

// Hardcoded Admin Profile for Single-User Mode
const ADMIN_PROFILE = {
  id: 1,
  displayName: "Us", // "Send a message to Us"
  slug: "admin",
  passcode: "admin"
};

export default function Send() {
  // Removed useRoute and useCreator since we are in Single Admin mode
  const sendMessage = useSendMessage();
  const { toast } = useToast();
  const { triggerConfetti } = useConfetti();

  const [hasAnsweredYes, setHasAnsweredYes] = useState(false);
  const [activeTab, setActiveTab] = useState<'confession' | 'bouquet'>('confession');
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
  const [selectedBouquet, setSelectedBouquet] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [note, setNote] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleYes = () => {
    triggerConfetti();
    setHasAnsweredYes(true);
  };

  const handleSubmit = async () => {
    if (activeTab === 'confession' && !content) {
      toast({ variant: "destructive", title: "Wait!", description: "Please write a message first." });
      return;
    }
    if (activeTab === 'bouquet' && !selectedBouquet) {
      toast({ variant: "destructive", title: "Wait!", description: "Please select a bouquet." });
      return;
    }

    try {
      // Use the real Supabase mutation
      await sendMessage.mutateAsync({
        creatorId: ADMIN_PROFILE.id,
        type: activeTab,
        vibe: activeTab === 'confession' ? selectedVibe : null,
        content: activeTab === 'confession' ? content : null,
        bouquetId: activeTab === 'bouquet' ? selectedBouquet : null,
        note: activeTab === 'bouquet' ? note : null,
        senderDevice: navigator.userAgent,
        senderLocation: "Unknown",
      });

      setIsSuccess(true);
      triggerConfetti();

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send",
      });
    }
  };

  if (!hasAnsweredYes) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-transparent p-4 overflow-hidden relative">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center z-10"
        >
          <div className="mb-8">
            <img
              src="https://media.tenor.com/nB_KjP_lXy4AAAAi/cute-bear.gif"
              alt="Cute bear"
              className="w-48 h-48 mx-auto rounded-full object-cover border-4 border-white shadow-xl"
            />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-ink mb-2">Do you love us?</h1>
          <p className="text-xl text-ink-light mb-12">Be honest... 👀</p>

          <div className="flex items-center justify-center gap-8 relative h-20">
            <CutesyButton onClick={handleYes}>
              Yes <Heart className="inline w-5 h-5 ml-2 fill-current" />
            </CutesyButton>

            <DodgingButton className="bg-white text-ink hover:bg-stone-100">
              No
            </DodgingButton>
          </div>
        </motion.div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-transparent p-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full glass-card p-12 relative"
        >
          <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <SendIcon className="w-8 h-8 text-rose-600" />
          </div>
          <h2 className="text-4xl font-display mb-4 font-bold text-ink">Sent with love!</h2>
          <p className="font-body text-ink-light mb-8">
            Your message has been delivered to {ADMIN_PROFILE.displayName}.
          </p>
          <button
            onClick={() => {
              setIsSuccess(false);
              setContent("");
              setNote("");
              setSelectedVibe(null);
              setSelectedBouquet(null);
              setInstagramUsername(""); // Reset username
            }}
            className="text-sm font-ui uppercase tracking-widest border-b-2 border-primary pb-1 text-primary hover:text-primary/80 transition-colors font-bold"
          >
            Send another
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent pb-20">
      {/* Header */}
      <header className="pt-12 pb-8 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="block text-xs font-ui font-bold uppercase tracking-widest text-primary mb-2">
            Yay! You said yes!
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-ink">Send a Message to {ADMIN_PROFILE.displayName}</h1>
        </motion.div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-4">
        <GlassCard>
          {/* Tabs */}
          <div className="flex justify-center gap-8 mb-8 relative">
            <button
              onClick={() => setActiveTab('confession')}
              className={cn(
                "pb-2 text-lg font-bold transition-colors relative",
                activeTab === 'confession' ? "text-primary" : "text-stone-400 hover:text-stone-600"
              )}
            >
              Confession
              {activeTab === 'confession' && (
                <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-1 rounded-full bg-primary" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('bouquet')}
              className={cn(
                "pb-2 text-lg font-bold transition-colors relative",
                activeTab === 'bouquet' ? "text-primary" : "text-stone-400 hover:text-stone-600"
              )}
            >
              Send Flowers
              {activeTab === 'bouquet' && (
                <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-1 rounded-full bg-primary" />
              )}
            </button>
          </div>

          {/* Instagram Input (Required) */}
          <div className="mb-8 p-4 bg-rose-50/50 rounded-xl border border-rose-100">
            <label className="block text-xs font-ui font-bold uppercase tracking-widest text-rose-500 mb-2 ml-1">
              Your Instagram @ (Required)
            </label>
            <input
              value={instagramUsername}
              onChange={(e) => setInstagramUsername(e.target.value)}
              placeholder="@username"
              className="w-full bg-white border border-rose-200 rounded-lg p-3 text-ink outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-bold placeholder:font-normal placeholder:text-stone-300"
            />
            <p className="text-[10px] text-rose-400 mt-2 ml-1 italic">
              * We promise not to reveal this to anyone else. It's just for us to know who sent it.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'confession' ? (
              <motion.div
                key="confession"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div>
                  <label className="block text-xs font-ui font-bold uppercase tracking-widest text-stone-500 mb-4 ml-1">
                    What's the vibe? (Optional)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {VIBES.map((vibe) => (
                      <VibeCard
                        key={vibe.id}
                        vibe={vibe.id}
                        label={vibe.label}
                        selected={selectedVibe === vibe.id}
                        onClick={() => setSelectedVibe(vibe.id === selectedVibe ? null : vibe.id)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-ui font-bold uppercase tracking-widest text-stone-500 mb-2 ml-1">
                    Your Message
                  </label>
                  <div className="relative">
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Write something honest..."
                      className="w-full min-h-[200px] input-dotted bg-white/50 text-xl text-ink leading-8 outline-none focus:border-primary resize-y"
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="bouquet"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {FLOWERS.map((flower) => (
                    <FlowerCard
                      key={flower.id}
                      {...flower}
                      selected={selectedBouquet === flower.id}
                      onClick={() => setSelectedBouquet(flower.id)}
                    />
                  ))}
                </div>

                <div className="bg-white/50 p-6 rounded-xl border-2 border-dotted border-stone-200">
                  <label className="block text-xs font-ui font-bold uppercase tracking-widest text-stone-500 mb-3">
                    Attach a note
                  </label>
                  <input
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Just for you..."
                    className="w-full bg-transparent border-b-2 border-stone-200 focus:border-primary outline-none py-2 font-body text-lg"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-12">
            <CutesyButton
              onClick={handleSubmit}
              disabled={sendMessage.isPending}
              className="w-full"
            >
              {sendMessage.isPending ? (
                <Loader2 className="w-6 h-6 animate-spin mx-auto" />
              ) : (
                "Seal & Send"
              )}
            </CutesyButton>
            <p className="text-center mt-4 text-xs font-ui text-stone-400">
              Messages are private and only visible to {ADMIN_PROFILE.displayName}.
            </p>
          </div>
        </GlassCard>
      </main>
    </div>
  );
}
