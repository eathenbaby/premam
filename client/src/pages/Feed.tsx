import { usePublicMessages } from "@/hooks/use-messages";
import { useLocation } from "wouter"; // wouter hook for navigation
import { motion } from "framer-motion";
import { Loader2, Heart, Flower, Sparkles, Send } from "lucide-react";
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

// Mock flower map again for display
const FLOWER_IMAGES: Record<string, string> = {
    "bouquet-01": bouquet01,
    "bouquet-02": bouquet02,
    "bouquet-03": bouquet03,
    "bouquet-04": bouquet04,
    "bouquet-05": bouquet05,
    "bouquet-06": bouquet06,
};

export default function Feed() {
    const { data: messages, isLoading } = usePublicMessages();
    const [, setLocation] = useLocation(); // Hook to navigate

    return (
        <div className="min-h-screen bg-transparent pb-20">
            <Navigation />

            <header className="pt-12 px-6 pb-6 border-b border-white/20 bg-white/30 backdrop-blur-sm sticky top-0 z-40">
                <div className="max-w-4xl mx-auto flex items-end justify-between">
                    <div>
                        <span className="text-xs font-ui font-bold uppercase tracking-widest text-stone-500">Public Feed</span>
                        <h1 className="text-4xl font-display text-ink font-bold">Love Letters</h1>
                    </div>
                    <div className="text-right">
                        <span className="text-3xl font-display text-primary block leading-none font-bold">
                            {messages?.length || 0}
                        </span>
                        <span className="text-[10px] font-ui font-bold uppercase tracking-widest text-stone-500">
                            Shared
                        </span>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 pt-8">
                {isLoading ? (
                    <div className="py-20 flex justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : messages?.length === 0 ? (
                    <GlassCard className="text-center py-20 text-stone-400">
                        <div className="w-20 h-20 bg-white/50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Sparkles className="w-8 h-8 opacity-50 text-primary" />
                        </div>
                        <p className="font-display text-xl text-ink">No public letters yet.</p>
                        <p className="font-body text-sm mt-2">Send one to see it here!</p>
                        <div className="mt-6">
                            <CutesyButton onClick={() => setLocation('/')}>
                                <Send className="w-4 h-4 mr-2" /> Send a Message
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
                                transition={{ delay: i * 0.1 }}
                            >
                                <GlassCard className={cn(
                                    "p-6 rounded-3xl relative overflow-hidden border-2",
                                    msg.type === 'bouquet' ? "border-purple-200" : "border-primary/20"
                                )}>
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

                                        {msg.vibe && (
                                            <span className="px-2 py-1 bg-white/50 rounded text-xs font-ui font-bold uppercase text-stone-500 border border-stone-100">
                                                {msg.vibe}
                                            </span>
                                        )}
                                    </div>

                                    {/* NO INSTAGRAM USERNAME DISPLAY HERE (Anonymous) */}

                                    {/* Content */}
                                    <div className="relative z-10">
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
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
