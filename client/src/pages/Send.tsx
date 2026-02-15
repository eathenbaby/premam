import { useState } from "react";
import { useSendMessage } from "@/hooks/use-messages";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Send as SendIcon, Heart, Sparkles, UserPlus } from "lucide-react";
import { Link } from "wouter";
import { VibeCard } from "@/components/VibeCard";
import { FlowerCard } from "@/components/FlowerCard";
import { cn } from "@/lib/utils";
import { CutesyButton, DodgingButton, GlassCard } from "@/components/InteractiveComponents";
import { useConfetti } from "@/hooks/useConfetti";
import { Navigation } from "@/components/Navigation";

import bouquet01 from "@assets/64603-OB2R9V-578_1771092125803.jpg";
import bouquet02 from "@assets/6502939_1771092125804.jpg";
import bouquet03 from "@assets/6523075_1771092125804.jpg";
import bouquet04 from "@assets/6463769_1771092135717.jpg";
import bouquet05 from "@assets/6517084_1771092142814.jpg";
import bouquet06 from "@assets/6518416_1771092148926.jpg";

const FLOWERS = [
  { id: "bouquet-01", name: "Red Roses", image: bouquet01 },
  { id: "bouquet-02", name: "Pink Heart", image: bouquet02 },
  { id: "bouquet-03", name: "Heart & Bow", image: bouquet03 },
  { id: "bouquet-04", name: "Vintage Blooms", image: bouquet04 },
  { id: "bouquet-05", name: "Vibrant Coral", image: bouquet05 },
  { id: "bouquet-06", name: "Yellow Tulips", image: bouquet06 },
];

const VIBES = [
  { id: "chai", label: "Chai Date ☕" },
  { id: "movie", label: "Movie Time 🎬" },
  { id: "brunch", label: "Brunch 🥞" },
  { id: "walk", label: "A Walk 🌿" },
  { id: "arcade", label: "Arcade Date 🕹️" },
  { id: "study", label: "Study Date 📚" },
];

const ADMIN_PROFILE = {
  id: 1,
  displayName: "Us",
  slug: "admin",
  passcode: "admin"
};

export default function Send() {
  const sendMessage = useSendMessage();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const { triggerConfetti } = useConfetti();

  const [hasAnsweredYes, setHasAnsweredYes] = useState(false);
  const [activeTab, setActiveTab] = useState<'confession' | 'bouquet'>('confession');
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
  const [selectedBouquet, setSelectedBouquet] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [datePreference, setDatePreference] = useState<'random' | 'specific' | null>(null);
  const [recipientInstagram, setRecipientInstagram] = useState("");
  const [genderPreference, setGenderPreference] = useState<'girl' | 'boy' | 'any' | null>(null);
  const [note, setNote] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleYes = () => {
    triggerConfetti();
    setHasAnsweredYes(true);
  };

  const handleSubmit = async () => {
    if (!isAuthenticated || !user) {
      toast({ variant: "destructive", title: "Hold up! 🤚", description: "Create an account first to send confessions." });
      return;
    }
    if (datePreference === 'specific' && !recipientInstagram.trim()) {
      toast({ variant: "destructive", title: "Wait! 💘", description: "Enter their Instagram if you want someone specific!" });
      return;
    }
    if (activeTab === 'confession' && !content) {
      toast({ variant: "destructive", title: "Wait!", description: "Please write a message first." });
      return;
    }
    if (activeTab === 'bouquet' && !selectedBouquet) {
      toast({ variant: "destructive", title: "Wait!", description: "Please select a bouquet." });
      return;
    }

    try {
      await sendMessage.mutateAsync({
        creatorId: ADMIN_PROFILE.id,
        type: activeTab,
        instagramUsername: user!.instagramUsername,
        senderUserId: user!.id,
        recipientName: recipientName.trim(),
        datePreference,
        recipientInstagram: datePreference === 'specific' ? recipientInstagram.replace(/^@/, '').trim() : null,
        genderPreference,
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

  // Pre-question screen
  if (!hasAnsweredYes) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden relative">
        <Navigation />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center z-10"
        >
          <div className="mb-8">
            <img
              src="https://media.giphy.com/media/MDJ9IbxxvDUQM/giphy.gif"
              alt="Cute bear"
              className="w-48 h-48 mx-auto rounded-lg object-cover border-2 border-burgundy/10 shadow-lg"
              style={{ boxShadow: '0 8px 24px rgba(60, 20, 10, 0.15)' }}
            />
          </div>

          <h1 className="text-4xl md:text-6xl font-display font-semibold text-ink mb-2">Got something to say?</h1>
          <p className="text-xl font-body text-ink-light mb-12 italic">Go ahead, we're listening... 👀</p>

          <div className="flex items-center justify-center gap-8 relative h-20">
            <CutesyButton onClick={handleYes}>
              Yes <Heart className="inline w-5 h-5 ml-2 fill-current" />
            </CutesyButton>

            <DodgingButton className="bg-parchment-warm text-ink hover:bg-parchment-aged">
              No
            </DodgingButton>
          </div>

          <p className="mt-10 text-xs text-ink-light/60 font-body italic">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-burgundy transition-colors duration-300">
              Terms & Privacy Policy
            </Link>
          </p>
        </motion.div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <Navigation />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full glass-card p-12 relative"
        >
          <div className="w-20 h-20 bg-blush-light/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <UserPlus className="w-8 h-8 text-burgundy" />
          </div>
          <h2 className="text-3xl font-display mb-4 font-semibold text-ink">Create an account first! <span className="font-script">💕</span></h2>
          <p className="font-body text-ink-light mb-8">
            You need an account to send confessions. It only takes a minute!
          </p>
          <Link href="/auth">
            <CutesyButton className="w-full">
              <UserPlus className="w-4 h-4 mr-2 inline" /> Sign Up / Login
            </CutesyButton>
          </Link>
        </motion.div>
      </div>
    );
  }

  // Success
  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <Navigation />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full glass-card p-12 relative"
        >
          <div className="w-20 h-20 bg-blush-light/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-breathe">
            <SendIcon className="w-8 h-8 text-burgundy" />
          </div>
          <h2 className="text-4xl font-display mb-4 font-semibold text-ink">Sent with love!</h2>
          <p className="font-body text-ink-light mb-8">
            Your message has been delivered to <span className="font-script text-burgundy">{ADMIN_PROFILE.displayName}</span>.
          </p>
          <button
            onClick={() => {
              setIsSuccess(false);
              setContent("");
              setNote("");
              setSelectedVibe(null);
              setSelectedBouquet(null);
              setRecipientName("");
              setDatePreference(null);
              setRecipientInstagram("");
              setGenderPreference(null);
            }}
            className="text-sm font-ui uppercase tracking-widest border-b-2 border-burgundy pb-1 text-burgundy hover:text-burgundy-dark transition-colors duration-300 font-bold"
          >
            Send another
          </button>
        </motion.div>
      </div>
    );
  }

  // Main form
  return (
    <div className="min-h-screen pb-20">
      <Navigation />
      <header className="pt-12 pb-8 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="block text-xs font-ui font-bold uppercase tracking-widest text-burgundy mb-2">
            Yay! You said yes!
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-semibold text-ink">Send a Message to <span className="font-script text-burgundy">{ADMIN_PROFILE.displayName}</span></h1>
        </motion.div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-4">
        <GlassCard>
          {/* Tabs */}
          <div className="flex justify-center gap-8 mb-8 relative">
            <button
              onClick={() => setActiveTab('confession')}
              className={cn(
                "pb-2 text-lg font-display font-semibold transition-colors duration-300 relative",
                activeTab === 'confession' ? "text-burgundy" : "text-ink-light hover:text-ink"
              )}
            >
              Confession
              {activeTab === 'confession' && (
                <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-burgundy" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('bouquet')}
              className={cn(
                "pb-2 text-lg font-display font-semibold transition-colors duration-300 relative",
                activeTab === 'bouquet' ? "text-burgundy" : "text-ink-light hover:text-ink"
              )}
            >
              Send Flowers
              {activeTab === 'bouquet' && (
                <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-burgundy" />
              )}
            </button>
          </div>

          {/* Logged in as */}
          <div className="mb-8 p-4 bg-parchment-aged/50 rounded-lg border border-burgundy/10 flex items-center gap-3">
            <div className="w-10 h-10 bg-burgundy rounded-full flex items-center justify-center text-sm font-bold text-parchment flex-shrink-0 font-display">
              {user!.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-ink text-sm font-body truncate">{user!.fullName}</p>
              <p className="text-xs text-burgundy font-bold font-ui">@{user!.instagramUsername}</p>
            </div>
            <span className="text-[10px] text-accent font-bold uppercase tracking-widest font-ui">✅ Verified</span>
          </div>

          {/* Date Preference */}
          <div className="mb-8 p-5 bg-parchment/70 rounded-lg border border-burgundy/10">
            <label className="block text-xs font-ui font-bold uppercase tracking-widest text-accent mb-3 ml-1">
              🎯 Who do you want to go with?
            </label>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => { setDatePreference('random'); setRecipientInstagram(''); }}
                className={cn(
                  "p-4 rounded-lg border-2 text-center transition-all duration-300 font-display font-semibold",
                  datePreference === 'random'
                    ? "border-burgundy/40 bg-blush-light/30 text-burgundy-dark shadow-md"
                    : "border-burgundy/10 bg-parchment-warm text-ink-light hover:border-burgundy/20"
                )}
              >
                🎲 Random
                <span className="block text-[10px] font-body font-normal mt-1 text-ink-light">Surprise me!</span>
              </button>
              <button
                onClick={() => setDatePreference('specific')}
                className={cn(
                  "p-4 rounded-lg border-2 text-center transition-all duration-300 font-display font-semibold",
                  datePreference === 'specific'
                    ? "border-burgundy/40 bg-blush-light/30 text-burgundy-dark shadow-md"
                    : "border-burgundy/10 bg-parchment-warm text-ink-light hover:border-burgundy/20"
                )}
              >
                💘 Someone Specific
                <span className="block text-[10px] font-body font-normal mt-1 text-ink-light">I know who I want</span>
              </button>
            </div>

            {datePreference === 'specific' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.4 }}
                className="space-y-3 mb-4"
              >
                <div>
                  <label className="block text-[10px] font-ui font-bold uppercase tracking-widest text-accent mb-2 ml-1">
                    Their Name
                  </label>
                  <input
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Enter their name"
                    className="w-full bg-parchment-warm border border-burgundy/15 rounded-lg p-3 text-ink outline-none focus:border-burgundy/40 transition-all duration-300 font-body placeholder:text-ink-light/40"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-ui font-bold uppercase tracking-widest text-accent mb-2 ml-1">
                    Their Instagram
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-burgundy/50 font-bold font-ui">@</span>
                    <input
                      value={recipientInstagram}
                      onChange={(e) => setRecipientInstagram(e.target.value.replace(/^@/, ''))}
                      placeholder="their_username"
                      className="w-full bg-parchment-warm border border-burgundy/15 rounded-lg p-3 pl-8 text-ink outline-none focus:border-burgundy/40 transition-all duration-300 font-body placeholder:text-ink-light/40"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Gender Preference */}
            <label className="block text-[10px] font-ui font-bold uppercase tracking-widest text-accent mb-2 ml-1 mt-4">
              Preferred Gender
            </label>
            <div className="grid grid-cols-3 gap-2">
              {([
                { id: 'girl' as const, label: '👩 Girl' },
                { id: 'boy' as const, label: '👦 Boy' },
                { id: 'any' as const, label: '✨ Anyone' },
              ]).map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGenderPreference(g.id)}
                  className={cn(
                    "p-3 rounded-lg border text-center text-sm transition-all duration-300 font-display font-medium",
                    genderPreference === g.id
                      ? "border-burgundy/40 bg-blush-light/30 text-burgundy-dark shadow-sm"
                      : "border-burgundy/10 bg-parchment-warm text-ink-light hover:border-burgundy/20"
                  )}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'confession' ? (
              <motion.div
                key="confession"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-8"
              >
                <div>
                  <label className="block text-xs font-ui font-bold uppercase tracking-widest text-ink-light mb-4 ml-1">
                    What's the vibe? <span className="font-normal lowercase italic">(Optional)</span>
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
                  <label className="block text-xs font-ui font-bold uppercase tracking-widest text-ink-light mb-2 ml-1">
                    Your Message
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write something honest..."
                    className="w-full min-h-[200px] bg-parchment border border-burgundy/15 rounded-lg px-4 py-3 text-lg text-ink font-body leading-8 outline-none focus:border-burgundy/30 transition-all duration-300 resize-y placeholder:text-ink-light/40 placeholder:italic"
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="bouquet"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
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

                <div className="bg-parchment/70 p-6 rounded-lg border border-burgundy/10">
                  <label className="block text-xs font-ui font-bold uppercase tracking-widest text-ink-light mb-3">
                    Attach a note
                  </label>
                  <input
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Just for you..."
                    className="w-full bg-transparent border-b-2 border-burgundy/15 focus:border-burgundy/40 outline-none py-2 font-body text-lg transition-colors duration-300 placeholder:text-ink-light/40 placeholder:italic"
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
                <><Sparkles className="w-5 h-5 mr-2 inline" />Seal & Send</>
              )}
            </CutesyButton>
            <p className="text-center mt-4 text-xs font-ui text-ink-light/60">
              Messages are anonymous and only visible to {ADMIN_PROFILE.displayName}.
            </p>
          </div>
        </GlassCard>
      </main>
    </div>
  );
}
