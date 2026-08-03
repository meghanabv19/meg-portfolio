import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Browser/server-safe Supabase client for the Next.js site.
 * Reads from the `mart` schema only, using the public anon key.
 * Pipelines use the service-role key (see pipelines/*.py) — never shipped here.
 *
 * Returns `null` when env vars are absent so the site can fall back to
 * bundled mock data during local dev / preview builds.
 */
let _client: SupabaseClient | null | undefined;

export function getSupabase(): SupabaseClient | null {
  if (_client !== undefined) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn("[supabase] env not set — serving mock data");
    }
    _client = null;
    return _client;
  }

  // Cast: the `mart` schema generic doesn't match the default `public` type,
  // but the runtime client is what we want (all reads target the mart schema).
  _client = createClient(url, key, {
    db: { schema: "mart" },
    auth: { persistSession: false },
  }) as unknown as SupabaseClient;
  return _client;
}
