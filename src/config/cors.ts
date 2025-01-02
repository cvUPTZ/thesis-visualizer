// src/config/cors.ts
export const corsConfig = {
    development: {
      apiUrl: 'http://localhost:54321',  // Supabase local development
      credentials: 'include' as const,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': 'true',
      }
    },
    production: {
      apiUrl: 'https://xkwdfddamvuhucorwttw.supabase.co',  // Your Supabase project URL
      credentials: 'include' as const,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': 'true',
      }
    }
  };