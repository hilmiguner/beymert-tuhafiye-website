import { createClient } from "@supabase/supabase-js";

import {
  getSupabaseConfig,
  isSupabaseConfigured,
} from "@/lib/supabase/config";
import type { Database } from "@/types/database";

export function createPublicSupabaseClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const { url, publishableKey } = getSupabaseConfig();
  const noStoreFetch: typeof fetch = (input, init) =>
    fetch(input, { ...init, cache: "no-store" });

  return createClient<Database>(url, publishableKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
    global: {
      fetch: noStoreFetch,
    },
  });
}
