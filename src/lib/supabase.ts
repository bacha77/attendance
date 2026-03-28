import { createClient } from '@supabase/supabase-js';

// These will be configured once you provide your project details
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Sabbath School Cloud Sync: Connection details missing. Defaulting to Local Storage mode.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
