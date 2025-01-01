// src/integrations/supabase/client.ts

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xkwdfddamvuhucorwttw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhrd2RmZGRhbXZ1aHVjb3J3dHR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzNzcwMDQsImV4cCI6MjA1MDk1MzAwNH0.6Ml1JDiKKsjSnM1z82bD9bVoiT_ZQmTRZaqtpxTPF2g";

if (!SUPABASE_URL) {
    throw new Error("Missing env variable VITE_SUPABASE_URL")
}
if (!SUPABASE_PUBLISHABLE_KEY) {
  throw new Error("Missing env variable VITE_SUPABASE_ANON_KEY")
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);