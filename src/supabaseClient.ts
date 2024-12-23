import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://sdcqcqdazlzaeahatuqe.supabase.co";
const subabaseKey = import.meta.env.VITE_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, subabaseKey);

export default supabase;
