import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://szvousyzsqdpubgfycdy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6dm91c3l6c3FkcHViZ2Z5Y2R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4MjQwMTksImV4cCI6MjA2MjQwMDAxOX0.4v7kl7RnYBhHsDPNVH9DvJmUlklbDa_SlbuR2jMCjdw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);