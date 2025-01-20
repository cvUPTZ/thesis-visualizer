import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xkwdfddamvuhucorwttw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhrd2RmZGRhbXZ1aHVjb3J3dHR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzNzcwMDQsImV4cCI6MjA1MDk1MzAwNH0.6Ml1JDiKKsjSnM1z82bD9bVoiT_ZQmTRZaqtpxTPF2g";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    flowType: 'pkce',
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web',
      'Access-Control-Allow-Origin': '*',
    },
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  db: {
    schema: 'public'
  },
  persistSession: typeof window !== 'undefined',
});

// Add error handling for failed requests
supabase.handleFailedRequest = async (error: any) => {
  console.error('Supabase request failed:', error);
  if (error.message === 'Failed to fetch') {
    // Check if user is authenticated
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      console.error('Authentication error:', authError);
      // Redirect to login or handle auth error
      return;
    }
    // Retry the request once
    return true;
  }
  return false;
};