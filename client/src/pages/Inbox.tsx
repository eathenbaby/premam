import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@shared/schema";
import { useLogin } from "@/hooks/use-creators";
import { useMessages, useTogglePublic, useDeleteMessage } from "@/hooks/use-messages";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Loader2, Lock, Heart, Flower, Mail, Sparkles, Eye, EyeOff, Trash2, CheckCircle } from "lucide-react";
// ... imports

// ... (keep Login Layout)

function InboxDashboard({ creatorId, displayName, isDemo }: { creatorId: number, displayName: string, isDemo?: boolean }) {
  const { data: apiMessages, isLoading } = useMessages(creatorId);
  const togglePublic = useTogglePublic();
  const deleteMessage = useDeleteMessage();
  const { toast } = useToast();

  // Use mock messages only if "Demo User" is logged in, otherwise use real data
  const messages = isDemo ? MOCK_MESSAGES : (apiMessages || []);
  const loading = isDemo ? false : isLoading;

  const handleToggle = (id: number, currentStatus: boolean) => {
    togglePublic.mutate({ id, isPublic: !currentStatus }, {
      onSuccess: () => toast({ title: currentStatus ? "Hidden from Feed" : "Live on Feed!" })
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this message?")) {
      deleteMessage.mutate(id, {
        onSuccess: () => toast({ variant: "destructive", title: "Message Deleted" })
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
            <span className="text-[10px] font-ui font-bold uppercase tracking-widest text-stone-500">
              Letters
            </span>
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
                <GlassCard className={cn(
                  "p-6 rounded-3xl relative overflow-hidden border-2 transition-all",
                  msg.type === 'bouquet' ? "border-purple-200" : "border-primary/20",
                  msg.isPublic && "ring-2 ring-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.3)] bg-emerald-50/30"
                )}>
                  {/* Status Badge */}
                  {msg.isPublic && (
                    <div className="absolute top-0 right-0 bg-emerald-400 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl z-20 shadow-sm flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> PUBLIC
                    </div>
                  )}

                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      {/* Icon Logic (Heart/Flower) */}
                      {msg.type === 'bouquet' ? (
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
                          {msg.type === 'bouquet' ? 'Bouquet' : 'Confession'}
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
                    {msg.instagramUsername && (
                      <div className="bg-stone-50/80 p-2 rounded-lg border border-stone-100 inline-block mr-2">
                        <span className="text-[10px] font-ui font-bold uppercase text-stone-400 block mb-0.5">From (Private)</span>
                        <span className="text-sm font-bold text-stone-600 font-mono">@{msg.instagramUsername.replace('@', '')}</span>
                      </div>
                    )}

                    {/* Tech Intel */}
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
                    {msg.type === 'confession' ? (
                      <p className="font-body text-lg text-ink leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </p>
                    ) : (
                      <div className="flex items-start gap-4">
                        {msg.bouquetId && (
                          <div className="w-20 h-20 shrink-0 rounded-2xl overflow-hidden bg-stone-100 border-2 border-white shadow-sm">
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
                        <><EyeOff className="w-3 h-3 mr-1" /> Hide (Private)</>
                      ) : (
                        <><Eye className="w-3 h-3 mr-1" /> Approve (Public)</>
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
