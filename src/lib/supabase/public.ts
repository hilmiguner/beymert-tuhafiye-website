import { createClient } from "@supabase/supabase-js";

import { getSupabaseConfig, isSupabaseConfigured } from "@/lib/supabase/config";
import type { Database } from "@/types/database";

export function createPublicClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const { url, publishableKey } = getSupabaseConfig();

  return createClient<Database>(url, publishableKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      fetch(input, init) {
        return fetch(input, {
          ...init,
          cache: "no-store",
        });
      },
    },
  });
}
