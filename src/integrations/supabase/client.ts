import { createClient } from '@supabase/supabase-js';

// Supabase project credentials (public anon key is safe to expose in frontend)
const SUPABASE_URL = 'https://szvousyzsqdpubgfycdy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6dm91c3l6c3FkcHViZ2Z5Y2R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4MjQwMTksImV4cCI6MjA2MjQwMDAxOX0.4v7kl7RnYBhHsDPNVH9DvJmUlklbDa_SlbuR2jMCjdw';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});

export default supabase;
