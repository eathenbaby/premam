import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

const STORAGE_KEY = "premam_user";

export interface PremamUser {
  id: number;
  fullName: string;
  email: string;
  collegeUid: string;
  mobileNumber: string;
  instagramUsername: string;
}

function loadUser(): PremamUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PremamUser;
  } catch {
    return null;
  }
}

function saveUser(user: PremamUser) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

function clearUser() {
  localStorage.removeItem(STORAGE_KEY);
}

function mapRow(row: any): PremamUser {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    collegeUid: row.college_uid,
    mobileNumber: row.mobile_number,
    instagramUsername: row.instagram_username,
  };
}

export function useAuth() {
  const [user, setUser] = useState<PremamUser | null>(loadUser);

  useEffect(() => {
    const handler = () => setUser(loadUser());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  /** Step 1 of signup: send OTP to email */
  const sendSignupOtp = useCallback(async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) throw new Error(error.message);
  }, []);

  /** Step 2 of signup: verify OTP then create user row */
  const verifySignupOtp = useCallback(async (
    email: string,
    token: string,
    profile: { fullName: string; collegeUid: string; mobileNumber: string; instagramUsername: string },
  ) => {
    const { error: otpErr } = await supabase.auth.verifyOtp({ email, token, type: "email" });
    if (otpErr) throw new Error(otpErr.message);

    // Check if collegeUid already taken
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("college_uid", profile.collegeUid)
      .limit(1);

    if (existing && existing.length > 0) {
      throw new Error("This College UID is already registered. Try logging in instead!");
    }

    // Check if email already registered
    const { data: existingEmail } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .limit(1);

    if (existingEmail && existingEmail.length > 0) {
      throw new Error("This email is already registered. Try logging in instead!");
    }

    const { data: row, error } = await supabase
      .from("users")
      .insert({
        full_name: profile.fullName,
        email,
        college_uid: profile.collegeUid,
        mobile_number: profile.mobileNumber,
        instagram_username: profile.instagramUsername.replace(/^@/, ""),
        is_verified: true,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    const u = mapRow(row);
    saveUser(u);
    setUser(u);
    return u;
  }, []);

  /** Step 1 of login: send OTP to email */
  const sendLoginOtp = useCallback(async (email: string) => {
    // Verify that a user exists with this email first
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .limit(1);

    if (!existing || existing.length === 0) {
      throw new Error("No account found with that email. Sign up first!");
    }

    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) throw new Error(error.message);
  }, []);

  /** Step 2 of login: verify OTP then load user */
  const verifyLoginOtp = useCallback(async (email: string, token: string) => {
    const { error: otpErr } = await supabase.auth.verifyOtp({ email, token, type: "email" });
    if (otpErr) throw new Error(otpErr.message);

    const { data: rows, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .limit(1);

    if (error) throw new Error(error.message);
    if (!rows || rows.length === 0) {
      throw new Error("No account found with that email.");
    }

    const u = mapRow(rows[0]);
    saveUser(u);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut().catch(() => {});
    clearUser();
    setUser(null);
  }, []);

  return {
    user,
    sendSignupOtp,
    verifySignupOtp,
    sendLoginOtp,
    verifyLoginOtp,
    logout,
    isAuthenticated: !!user,
  };
}
