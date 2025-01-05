import { useQuery } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import type { AuthState } from '@/types/auth';

export const useAuthSession = () => {
  return useQuery({
    queryKey: ['auth-session'],
    queryFn: authService.getSession,
    staleTime: 1000 * 60 * 5, // Consider session data fresh for 5 minutes
    refetchOnWindowFocus: true,
  });
};