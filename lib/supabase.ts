import { createClient, SupabaseClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.SUPABASE_UR;
const supabaseKey = process.env.SUPABASE_PUBLIC_KEY;

const supabase: SupabaseClient = createClient(supabaseUrl!, supabaseKey!);
export default supabase;
