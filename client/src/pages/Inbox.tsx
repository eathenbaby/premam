import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@shared/schema";
import { useLogin } from "@/hooks/use-creators";
import { useMessages, useTogglePublic, useDeleteMessage } from "@/hooks/use-messages";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Loader2, Lock, Heart, Flower, Sparkles, Eye, EyeOff, Trash2, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { z } from "zod";
import { Navigation } from "@/components/Navigation";
import { cn } from "@/lib/utils";
import { GlassCard, CutesyButton } from "@/components/InteractiveComponents";

import bouquet01 from "@assets/64603-OB2R9V-578_1771092125803.jpg";
import bouquet02 from "@assets/6502939_1771092125804.jpg";
import bouquet03 from "@assets/6523075_1771092125804.jpg";
import bouquet04 from "@assets/6463769_1771092135717.jpg";
import bouquet05 from "@assets/6517084_1771092142814.jpg";
import bouquet06 from "@assets/6518416_1771092148926.jpg";

type LoginFormValues = z.infer<typeof loginSchema>;

const FLOWER_IMAGES: Record<string, string> = {
  "bouquet-01": bouquet01,
  "bouquet-02": bouquet02,
  "bouquet-03": bouquet03,
  "bouquet-04": bouquet04,
  "bouquet-05": bouquet05,
  "bouquet-06": bouquet06,
};

const MOCK_MESSAGES = [
  {
    id: 1,
    creatorId: 1,
    type: "confession" as const,
    vibe: "romance",
    content: "I've had a crush on you since we met at the coffee shop. You have the cutest smile! ☕️✨",
    bouquetId: null,
    note: null,
    isRead: false,
    isPublic: false,
    instagramUsername: "secret_admirer",
    recipientName: "Eathen",
    datePreference: "specific",
    recipientInstagram: "eathen_baby",
    genderPreference: "boy",
    createdAt: new Date(),
    senderTimestamp: new Date().toISOString(),
    senderDevice: "Mobile",
    senderLocation: "Unknown",
    senderIp: null,
  },
  {
    id: 2,
    creatorId: 1,
    type: "bouquet" as const,
    vibe: null,
    content: null,
    bouquetId: "bouquet-02",
    note: "For the sweetest person I know. Happy Valentine's Day! 🌹",
    isRead: false,
    isPublic: true,
    instagramUsername: "flower_lover",
    recipientName: "Joshy",
    datePreference: "random",
    recipientInstagram: null,
    genderPreference: "any",
    createdAt: new Date(Date.now() - 86400000),
    senderTimestamp: new Date(Date.now() - 86400000).toISOString(),
    senderDevice: "Desktop",
    senderLocation: "New York, US",
    senderIp: null,
  },
];

export default function Inbox() {
  const [session, setSession] = useState<{ creatorId: number; displayName: string } | null>(null);
  const login = useLogin();
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { slug: "", passcode: "" },
  });

  const onLogin = (data: LoginFormValues) => {
    if (data.slug === "3musketeers" && data.passcode === "eathenajmaljoshy69") {
      setSession({ creatorId: 1, displayName: "3 Musketeers" });
      toast({ title: "Welcome back 🗡️", description: "Hello, Musketeers!" });
      return;
    }

    login.mutate(data, {
      onSuccess: (res) => {
        setSession({ creatorId: res.creator.id, displayName: res.creator.displayName });
        toast({ title: "Welcome back", description: `Hello, ${res.creator.displayName}` });
      },
      onError: (err) => {
        toast({ variant: "destructive", title: "Access Denied", description: err.message });
      },
    });
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent px-4">
        <Navigation />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <GlassCard className="rounded-2xl relative overflow-hidden p-10">
            <div className="w-16 h-16 bg-white/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-6 h-6 text-primary" />
            </div>

            <h1 className="text-3xl font-display text-center mb-2 font-bold text-ink">Admin Access 🗡️</h1>
            <p className="text-center font-body text-ink-light mb-8 text-sm">
              Only the Musketeers can enter.
            </p>

            <form onSubmit={form.handleSubmit(onLogin)} className="space-y-6">
              <div className="space-y-1">
                <label className="text-xs font-ui font-bold uppercase tracking-widest text-stone-500 ml-1">
                  Username
                </label>
                <input
                  {...form.register("slug")}
                  type="text"
                  placeholder="Who are you?"
                  className="w-full p-3 bg-white/50 border border-stone-200 rounded-lg outline-none focus:border-primary transition-colors input-dotted"
                  autoFocus
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-ui font-bold uppercase tracking-widest text-stone-500 ml-1">
                  Password
                </label>
                <input
                  {...form.register("passcode")}
                  type="password"
                  placeholder="••••••••"
                  className="w-full p-3 bg-white/50 border border-stone-200 rounded-lg outline-none focus:border-primary transition-colors tracking-widest input-dotted"
                />
              </div>

              <CutesyButton
                type="submit"
                disabled={login.isPending}
                className="w-full py-4 text-base"
              >
                {login.isPending ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Unlock Inbox 🗡️"}
              </CutesyButton>
            </form>
          </GlassCard>
        </motion.div>
      </div>
    );
  }

  return <InboxDashboard creatorId={session.creatorId} displayName={session.displayName} isDemo={session.displayName === "Demo User"} />;
}

function InboxDashboard({ creatorId, displayName, isDemo }: { creatorId: number; displayName: string; isDemo?: boolean }) {
  const { data: apiMessages, isLoading } = useMessages(creatorId);
  const togglePublic = useTogglePublic();
  const deleteMessage = useDeleteMessage();
  const { toast } = useToast();

  const messages = isDemo ? MOCK_MESSAGES : (apiMessages || []);
  const loading = isDemo ? false : isLoading;

  const handleToggle = (id: number, currentStatus: boolean) => {
    togglePublic.mutate(
      { id, isPublic: !currentStatus },
      { onSuccess: () => toast({ title: currentStatus ? "Hidden from Feed" : "Live on Feed!" }) }
    );
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this message?")) {
      deleteMessage.mutate(id, {
        onSuccess: () => toast({ variant: "destructive", title: "Message Deleted" }),
      });
    }
  };

  return (
    <div className="min-h-screen bg-transparent pb-20">
      <Navigation />

      <header className="pt-12 px-6 pb-6 border-b border-white/20 bg-white/30 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-end justify-between">
          <div>
            <span className="text-xs font-ui font-bold uppercase tracking-widest text-stone-500">Admin Inbox</span>
            <h1 className="text-4xl font-display text-ink font-bold">Confessions</h1>
          </div>
          <div className="text-right">
            <span className="text-3xl font-display text-primary block leading-none font-bold">
              {messages?.length || 0}
            </span>
            <span className="text-[10px] font-ui font-bold uppercase tracking-widest text-stone-500">Letters</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-8">
        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : messages?.length === 0 ? (
          <GlassCard className="text-center py-20 text-stone-400">
            <div className="w-20 h-20 bg-white/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 opacity-50 text-primary" />
            </div>
            <p className="font-display text-xl text-ink">No letters yet.</p>
            <p className="font-body text-sm mt-2">Share your link to receive some love.</p>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {messages?.map((msg: any, i: number) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard
                  className={cn(
                    "p-6 rounded-3xl relative overflow-hidden border-2 transition-all",
                    msg.type === "bouquet" ? "border-purple-200" : "border-primary/20",
                    msg.isPublic && "ring-2 ring-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.3)] bg-emerald-50/30"
                  )}
                >
                  {msg.isPublic && (
                    <div className="absolute top-0 right-0 bg-emerald-400 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl z-20 shadow-sm flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> PUBLIC
                    </div>
                  )}

                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      {msg.type === "bouquet" ? (
                        <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                          <Flower className="w-4 h-4" />
                        </span>
                      ) : (
                        <span className="w-8 h-8 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center">
                          <Heart className="w-4 h-4" />
                        </span>
                      )}
                      <div>
                        <span className="block text-[10px] font-ui font-bold uppercase tracking-widest text-stone-400">
                          {msg.type === "bouquet" ? "Bouquet" : "Confession"}
                        </span>
                        {msg.senderTimestamp && (
                          <span className="text-xs text-stone-400 font-body italic">
                            {format(new Date(msg.senderTimestamp), "MMM d, h:mm a")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Sender Intel (Admin Only) */}
                  <div className="mb-4 space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {msg.instagramUsername && (
                        <a
                          href={`https://instagram.com/${msg.instagramUsername.replace("@", "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gradient-to-r from-pink-50 to-purple-50 p-2 rounded-lg border border-pink-200 inline-block hover:shadow-md transition-shadow"
                        >
                          <span className="text-[10px] font-ui font-bold uppercase text-stone-400 block mb-0.5">From</span>
                          <span className="text-sm font-bold text-stone-600 font-mono">@{msg.instagramUsername.replace("@", "")}</span>
                        </a>
                      )}
                      {msg.recipientName && (
                        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-2 rounded-lg border border-purple-200 inline-block">
                          <span className="text-[10px] font-ui font-bold uppercase text-stone-400 block mb-0.5">To</span>
                          <span className="text-sm font-bold text-purple-600">💌 {msg.recipientName}</span>
                        </div>
                      )}
                    </div>

                    {/* Date & Gender Preferences */}
                    <div className="flex flex-wrap gap-2">
                      {msg.datePreference && (
                        <div className="bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 flex items-center gap-1.5">
                          <span className="text-[10px]">{msg.datePreference === 'random' ? '🎲' : '💘'}</span>
                          <span className="text-[10px] font-bold text-amber-600 uppercase">{msg.datePreference}</span>
                        </div>
                      )}
                      {msg.recipientInstagram && (
                        <a
                          href={`https://instagram.com/${msg.recipientInstagram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-pink-50 px-2.5 py-1 rounded-full border border-pink-200 flex items-center gap-1.5 hover:shadow-sm transition-shadow"
                        >
                          <span className="text-[10px]">💘</span>
                          <span className="text-[10px] font-bold text-pink-600">wants @{msg.recipientInstagram}</span>
                        </a>
                      )}
                      {msg.genderPreference && (
                        <div className="bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200 flex items-center gap-1.5">
                          <span className="text-[10px]">{msg.genderPreference === 'girl' ? '👩' : msg.genderPreference === 'boy' ? '👦' : '✨'}</span>
                          <span className="text-[10px] font-bold text-indigo-600 uppercase">{msg.genderPreference}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {msg.senderIp && (
                        <div className="bg-stone-50/80 px-2 py-1 rounded border border-stone-100 flex items-center gap-1.5" title="Sender IP">
                          <span className="text-[10px]">🔍</span>
                          <span className="text-[10px] font-mono text-stone-400">{msg.senderIp}</span>
                        </div>
                      )}
                      {msg.senderDevice && (
                        <div className="bg-stone-50/80 px-2 py-1 rounded border border-stone-100 flex items-center gap-1.5" title="Device">
                          <span className="text-[10px]">💻</span>
                          <span className="text-[10px] font-mono text-stone-400">{msg.senderDevice}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 mb-6">
                    {msg.type === "confession" ? (
                      <p className="font-body text-lg text-ink leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <div className="flex items-start gap-4">
                        {msg.bouquetId && (
                          <div className="w-20 h-20 shrink-0 rounded-2xl overflow-hidden bg-stone-100 border-2 border-white shadow-sm">
                            <img src={FLOWER_IMAGES[msg.bouquetId as string]} alt="Bouquet" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div>
                          <p className="font-body text-lg text-ink italic">"{msg.note}"</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Moderation Actions */}
                  <div className="flex gap-2 pt-4 border-t border-white/20">
                    <CutesyButton
                      onClick={() => handleToggle(msg.id, msg.isPublic)}
                      className={cn(
                        "flex-1 text-xs py-2 h-auto shadow-none",
                        msg.isPublic ? "bg-stone-200 text-stone-600 hover:bg-stone-300" : "bg-emerald-500 hover:bg-emerald-600 text-white"
                      )}
                    >
                      {msg.isPublic ? (
                        <>
                          <EyeOff className="w-3 h-3 mr-1" /> Hide
                        </>
                      ) : (
                        <>
                          <Eye className="w-3 h-3 mr-1" /> Approve
                        </>
                      )}
                    </CutesyButton>

                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                      title="Delete Message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
