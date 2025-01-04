import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, LogOut } from "lucide-react";
import { ThesisList } from "@/components/thesis/ThesisList";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { UserProfile } from "@/components/dashboard/UserProfile";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { QuickTips } from "@/components/dashboard/QuickTips";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useEffect } from "react";

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gray-50 p-8">
    <div className="container mx-auto">
      <div className="mb-8">
        <Skeleton className="h-12 w-64 mb-2" />
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg p-6 shadow">
            <Skeleton className="h-4 w-24 mb-4" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  </div>
);

const Index = () => {
  const navigate = useNavigate();
  const { user, logout, loading: authLoading } = useAuth();
  const { userProfile, thesesStats, isLoading: dataLoading, error } = useDashboardData(user?.id);

  console.log('📍 Index Page - Initial Render:', { 
    userId: user?.id, 
    authLoading, 
    dataLoading, 
    error,
    userProfile 
  });

  useEffect(() => {
    if (!authLoading && !user) {
      console.log('🚫 Index Page - No active session, redirecting to welcome page');
      navigate('/welcome');
    }
  }, [user, authLoading, navigate]);

  // Show loading skeleton while either auth or data is loading
  if (authLoading || dataLoading) {
    console.log('⌛ Index Page - Loading state:', { authLoading, dataLoading });
    return <LoadingSkeleton />;
  }

  // Handle error state
  if (error) {
    console.log('❌ Index Page - Error:', error);
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Dashboard
          </h2>
          <p className="text-gray-600">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4"
            variant="outline"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Handle case where we have no user profile
  if (!userProfile) {
    console.log('⚠️ Index Page - No user profile found');
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold text-yellow-600 mb-4">
            Profile Not Found
          </h2>
          <p className="text-gray-600">Unable to load your profile. Please try logging in again.</p>
          <Button
            onClick={() => navigate('/auth')}
            className="mt-4"
            variant="outline"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    console.log('🔄 Index Page - Initiating logout...');
    await logout();
    console.log('✅ Index Page - Logout complete');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <UserProfile
            email={userProfile.email}
            role={userProfile.roles?.name || "User"}
          />
          <Button
            onClick={handleLogout}
            variant="outline"
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        <StatsGrid stats={thesesStats} />

        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-serif font-semibold text-primary">
            Your Theses
          </h2>
          <Button
            onClick={() => navigate("/create-thesis")}
            className="bg-primary hover:bg-primary-light text-white"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Start New Thesis
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <ThesisList />
        </div>

        <QuickTips />
      </div>
    </div>
  );
};

export default Index;