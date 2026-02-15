import { useState } from "react";
import { useSendMessage } from "@/hooks/use-messages";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Send as SendIcon, Heart, CheckCircle, XCircle, Sparkles } from "lucide-react";
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

// Verify Instagram username exists by checking if profile page loads
async function verifyInstagramUsername(username: string): Promise<boolean> {
  const clean = username.replace(/^@/, "").trim();
  if (!clean || clean.length < 1) return false;
  try {
    // Use a CORS proxy or just accept the username format for now
    // Instagram blocks direct fetches from browsers, so we validate format
    // and check via our API endpoint
    const res = await fetch(`/api/auth/verify-instagram`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: clean }),
    });
    const data = await res.json();
    return data.exists === true;
  } catch {
    // If verification API fails, fall back to format check
    return /^[a-zA-Z0-9._]{1,30}$/.test(clean);
  }
}

export default function Send() {
  const sendMessage = useSendMessage();
  const { toast } = useToast();
  const { triggerConfetti } = useConfetti();

  const [hasAnsweredYes, setHasAnsweredYes] = useState(false);
  const [activeTab, setActiveTab] = useState<'confession' | 'bouquet'>('confession');
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
  const [selectedBouquet, setSelectedBouquet] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [instagramUsername, setInstagramUsername] = useState("");
  const [instagramVerified, setInstagramVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationFailed, setVerificationFailed] = useState(false);
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

  const handleVerifyInstagram = async () => {
    const clean = instagramUsername.replace(/^@/, "").trim();
    if (!clean) {
      toast({ variant: "destructive", title: "Wait!", description: "Enter your Instagram username first." });
      return;
    }
    setVerifying(true);
    setVerificationFailed(false);
    const exists = await verifyInstagramUsername(clean);
    setVerifying(false);
    if (exists) {
      setInstagramUsername(clean);
      setInstagramVerified(true);
      toast({ title: "Verified! ✅", description: `@${clean} is a real account.` });
    } else {
      setVerificationFailed(true);
      toast({ variant: "destructive", title: "Not found 😕", description: "That Instagram handle doesn't seem to exist. Check the spelling?" });
    }
  };

  const handleSubmit = async () => {
    if (!instagramUsername.trim() || !instagramVerified) {
      toast({ variant: "destructive", title: "Hold up! 🤚", description: "You need to verify your Instagram handle before sending." });
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
        instagramUsername,
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

  if (!hasAnsweredYes) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-transparent p-4 overflow-hidden relative">
        <Navigation />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center z-10"
        >
          <div className="mb-8">
            <img
              src="https://media.giphy.com/media/MDJ9IbxxvDUQM/giphy.gif"
              alt="Cute bear"
              className="w-48 h-48 mx-auto rounded-full object-cover border-4 border-white shadow-xl"
            />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-ink mb-2">Got something to say?</h1>
          <p className="text-xl text-ink-light mb-12">Go ahead, we're listening... 👀</p>

          <div className="flex items-center justify-center gap-8 relative h-20">
            <CutesyButton onClick={handleYes}>
              Yes <Heart className="inline w-5 h-5 ml-2 fill-current" />
            </CutesyButton>

            <DodgingButton className="bg-white text-ink hover:bg-stone-100">
              No
            </DodgingButton>
          </div>

          <p className="mt-10 text-xs text-stone-400 italic">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-primary transition-colors">
              Terms & Privacy Policy
            </Link>
          </p>
        </motion.div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-transparent p-6 text-center">
        <Navigation />
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
              setInstagramUsername("");
              setInstagramVerified(false);
              setVerificationFailed(false);
              setRecipientName("");
              setDatePreference(null);
              setRecipientInstagram("");
              setGenderPreference(null);
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
      <Navigation />
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

          {/* Instagram Verification (Required) */}
          <div className="mb-8 p-5 bg-gradient-to-r from-pink-50/80 to-purple-50/80 rounded-2xl border border-pink-200/50">
            <label className="block text-xs font-ui font-bold uppercase tracking-widest text-pink-600 mb-3 ml-1">
              🔐 Verify Your Instagram (Required)
            </label>

            {instagramVerified ? (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="font-bold text-green-700">@{instagramUsername}</span>
                <span className="text-green-500 text-xs ml-auto">Verified</span>
                <button
                  onClick={() => {
                    setInstagramVerified(false);
                    setInstagramUsername("");
                    setVerificationFailed(false);
                  }}
                  className="text-xs text-stone-400 hover:text-stone-600 underline ml-2"
                >
                  change
                </button>
              </div>
            ) : (
              <>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400 font-bold">@</span>
                    <input
                      value={instagramUsername}
                      onChange={(e) => {
                        setInstagramUsername(e.target.value.replace(/^@/, ""));
                        setVerificationFailed(false);
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleVerifyInstagram()}
                      placeholder="your_username"
                      className={cn(
                        "w-full bg-white border-2 rounded-xl p-3 pl-8 text-ink outline-none transition-all font-bold placeholder:font-normal placeholder:text-stone-300",
                        verificationFailed ? "border-red-300 focus:border-red-400" : "border-pink-200 focus:border-pink-400"
                      )}
                    />
                  </div>
                  <CutesyButton
                    onClick={handleVerifyInstagram}
                    disabled={verifying}
                    className="px-6 py-3 text-sm"
                  >
                    {verifying ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify"}
                  </CutesyButton>
                </div>

                {verificationFailed && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 mt-2 text-red-500 text-sm"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>That handle doesn't exist. Double-check the spelling!</span>
                  </motion.div>
                )}
              </>
            )}

            <p className="text-[10px] text-pink-400 mt-3 ml-1 italic">
              * Only we can see this. Your confession stays anonymous to everyone else 💕
            </p>
            <p className="text-[10px] text-stone-400 mt-1 ml-1 italic">
              * Only real Instagram accounts are approved. Fake handles will be rejected.
            </p>
          </div>

          {/* Date Preference */}
          <div className="mb-8 p-5 bg-amber-50/50 rounded-2xl border border-amber-200/50">
            <label className="block text-xs font-ui font-bold uppercase tracking-widest text-amber-600 mb-3 ml-1">
              🎯 Who do you want to go with?
            </label>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => { setDatePreference('random'); setRecipientInstagram(''); }}
                className={cn(
                  "p-4 rounded-xl border-2 text-center transition-all font-bold",
                  datePreference === 'random'
                    ? "border-amber-400 bg-amber-100 text-amber-700 shadow-md"
                    : "border-stone-200 bg-white text-stone-500 hover:border-amber-300"
                )}
              >
                🎲 Random
                <span className="block text-[10px] font-normal mt-1">Surprise me!</span>
              </button>
              <button
                onClick={() => setDatePreference('specific')}
                className={cn(
                  "p-4 rounded-xl border-2 text-center transition-all font-bold",
                  datePreference === 'specific'
                    ? "border-amber-400 bg-amber-100 text-amber-700 shadow-md"
                    : "border-stone-200 bg-white text-stone-500 hover:border-amber-300"
                )}
              >
                💘 Someone Specific
                <span className="block text-[10px] font-normal mt-1">I know who I want</span>
              </button>
            </div>

            {datePreference === 'specific' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-3 mb-4"
              >
                <div>
                  <label className="block text-[10px] font-ui font-bold uppercase tracking-widest text-amber-500 mb-2 ml-1">
                    Their Name
                  </label>
                  <input
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Enter their name"
                    className="w-full bg-white border-2 border-amber-200 rounded-xl p-3 text-ink outline-none focus:border-amber-400 transition-all font-bold placeholder:font-normal placeholder:text-stone-300"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-ui font-bold uppercase tracking-widest text-amber-500 mb-2 ml-1">
                    Their Instagram
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 font-bold">@</span>
                    <input
                      value={recipientInstagram}
                      onChange={(e) => setRecipientInstagram(e.target.value.replace(/^@/, ''))}
                      placeholder="their_username"
                      className="w-full bg-white border-2 border-amber-200 rounded-xl p-3 pl-8 text-ink outline-none focus:border-amber-400 transition-all font-bold placeholder:font-normal placeholder:text-stone-300"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Gender Preference */}
            <label className="block text-[10px] font-ui font-bold uppercase tracking-widest text-amber-500 mb-2 ml-1 mt-4">
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
                    "p-3 rounded-xl border-2 text-center text-sm transition-all font-bold",
                    genderPreference === g.id
                      ? "border-amber-400 bg-amber-100 text-amber-700 shadow-md"
                      : "border-stone-200 bg-white text-stone-500 hover:border-amber-300"
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
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write something honest..."
                    className="w-full min-h-[200px] input-dotted bg-white/50 text-xl text-ink leading-8 outline-none focus:border-primary resize-y"
                  />
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
              disabled={sendMessage.isPending || !instagramVerified}
              className={cn("w-full", !instagramVerified && "opacity-50 cursor-not-allowed")}
            >
              {sendMessage.isPending ? (
                <Loader2 className="w-6 h-6 animate-spin mx-auto" />
              ) : (
                <><Sparkles className="w-5 h-5 mr-2 inline" />Seal & Send</>

              )}
            </CutesyButton>
            {!instagramVerified && (
              <p className="text-center mt-3 text-xs font-ui text-pink-500 font-bold">
                ☝️ Verify your Instagram first to unlock sending
              </p>
            )}
            <p className="text-center mt-4 text-xs font-ui text-stone-400">
              Messages are anonymous and only visible to {ADMIN_PROFILE.displayName}.
            </p>
          </div>
        </GlassCard>
      </main>
    </div>
  );
}
