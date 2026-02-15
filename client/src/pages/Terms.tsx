import { motion } from "framer-motion";
import { Shield, Eye, EyeOff, Server, Heart, AlertTriangle, Scale, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { GlassCard } from "@/components/InteractiveComponents";
import { Navigation } from "@/components/Navigation";

const Section = ({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    <GlassCard className="p-6 md:p-8 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-rose-500" />
        </div>
        <h2 className="text-xl md:text-2xl font-display font-bold text-ink">{title}</h2>
      </div>
      <div className="font-body text-ink-light leading-relaxed space-y-3 text-sm md:text-base">
        {children}
      </div>
    </GlassCard>
  </motion.div>
);

export default function Terms() {
  return (
    <div className="min-h-screen bg-transparent pb-24">
      <Navigation />

      <header className="pt-12 pb-8 px-6 text-center">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/" className="inline-flex items-center gap-1 text-xs font-ui font-bold uppercase tracking-widest text-primary mb-4 hover:text-primary/70 transition-colors">
            <ArrowLeft className="w-3 h-3" /> Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-ink mb-2">Terms & Privacy 💕</h1>
          <p className="text-ink-light font-body text-sm">How Premam Confessions handles your data — with love and care.</p>
        </motion.div>
      </header>

      <main className="max-w-2xl mx-auto px-4">
        <Section icon={Heart} title="What is Premam?">
          <p>
            Premam Confessions is a fun, anonymous confession and digital bouquet platform. You can send heartfelt
            messages and flowers to someone special — and your identity stays hidden from the public. 💌
          </p>
          <p>
            Think of it as a digital love letter box. Messages may appear on the public feed once approved by admins,
            but <strong>your identity is never shown publicly</strong>.
          </p>
        </Section>

        <Section icon={Eye} title="What We Collect">
          <p>When you send a message, we collect the following information:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong>Instagram username</strong> — to verify you're a real person</li>
            <li><strong>Device information</strong> — your browser/user agent string</li>
            <li><strong>IP address</strong> — logged automatically by our servers</li>
            <li><strong>Message content</strong> — what you write or the bouquet you choose</li>
          </ul>
          <p className="text-xs italic text-pink-400 mt-2">
            We only collect what's needed to keep the platform safe and fun. No unnecessary tracking! 🍪✖️
          </p>
        </Section>

        <Section icon={EyeOff} title="What We Don't Share">
          <p>
            <strong>Your Instagram handle is never displayed publicly.</strong> Only admins can see who sent a message.
            This is strictly for verification and moderation purposes.
          </p>
          <p>
            We do not sell, trade, or share your personal information with any third parties. Your secrets are safe with us. 🤫
          </p>
        </Section>

        <Section icon={Shield} title="Content Moderation">
          <p>
            All messages go through an approval process before appearing on the public feed. Admins may:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Approve messages to appear on the public feed</li>
            <li>Reject or delete messages that are inappropriate, harmful, or violate community standards</li>
            <li>Verify that Instagram accounts are real (fake handles will be rejected)</li>
          </ul>
          <p>
            We reserve the right to remove any content at our sole discretion. Be kind! 🌸
          </p>
        </Section>

        <Section icon={Server} title="Data Storage & Security">
          <p>
            Your data is stored securely using <strong>Supabase</strong> (hosted on trusted cloud infrastructure).
            We take reasonable measures to protect your information, but no system is 100% secure.
          </p>
          <p>
            Messages and associated data may be retained indefinitely or deleted at admin discretion.
          </p>
        </Section>

        <Section icon={AlertTriangle} title="Disclaimers">
          <p>
            Premam Confessions is provided <strong>"as is"</strong> without warranties of any kind. We are not liable for:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Content submitted by users</li>
            <li>Any emotional distress caused by messages received</li>
            <li>Service interruptions or data loss</li>
            <li>Actions taken based on information shared on the platform</li>
          </ul>
          <p className="text-xs italic text-pink-400 mt-2">
            Use this platform responsibly and spread love, not hate. 💕
          </p>
        </Section>

        <Section icon={Scale} title="Changes to These Terms">
          <p>
            We may update these terms from time to time. Continued use of Premam Confessions after changes
            constitutes acceptance of the updated terms.
          </p>
          <p>
            Questions? Reach out to the admins. We're friendly, we promise! 😊
          </p>
        </Section>

        <div className="text-center mt-8">
          <p className="text-xs text-stone-400 font-ui">Last updated: February 2026</p>
          <p className="text-xs text-stone-400 font-ui mt-1">Made with 💕 by the Premam team</p>
        </div>
      </main>
    </div>
  );
}
