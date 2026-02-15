import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Loader2, UserPlus, LogIn, LogOut, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/Navigation";
import { GlassCard, CutesyButton } from "@/components/InteractiveComponents";
import { cn } from "@/lib/utils";

const COLLEGE_UID_REGEX = /^\d{2}[A-Za-z]{2}[A-Za-z]{3,4}\d{4}$/;

export default function Auth() {
  const { user, signup, login, logout, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [loading, setLoading] = useState(false);

  // Form fields
  const [fullName, setFullName] = useState("");
  const [collegeUid, setCollegeUid] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [instagramUsername, setInstagramUsername] = useState("");

  const handleSignup = async () => {
    if (!fullName.trim()) {
      toast({ variant: "destructive", title: "Oops!", description: "Enter your full name." });
      return;
    }
    if (!COLLEGE_UID_REGEX.test(collegeUid.trim())) {
      toast({ variant: "destructive", title: "Invalid UID", description: "College UID should be like 24UPHYS0077." });
      return;
    }
    if (!/^\d{10}$/.test(mobileNumber.trim())) {
      toast({ variant: "destructive", title: "Invalid number", description: "Enter a valid 10-digit mobile number." });
      return;
    }
    if (!instagramUsername.trim()) {
      toast({ variant: "destructive", title: "Required!", description: "Enter your Instagram username." });
      return;
    }

    setLoading(true);
    try {
      await signup({
        fullName: fullName.trim(),
        collegeUid: collegeUid.trim().toUpperCase(),
        mobileNumber: mobileNumber.trim(),
        instagramUsername: instagramUsername.trim().replace(/^@/, ""),
      });
      toast({ title: "Welcome! 🎉", description: "Account created successfully." });
      setLocation("/");
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!collegeUid.trim() || !mobileNumber.trim()) {
      toast({ variant: "destructive", title: "Missing info", description: "Enter both College UID and mobile number." });
      return;
    }
    setLoading(true);
    try {
      await login(collegeUid.trim().toUpperCase(), mobileNumber.trim());
      toast({ title: "Welcome back! 💕", description: "Logged in successfully." });
      setLocation("/");
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  // If already logged in, show profile
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-transparent p-4">
        <Navigation />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <GlassCard className="p-10 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-rose-200 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-white">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-2xl font-display font-bold text-ink mb-1">{user.fullName}</h2>
            <p className="text-sm text-stone-500 font-mono mb-1">{user.collegeUid}</p>
            <p className="text-sm text-pink-500 font-bold mb-1">@{user.instagramUsername}</p>
            <p className="text-xs text-stone-400 mb-6">📱 {user.mobileNumber}</p>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6">
              <p className="text-xs text-amber-600 font-bold">🔐 OTP verification coming soon!</p>
            </div>

            <CutesyButton
              onClick={() => {
                logout();
                toast({ title: "Logged out 👋" });
              }}
              className="w-full bg-stone-200 text-stone-600 hover:bg-stone-300"
            >
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </CutesyButton>
          </GlassCard>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-transparent p-4">
      <Navigation />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <GlassCard className="p-8 relative overflow-hidden">
          {/* Mode Toggle */}
          <div className="flex justify-center gap-6 mb-8">
            <button
              onClick={() => setMode("signup")}
              className={cn(
                "pb-2 text-lg font-bold transition-colors relative",
                mode === "signup" ? "text-primary" : "text-stone-400 hover:text-stone-600"
              )}
            >
              <UserPlus className="w-4 h-4 inline mr-1" /> Sign Up
              {mode === "signup" && (
                <motion.div layoutId="auth-underline" className="absolute bottom-0 left-0 right-0 h-1 rounded-full bg-primary" />
              )}
            </button>
            <button
              onClick={() => setMode("login")}
              className={cn(
                "pb-2 text-lg font-bold transition-colors relative",
                mode === "login" ? "text-primary" : "text-stone-400 hover:text-stone-600"
              )}
            >
              <LogIn className="w-4 h-4 inline mr-1" /> Login
              {mode === "login" && (
                <motion.div layoutId="auth-underline" className="absolute bottom-0 left-0 right-0 h-1 rounded-full bg-primary" />
              )}
            </button>
          </div>

          <div className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-xs font-ui font-bold uppercase tracking-widest text-stone-500 mb-1 ml-1">
                  Full Name
                </label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your real name"
                  className="w-full bg-white border-2 border-stone-200 rounded-xl p-3 text-ink outline-none focus:border-primary transition-all font-bold placeholder:font-normal placeholder:text-stone-300"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-ui font-bold uppercase tracking-widest text-stone-500 mb-1 ml-1">
                College UID
              </label>
              <input
                value={collegeUid}
                onChange={(e) => setCollegeUid(e.target.value.toUpperCase())}
                placeholder="e.g. 24UPHYS0077"
                className="w-full bg-white border-2 border-stone-200 rounded-xl p-3 text-ink outline-none focus:border-primary transition-all font-bold font-mono placeholder:font-normal placeholder:text-stone-300"
              />
            </div>

            <div>
              <label className="block text-xs font-ui font-bold uppercase tracking-widest text-stone-500 mb-1 ml-1">
                Mobile Number
              </label>
              <input
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="10-digit number"
                type="tel"
                className="w-full bg-white border-2 border-stone-200 rounded-xl p-3 text-ink outline-none focus:border-primary transition-all font-bold font-mono placeholder:font-normal placeholder:text-stone-300"
              />
            </div>

            {mode === "signup" && (
              <div>
                <label className="block text-xs font-ui font-bold uppercase tracking-widest text-stone-500 mb-1 ml-1">
                  Instagram Username
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400 font-bold">@</span>
                  <input
                    value={instagramUsername}
                    onChange={(e) => setInstagramUsername(e.target.value.replace(/^@/, ""))}
                    placeholder="your_username"
                    className="w-full bg-white border-2 border-stone-200 rounded-xl p-3 pl-8 text-ink outline-none focus:border-primary transition-all font-bold placeholder:font-normal placeholder:text-stone-300"
                  />
                </div>
              </div>
            )}

            <div className="pt-2">
              <CutesyButton
                onClick={mode === "signup" ? handleSignup : handleLogin}
                disabled={loading}
                className="w-full py-4"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : mode === "signup" ? (
                  <><Sparkles className="w-4 h-4 mr-2 inline" /> Create Account</>
                ) : (
                  <><LogIn className="w-4 h-4 mr-2 inline" /> Login</>
                )}
              </CutesyButton>
            </div>
          </div>

          <p className="text-center text-xs text-stone-400 mt-6 italic">
            Your info is kept private. Only admins can see sender details 💕
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
