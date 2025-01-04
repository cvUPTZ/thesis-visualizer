import { supabase } from '@/integrations/supabase/client';

export const setupGlobalErrorHandler = () => {
  window.onerror = async (message, source, lineno, colno, error) => {
    try {
      const browserInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
      };

      await supabase.from('app_issues').insert({
        error_message: message.toString(),
        error_stack: error?.stack,
        route_path: window.location.pathname,
        browser_info: JSON.stringify(browserInfo),
      });
    } catch (err) {
      console.error('Failed to log error:', err);
    }
  };

  window.addEventListener('unhandledrejection', async (event) => {
    try {
      const browserInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
      };

      await supabase.from('app_issues').insert({
        error_message: event.reason?.message || 'Unhandled Promise Rejection',
        error_stack: event.reason?.stack,
        route_path: window.location.pathname,
        browser_info: JSON.stringify(browserInfo),
      });
    } catch (err) {
      console.error('Failed to log error:', err);
    }
  });
};