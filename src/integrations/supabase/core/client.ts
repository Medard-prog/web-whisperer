
import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kadoutdcicucjyqvjihn.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthZG91dGRjaWN1Y2p5cXZqaWhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3NTk4MzYsImV4cCI6MjA1NjMzNTgzNn0.275ggz_qZkQo4MvW2Rm75JbYixKje8vaWfZ_6RfNXr0';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('projects').select('count').limit(1);
    
    if (error) {
      console.error("Supabase connection test failed:", error);
      return false;
    }
    
    console.log("Supabase connection successful");
    return true;
  } catch (error) {
    console.error("Supabase connection test failed:", error);
    return false;
  }
};
