import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ThesisList } from "@/components/thesis/ThesisList";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { UserProfile } from "@/components/dashboard/UserProfile";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { QuickTips } from "@/components/dashboard/QuickTips";
import { useDashboardData } from "@/hooks/useDashboardData";

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
  const { userId } = useAuth();
  const { userProfile, thesesStats, isLoading, error } = useDashboardData(userId);

  console.log('📍 Index Page - Initial Render:', { userId, isLoading, error });

  if (!userId) {
    console.log('🚫 Index Page - No userId, redirecting to auth');
    navigate('/auth');
    return null;
  }

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

  if (isLoading || !userProfile) {
    console.log('⌛ Index Page - Loading state:', { isLoading, userProfile });
    return <LoadingSkeleton />;
  }

  console.log('✅ Index Page - Render complete:', { 
    userProfile, 
    thesesStats,
    isAuthenticated: !!userId 
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <UserProfile
          email={userProfile?.email}
          role={userProfile?.roles?.name || "User"}
        />

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