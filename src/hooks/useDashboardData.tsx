import { useUserProfile } from './useUserProfile';
import { useThesisStats } from './useThesisStats';

export const useDashboardData = (userId: string | null) => {
  const { 
    data: userProfile, 
    isLoading: isProfileLoading, 
    error: profileError 
  } = useUserProfile(userId);

  const { 
    data: thesesStats, 
    isLoading: isStatsLoading, 
    error: statsError 
  } = useThesisStats(userId);

  return {
    userProfile,
    thesesStats,
    isLoading: isProfileLoading || isStatsLoading,
    error: profileError || statsError,
  };
};