import { useState, useEffect } from "react";
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
import { supabase } from "@/lib/supabase";

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
      <div className="min-h-screen flex items-center justify-center px-4">
        <Navigation />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full max-w-md"
        >
          <GlassCard className="rounded-lg relative overflow-hidden p-10">
            <div className="w-16 h-16 bg-blush-light/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-6 h-6 text-burgundy" />
            </div>

            <h1 className="text-3xl font-display text-center mb-2 font-semibold text-ink">Admin Access 🗡️</h1>
            <p className="text-center font-body text-ink-light mb-8 text-sm italic">
              Only the Musketeers can enter.
            </p>

            <form onSubmit={form.handleSubmit(onLogin)} className="space-y-6">
              <div className="space-y-1">
                <label className="text-xs font-ui font-bold uppercase tracking-widest text-ink-light ml-1">
                  Username
                </label>
                <input
                  {...form.register("slug")}
                  type="text"
                  placeholder="Who are you?"
                  className="w-full p-3 bg-parchment border border-burgundy/15 rounded-lg outline-none focus:border-burgundy/40 transition-colors duration-300 font-body placeholder:text-ink-light/40"
                  autoFocus
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-ui font-bold uppercase tracking-widest text-ink-light ml-1">
                  Password
                </label>
                <input
                  {...form.register("passcode")}
                  type="password"
                  placeholder="••••••••"
                  className="w-full p-3 bg-parchment border border-burgundy/15 rounded-lg outline-none focus:border-burgundy/40 transition-colors duration-300 tracking-widest font-body"
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

interface SenderUser {
  id: number;
  fullName: string;
  collegeUid: string;
  mobileNumber: string;
  instagramUsername: string;
}

function InboxDashboard({ creatorId, displayName, isDemo }: { creatorId: number; displayName: string; isDemo?: boolean }) {
  const { data: apiMessages, isLoading } = useMessages(creatorId);
  const togglePublic = useTogglePublic();
  const deleteMessage = useDeleteMessage();
  const { toast } = useToast();
  const [senderUsers, setSenderUsers] = useState<Record<number, SenderUser>>({});

  const messages = isDemo ? MOCK_MESSAGES : (apiMessages || []);
  const loading = isDemo ? false : isLoading;

  useEffect(() => {
    if (!messages || messages.length === 0) return;
    const userIds = Array.from(new Set(messages.map((m: any) => m.senderUserId).filter(Boolean))) as number[];
    if (userIds.length === 0) return;

    supabase
      .from("users")
      .select("*")
      .in("id", userIds)
      .then(({ data }: { data: any }) => {
        if (!data) return;
        const map: Record<number, SenderUser> = {};
        for (const row of data) {
          map[row.id] = {
            id: row.id,
            fullName: row.full_name,
            collegeUid: row.college_uid,
            mobileNumber: row.mobile_number,
            instagramUsername: row.instagram_username,
          };
        }
        setSenderUsers(map);
      });
  }, [messages]);

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

  const tilts = ['scrapbook-tilt-1', 'scrapbook-tilt-2', 'scrapbook-tilt-3', 'scrapbook-tilt-4', 'scrapbook-tilt-5'];

  return (
    <div className="min-h-screen pb-20">
      <Navigation />

      <header className="pt-12 px-6 pb-6 border-b border-burgundy/10 bg-parchment-warm/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-end justify-between">
          <div>
            <span className="text-xs font-ui font-bold uppercase tracking-widest text-ink-light">Admin Inbox</span>
            <h1 className="text-4xl font-display text-ink font-semibold">Confessions</h1>
          </div>
          <div className="text-right">
            <span className="text-3xl font-display text-burgundy block leading-none font-semibold">
              {messages?.length || 0}
            </span>
            <span className="text-[10px] font-ui font-bold uppercase tracking-widest text-ink-light">Letters</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-8">
        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-burgundy" />
          </div>
        ) : messages?.length === 0 ? (
          <GlassCard className="text-center py-20">
            <div className="w-20 h-20 bg-blush-light/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-burgundy/40" />
            </div>
            <p className="font-display text-xl text-ink">No letters yet.</p>
            <p className="font-body text-sm mt-2 text-ink-light italic">Share your link to receive some love.</p>
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
                <GlassCard
                  className={cn(
                    "p-6 rounded-lg relative overflow-hidden border transition-all duration-400",
                    msg.type === "bouquet" ? "border-blush-dark/30" : "border-burgundy/15",
                    msg.isPublic && "ring-1 ring-accent/40 bg-parchment-aged/30"
                  )}
                >
                  {msg.isPublic && (
                    <div className="absolute top-0 right-0 bg-accent text-parchment text-[10px] font-bold font-ui px-3 py-1 rounded-bl-lg z-20 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> PUBLIC
                    </div>
                  )}

                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      {msg.type === "bouquet" ? (
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
                          {msg.type === "bouquet" ? "Bouquet" : "Confession"}
                        </span>
                        {msg.senderTimestamp && (
                          <span className="text-xs text-ink-light font-body italic">
                            {format(new Date(msg.senderTimestamp), "MMM d, h:mm a")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Sender Intel */}
                  <div className="mb-4 space-y-2">
                    {(msg as any).senderUserId && senderUsers[(msg as any).senderUserId] && (
                      <div className="bg-parchment-aged/50 p-3 rounded-lg border border-burgundy/10 mb-2">
                        <span className="text-[10px] font-ui font-bold uppercase text-accent block mb-1">👤 Registered User</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-ink font-body">{senderUsers[(msg as any).senderUserId].fullName}</span>
                          <span className="text-xs font-mono text-ink-light bg-parchment px-2 py-0.5 rounded">{senderUsers[(msg as any).senderUserId].collegeUid}</span>
                        </div>
                        <span className="text-xs text-ink-light">📱 {senderUsers[(msg as any).senderUserId].mobileNumber}</span>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {msg.instagramUsername && (
                        <a
                          href={`https://instagram.com/${msg.instagramUsername.replace("@", "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blush-light/20 p-2 rounded-lg border border-burgundy/10 inline-block hover:shadow-sm transition-shadow duration-300"
                        >
                          <span className="text-[10px] font-ui font-bold uppercase text-ink-light block mb-0.5">From</span>
                          <span className="text-sm font-bold text-ink font-mono">@{msg.instagramUsername.replace("@", "")}</span>
                        </a>
                      )}
                      {msg.recipientName && (
                        <div className="bg-blush-light/20 p-2 rounded-lg border border-burgundy/10 inline-block">
                          <span className="text-[10px] font-ui font-bold uppercase text-ink-light block mb-0.5">To</span>
                          <span className="text-sm font-bold text-burgundy font-body">💌 {msg.recipientName}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {msg.datePreference && (
                        <div className="bg-parchment-aged/40 px-2.5 py-1 rounded-full border border-burgundy/10 flex items-center gap-1.5">
                          <span className="text-[10px]">{msg.datePreference === 'random' ? '🎲' : '💘'}</span>
                          <span className="text-[10px] font-bold text-ink-light uppercase font-ui">{msg.datePreference}</span>
                        </div>
                      )}
                      {msg.recipientInstagram && (
                        <a
                          href={`https://instagram.com/${msg.recipientInstagram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blush-light/20 px-2.5 py-1 rounded-full border border-burgundy/10 flex items-center gap-1.5 hover:shadow-sm transition-shadow duration-300"
                        >
                          <span className="text-[10px]">💘</span>
                          <span className="text-[10px] font-bold text-burgundy font-ui">wants @{msg.recipientInstagram}</span>
                        </a>
                      )}
                      {msg.genderPreference && (
                        <div className="bg-parchment-aged/40 px-2.5 py-1 rounded-full border border-burgundy/10 flex items-center gap-1.5">
                          <span className="text-[10px]">{msg.genderPreference === 'girl' ? '👩' : msg.genderPreference === 'boy' ? '👦' : '✨'}</span>
                          <span className="text-[10px] font-bold text-ink-light uppercase font-ui">{msg.genderPreference}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {msg.senderIp && (
                        <div className="bg-parchment/60 px-2 py-1 rounded border border-burgundy/5 flex items-center gap-1.5" title="Sender IP">
                          <span className="text-[10px]">🔍</span>
                          <span className="text-[10px] font-mono text-ink-light">{msg.senderIp}</span>
                        </div>
                      )}
                      {msg.senderDevice && (
                        <div className="bg-parchment/60 px-2 py-1 rounded border border-burgundy/5 flex items-center gap-1.5" title="Device">
                          <span className="text-[10px]">💻</span>
                          <span className="text-[10px] font-mono text-ink-light">{msg.senderDevice}</span>
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
                          <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-parchment-aged border border-burgundy/10 shadow-sm">
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
                  <div className="flex gap-2 pt-4 border-t border-burgundy/10">
                    <CutesyButton
                      onClick={() => handleToggle(msg.id, msg.isPublic)}
                      className={cn(
                        "flex-1 text-xs py-2 h-auto shadow-none",
                        msg.isPublic
                          ? "bg-parchment-aged text-ink-light hover:bg-blush-light/30 border border-burgundy/10"
                          : "bg-burgundy hover:bg-burgundy-dark text-parchment"
                      )}
                    >
                      {msg.isPublic ? (
                        <><EyeOff className="w-3 h-3 mr-1" /> Hide</>
                      ) : (
                        <><Eye className="w-3 h-3 mr-1" /> Approve</>
                      )}
                    </CutesyButton>

                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="p-2 bg-burgundy-dark/10 text-burgundy-dark rounded-lg hover:bg-burgundy-dark/20 transition-colors duration-300"
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
