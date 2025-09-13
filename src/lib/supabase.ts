import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// For development, use placeholder values if environment variables are not set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Log a warning instead of throwing an error
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Missing Supabase environment variables. Using placeholder values. The app will not function correctly without real Supabase credentials.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Media = Database['public']['Tables']['media']['Row'];
export type Link = Database['public']['Tables']['links']['Row'];
export type Social = Database['public']['Tables']['socials']['Row'];
export type Admin = Database['public']['Tables']['admins']['Row'];
