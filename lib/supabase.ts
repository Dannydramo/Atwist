import { createClient, SupabaseClient } from "@supabase/supabase-js";
const supabaseUrl = "https://wpohczmajoaxjjxyttgk.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indwb2hjem1ham9heGpqeHl0dGdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODY0MjA1NjMsImV4cCI6MjAwMTk5NjU2M30.PgdGxIMGVHgfhDkjLrwBkl8fqdaJFbPQiT5O2bg0x7s";

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);
export default supabase;
