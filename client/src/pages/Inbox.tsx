import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@shared/schema";
import { useLogin } from "@/hooks/use-creators";
import { useMessages } from "@/hooks/use-messages";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Loader2, Lock, Heart, Flower } from "lucide-react";
import { format } from "date-fns";
import { z } from "zod";
import { Navigation } from "@/components/Navigation";
import { cn } from "@/lib/utils";

type LoginFormValues = z.infer<typeof loginSchema>;

// Mock flower map again for display
const FLOWER_IMAGES: Record<string, string> = {
  "bouquet-01": "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=400&h=400&fit=crop",
  "bouquet-02": "https://images.unsplash.com/photo-1520763185298-1b434c919102?w=400&h=400&fit=crop",
  "bouquet-03": "https://images.unsplash.com/photo-1490750967868-58cb75069ed6?w=400&h=400&fit=crop",
  "bouquet-04": "https://images.unsplash.com/photo-1563241527-3004b7be0217?w=400&h=400&fit=crop",
  "bouquet-05": "https://images.unsplash.com/photo-1470509037663-253afd7f0f51?w=400&h=400&fit=crop",
  "bouquet-06": "https://images.unsplash.com/photo-1522291917539-722ba4855422?w=400&h=400&fit=crop",
};

export default function Inbox() {
  const [session, setSession] = useState<{ creatorId: number; displayName: string } | null>(null);
  const login = useLogin();
  const { toast } = useToast();
  
  // Login Form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { slug: "", passcode: "" },
  });

  const onLogin = (data: LoginFormValues) => {
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
      <div className="min-h-screen flex items-center justify-center bg-paper px-4">
        <Navigation />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md paper-card p-10 rounded-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-rose-400 to-rose-600" />
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-6 h-6 text-stone-400" />
          </div>
          
          <h1 className="text-3xl font-display text-center mb-2">Creator Access</h1>
          <p className="text-center font-body text-stone-500 mb-8 text-sm">
            Enter your credentials to view your letters.
          </p>

          <form onSubmit={form.handleSubmit(onLogin)} className="space-y-6">
            <div className="space-y-1">
              <label className="text-xs font-ui font-bold uppercase tracking-widest text-stone-400 ml-1">Page Handle</label>
              <input 
                {...form.register("slug")} 
                placeholder="sarah"
                className="w-full p-3 bg-white border border-stone-200 rounded-lg outline-none focus:border-rose-400 transition-colors" 
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-ui font-bold uppercase tracking-widest text-stone-400 ml-1">Passcode</label>
              <input 
                {...form.register("passcode")} 
                type="password"
                placeholder="••••"
                className="w-full p-3 bg-white border border-stone-200 rounded-lg outline-none focus:border-rose-400 transition-colors tracking-widest" 
              />
            </div>

            <button 
              type="submit" 
              disabled={login.isPending}
              className="w-full py-4 bg-stone-800 text-white font-ui font-bold uppercase tracking-widest rounded-lg hover:bg-stone-900 transition-colors disabled:opacity-50"
            >
              {login.isPending ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Unlock Inbox"}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return <InboxDashboard creatorId={session.creatorId} displayName={session.displayName} />;
}

function InboxDashboard({ creatorId, displayName }: { creatorId: number, displayName: string }) {
  const { data: messages, isLoading } = useMessages(creatorId);

  return (
    <div className="min-h-screen bg-paper pb-20">
      <Navigation />
      
      <header className="pt-12 px-6 pb-6 border-b border-stone-200/50 bg-white/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-end justify-between">
          <div>
            <span className="text-xs font-ui font-bold uppercase tracking-widest text-stone-400">Inbox for</span>
            <h1 className="text-4xl font-display text-ink">{displayName}</h1>
          </div>
          <div className="text-right">
            <span className="text-3xl font-display text-rose-600 block leading-none">
              {messages?.length || 0}
            </span>
            <span className="text-[10px] font-ui font-bold uppercase tracking-widest text-stone-400">
              Letters
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-8">
        {isLoading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-stone-300" />
          </div>
        ) : messages?.length === 0 ? (
          <div className="text-center py-20 text-stone-400">
            <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 opacity-50" />
            </div>
            <p className="font-display text-xl">No letters yet.</p>
            <p className="font-body text-sm mt-2">Share your link to receive some love.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {messages?.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "p-6 rounded-xl border bg-white shadow-sm relative overflow-hidden",
                  msg.type === 'bouquet' ? "border-purple-200" : "border-rose-200"
                )}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
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
                    <span className="px-2 py-1 bg-stone-100 rounded text-xs font-ui font-bold uppercase text-stone-500">
                      {msg.vibe}
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
                        <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-stone-100">
                          <img 
                            src={FLOWER_IMAGES[msg.bouquetId]} 
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

                {/* Decoration */}
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-tl from-stone-100 to-transparent rounded-full opacity-50 z-0 pointer-events-none" />
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
