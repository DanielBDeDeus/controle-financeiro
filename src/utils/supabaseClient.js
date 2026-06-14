import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://uqxfeiadllcpkrgehcln.supabase.co";

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "sb_publishable_3lfz0OCwwPliM-qOTZ27gw_f77-_iFg";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
