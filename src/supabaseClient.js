import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iwtqlnktjfsehgubgnuc.supabase.co';
const supabaseAnonKey = 'sb_publishable_AdjB0mJ0fTF9X5D6AOXGCg_M02q_NlO';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be defined in the .env file');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

if (typeof window !== 'undefined') {
  window.supabase = supabase;
}
