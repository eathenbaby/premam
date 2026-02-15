import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, UserPlus, LogIn, LogOut, Sparkles, Mail, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/Navigation";
import { GlassCard, CutesyButton } from "@/components/InteractiveComponents";
import { cn } from "@/lib/utils";

const COLLEGE_UID_REGEX = /^[A-Za-z0-9]{6,20}$/;

type Step = "form" | "otp";

export default function Auth() {
  const { user, sendSignupOtp, verifySignupOtp, sendLoginOtp, verifyLoginOtp, logout, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [step, setStep] = useState<Step>("form");
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [collegeUid, setCollegeUid] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [instagramUsername, setInstagramUsername] = useState("");
  const [otpCode, setOtpCode] = useState("");

  const resetForm = () => {
    setStep("form");
    setOtpCode("");
    setLoading(false);
  };

  const switchMode = (newMode: "login" | "signup") => {
    setMode(newMode);
    resetForm();
  };

  const handleSignupSubmit = async () => {
    if (!fullName.trim()) {
      toast({ variant: "destructive", title: "Oops!", description: "Enter your full name." });
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast({ variant: "destructive", title: "Invalid email", description: "Enter a valid email address." });
      return;
    }
    if (!COLLEGE_UID_REGEX.test(collegeUid.trim())) {
      toast({ variant: "destructive", title: "Invalid UID", description: "Enter your college UID." });
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
      await sendSignupOtp(email.trim().toLowerCase());
      toast({ title: "Code sent! 📧", description: `Check ${email.trim()} for your verification code.` });
      setStep("otp");
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSignupVerify = async () => {
    if (!otpCode.trim() || otpCode.trim().length < 6) {
      toast({ variant: "destructive", title: "Invalid code", description: "Enter the verification code from your email." });
      return;
    }

    setLoading(true);
    try {
      await verifySignupOtp(email.trim().toLowerCase(), otpCode.trim(), {
        fullName: fullName.trim(),
        collegeUid: collegeUid.trim().toUpperCase(),
        mobileNumber: mobileNumber.trim(),
        instagramUsername: instagramUsername.trim().replace(/^@/, ""),
      });
      toast({ title: "Welcome! 🎉", description: "Account created and verified!" });
      setLocation("/");
    } catch (err: any) {
      toast({ variant: "destructive", title: "Verification failed", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async () => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast({ variant: "destructive", title: "Invalid email", description: "Enter a valid email address." });
      return;
    }

    setLoading(true);
    try {
      await sendLoginOtp(email.trim().toLowerCase());
      toast({ title: "Code sent! 📧", description: `Check ${email.trim()} for your login code.` });
      setStep("otp");
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleLoginVerify = async () => {
    if (!otpCode.trim() || otpCode.trim().length < 6) {
      toast({ variant: "destructive", title: "Invalid code", description: "Enter the verification code from your email." });
      return;
    }

    setLoading(true);
    try {
      await verifyLoginOtp(email.trim().toLowerCase(), otpCode.trim());
      toast({ title: "Welcome back! 💕", description: "Logged in successfully." });
      setLocation("/");
    } catch (err: any) {
      toast({ variant: "destructive", title: "Verification failed", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Profile view (logged in)
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Navigation />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <GlassCard className="p-10 text-center">
            <div className="w-20 h-20 bg-burgundy rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-display font-bold text-parchment">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-2xl font-display font-semibold text-ink mb-1">{user.fullName}</h2>
            <p className="text-sm text-ink-light font-mono mb-1">{user.collegeUid}</p>
            <p className="text-sm text-burgundy font-bold font-ui mb-1">@{user.instagramUsername}</p>
            <p className="text-xs text-ink-light mb-1">📧 {user.email}</p>
            <p className="text-xs text-ink-light mb-6">📱 {user.mobileNumber}</p>

            <div className="bg-parchment-aged/50 border border-burgundy/10 rounded-lg p-3 mb-6">
              <p className="text-xs text-accent font-bold font-ui">✅ Email verified</p>
            </div>

            <CutesyButton
              onClick={() => {
                logout();
                toast({ title: "Logged out 👋" });
              }}
              className="w-full bg-parchment-aged text-ink-light hover:bg-blush-light/30 border border-burgundy/10"
            >
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </CutesyButton>
          </GlassCard>
        </motion.div>
      </div>
    );
  }

  // OTP verification
  if (step === "otp") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Navigation />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <GlassCard className="p-8 text-center">
            <div className="w-16 h-16 bg-blush-light/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-7 h-7 text-burgundy" />
            </div>

            <h2 className="text-2xl font-display font-semibold text-ink mb-2">Check your email! 📧</h2>
            <p className="text-sm text-ink-light font-body mb-1">We sent a verification code to</p>
            <p className="text-sm font-bold text-burgundy font-mono mb-6">{email.trim()}</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-ui font-bold uppercase tracking-widest text-ink-light mb-1 ml-1">
                  Verification Code
                </label>
                <input
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 8))}
                  placeholder="••••••"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  autoFocus
                  className="w-full bg-parchment border-2 border-burgundy/20 rounded-lg p-4 text-ink outline-none focus:border-burgundy/40 transition-all duration-300 font-bold font-mono text-2xl text-center tracking-[0.5em] placeholder:text-ink-light/30 placeholder:tracking-[0.5em]"
                />
              </div>

              <CutesyButton
                onClick={mode === "signup" ? handleSignupVerify : handleLoginVerify}
                disabled={loading || otpCode.length < 6}
                className={cn("w-full py-4", otpCode.length < 6 && "opacity-50")}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  <><Sparkles className="w-4 h-4 mr-2 inline" /> Verify & Continue</>
                )}
              </CutesyButton>

              <button
                onClick={resetForm}
                className="flex items-center gap-1 mx-auto text-sm text-ink-light hover:text-ink transition-colors duration-300 font-body"
              >
                <ArrowLeft className="w-3 h-3" /> Go back
              </button>
            </div>

            <p className="text-[10px] text-ink-light/60 mt-6 italic font-body">
              Didn't get the code? Check your spam folder, or go back and try again.
            </p>
          </GlassCard>
        </motion.div>
      </div>
    );
  }

  // Form screen
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Navigation />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <GlassCard className="p-8 relative overflow-hidden">
          {/* Mode Toggle */}
          <div className="flex justify-center gap-6 mb-8">
            <button
              onClick={() => switchMode("signup")}
              className={cn(
                "pb-2 text-lg font-display font-semibold transition-colors duration-300 relative",
                mode === "signup" ? "text-burgundy" : "text-ink-light hover:text-ink"
              )}
            >
              <UserPlus className="w-4 h-4 inline mr-1" /> Sign Up
              {mode === "signup" && (
                <motion.div layoutId="auth-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-burgundy" />
              )}
            </button>
            <button
              onClick={() => switchMode("login")}
              className={cn(
                "pb-2 text-lg font-display font-semibold transition-colors duration-300 relative",
                mode === "login" ? "text-burgundy" : "text-ink-light hover:text-ink"
              )}
            >
              <LogIn className="w-4 h-4 inline mr-1" /> Login
              {mode === "login" && (
                <motion.div layoutId="auth-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-burgundy" />
              )}
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: mode === "signup" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === "signup" ? 20 : -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="space-y-4"
            >
              {mode === "signup" && (
                <div>
                  <label className="block text-xs font-ui font-bold uppercase tracking-widest text-ink-light mb-1 ml-1">
                    Full Name
                  </label>
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your real name"
                    className="w-full bg-parchment border border-burgundy/15 rounded-lg p-3 text-ink outline-none focus:border-burgundy/40 transition-all duration-300 font-body placeholder:text-ink-light/40"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-ui font-bold uppercase tracking-widest text-ink-light mb-1 ml-1">
                  Email Address
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  type="email"
                  className="w-full bg-parchment border border-burgundy/15 rounded-lg p-3 text-ink outline-none focus:border-burgundy/40 transition-all duration-300 font-body placeholder:text-ink-light/40"
                />
                <p className="text-[10px] text-ink-light/60 mt-1 ml-1 font-body italic">We'll send a verification code here</p>
              </div>

              {mode === "signup" && (
                <>
                  <div>
                    <label className="block text-xs font-ui font-bold uppercase tracking-widest text-ink-light mb-1 ml-1">
                      College UID
                    </label>
                    <input
                      value={collegeUid}
                      onChange={(e) => setCollegeUid(e.target.value.toUpperCase())}
                      placeholder="Your college UID"
                      className="w-full bg-parchment border border-burgundy/15 rounded-lg p-3 text-ink outline-none focus:border-burgundy/40 transition-all duration-300 font-bold font-mono placeholder:font-normal placeholder:text-ink-light/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-ui font-bold uppercase tracking-widest text-ink-light mb-1 ml-1">
                      Mobile Number
                    </label>
                    <input
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="10-digit number"
                      type="tel"
                      className="w-full bg-parchment border border-burgundy/15 rounded-lg p-3 text-ink outline-none focus:border-burgundy/40 transition-all duration-300 font-bold font-mono placeholder:font-normal placeholder:text-ink-light/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-ui font-bold uppercase tracking-widest text-ink-light mb-1 ml-1">
                      Instagram Username
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-burgundy/50 font-bold font-ui">@</span>
                      <input
                        value={instagramUsername}
                        onChange={(e) => setInstagramUsername(e.target.value.replace(/^@/, ""))}
                        placeholder="your_username"
                        className="w-full bg-parchment border border-burgundy/15 rounded-lg p-3 pl-8 text-ink outline-none focus:border-burgundy/40 transition-all duration-300 font-body placeholder:text-ink-light/40"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="pt-2">
                <CutesyButton
                  onClick={mode === "signup" ? handleSignupSubmit : handleLoginSubmit}
                  disabled={loading}
                  className="w-full py-4"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    <><Mail className="w-4 h-4 mr-2 inline" /> Send Verification Code</>
                  )}
                </CutesyButton>
              </div>
            </motion.div>
          </AnimatePresence>

          <p className="text-center text-xs text-ink-light/60 mt-6 italic font-body">
            Your info is kept private. Only admins can see sender details 💕
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
