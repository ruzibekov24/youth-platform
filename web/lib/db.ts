import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function dbConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

// Faqat server. Service role kaliti brauzerga hech qachon chiqmaydi.
export function db(): SupabaseClient {
  if (!dbConfigured()) throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY sozlanmagan");
  client ??= createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
  return client;
}
