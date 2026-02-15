import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fail gracefully if env vars are missing (e.g. before server restart)
// This prevents the "Block Pink Page" (Crash) on load
let client;

if (supabaseUrl && supabaseAnonKey) {
    client = createClient(supabaseUrl, supabaseAnonKey);
} else {
    console.warn("Supabase credentials missing. Check .env file and RESTART dev server.");
    // Mock client that returns errors instead of crashing
    client = {
        from: () => ({
            select: () => Promise.resolve({ data: [], error: { message: "Supabase not configured. Restart server?" } }),
            insert: () => Promise.resolve({ error: { message: "Supabase not configured. Restart server?" } }),
            update: () => Promise.resolve({ error: { message: "Supabase not configured. Restart server?" } }),
            delete: () => Promise.resolve({ error: { message: "Supabase not configured. Restart server?" } }),
        })
    } as any;
}

export const supabase = client;
