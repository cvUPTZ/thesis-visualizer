// src/lib/api.ts
import axios from 'axios';
import { corsConfig } from '@/config/cors';

const env = process.env.NODE_ENV || 'development';
const config = corsConfig[env as keyof typeof corsConfig];

export const apiClient = axios.create({
  baseURL: config.apiUrl,
  withCredentials: true,
  headers: config.headers,
});

// Add request interceptor
apiClient.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

// Add response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      const { error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) {
        // Redirect to login if refresh fails
        window.location.href = '/auth';
      } else {
        // Retry the original request
        return apiClient(error.config);
      }
    }
    return Promise.reject(error);
  }
);