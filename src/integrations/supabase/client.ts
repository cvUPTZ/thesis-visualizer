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
      'Content-Type': 'application/json',
    },
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  db: {
    schema: 'public'
  }
});

// Add retry mechanism for failed requests
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second base delay

const retryRequest = async (operation: () => Promise<any>, retries = 0): Promise<any> => {
  try {
    // Check authentication before making request
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error('❌ No authenticated session found');
      throw new Error('Authentication required');
    }

    console.log('👤 Making authenticated request with session:', session.user.email);
    return await operation();
  } catch (error: any) {
    console.error('❌ Request failed:', error);

    if (retries < MAX_RETRIES && (
      error.message === 'Failed to fetch' || 
      error.status === 503 || 
      error.status === 504 ||
      error.message === 'Authentication required'
    )) {
      const delay = RETRY_DELAY * Math.pow(2, retries);
      console.log(`🔄 Retrying request (${retries + 1}/${MAX_RETRIES}) after ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryRequest(operation, retries + 1);
    }

    console.error('❌ Max retries reached or unrecoverable error:', error);
    throw error;
  }
};

// Create a new instance of the Supabase client with the retry mechanism
const originalFrom = supabase.from.bind(supabase);
supabase.from = function(table: string) {
  const result = originalFrom(table);
  const originalSelect = result.select.bind(result);
  
  result.select = function(this: any, ...args: any[]) {
    const query = originalSelect(...args);
    const originalExecute = query.execute.bind(query);
    
    query.execute = function(this: any) {
      return retryRequest(() => originalExecute.call(this));
    };
    
    return query;
  };
  
  return result;
};