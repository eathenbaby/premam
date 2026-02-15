import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

const STORAGE_KEY = "premam_user";

export interface PremamUser {
  id: number;
  fullName: string;
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
    collegeUid: row.college_uid,
    mobileNumber: row.mobile_number,
    instagramUsername: row.instagram_username,
  };
}

export function useAuth() {
  const [user, setUser] = useState<PremamUser | null>(loadUser);

  // Keep in sync across tabs
  useEffect(() => {
    const handler = () => setUser(loadUser());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const signup = useCallback(async (data: {
    fullName: string;
    collegeUid: string;
    mobileNumber: string;
    instagramUsername: string;
  }) => {
    // Check if collegeUid already exists
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("college_uid", data.collegeUid)
      .limit(1);

    if (existing && existing.length > 0) {
      throw new Error("This College UID is already registered. Try logging in instead!");
    }

    const { data: rows, error } = await supabase
      .from("users")
      .insert({
        full_name: data.fullName,
        college_uid: data.collegeUid,
        mobile_number: data.mobileNumber,
        instagram_username: data.instagramUsername.replace(/^@/, ""),
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    const u = mapRow(rows);
    saveUser(u);
    setUser(u);
    return u;
  }, []);

  const login = useCallback(async (collegeUid: string, mobileNumber: string) => {
    const { data: rows, error } = await supabase
      .from("users")
      .select("*")
      .eq("college_uid", collegeUid)
      .eq("mobile_number", mobileNumber)
      .limit(1);

    if (error) throw new Error(error.message);
    if (!rows || rows.length === 0) {
      throw new Error("No account found with that College UID and mobile number.");
    }

    const u = mapRow(rows[0]);
    saveUser(u);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    clearUser();
    setUser(null);
  }, []);

  return {
    user,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };
}
