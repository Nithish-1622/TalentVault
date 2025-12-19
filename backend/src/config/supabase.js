import { createClient } from '@supabase/supabase-js';
import { config } from './index.js';

// Create Supabase client with service role key for admin operations
export const supabaseAdmin = createClient(
  config.supabase.url,
  config.supabase.serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Create Supabase client with anon key for regular operations
export const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey
);

export default supabaseAdmin;
