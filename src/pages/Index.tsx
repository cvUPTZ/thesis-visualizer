// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import { useAuth } from '@/contexts/AuthContext';
// import { Settings, Plus, LogOut } from 'lucide-react';
// import { ThesisList } from '@/components/thesis/ThesisList';
// import { GettingStartedWizard } from '@/components/onboarding/GettingStartedWizard';
// import { StatsGrid } from '@/components/dashboard/StatsGrid';
// import { UserProfile } from '@/components/dashboard/UserProfile';
// import { useDashboardData } from '@/hooks/useDashboardData';
// import { Card } from '@/components/ui/card';
// import { Skeleton } from '@/components/ui/skeleton';
// import { useToast } from '@/hooks/use-toast';
// import { QuickTips } from '@/components/dashboard/QuickTips';

// const Index = () => {
//   const navigate = useNavigate();
//   const { userRole, userId, signOut } = useAuth();
//   const { userProfile, thesesStats, isLoading, error } = useDashboardData(userId);
//   const { toast } = useToast();

//   const handleLogout = async () => {
//     try {
//       await signOut();
//       toast({
//         title: "Logged out successfully",
//         description: "You have been logged out of your account.",
//       });
//       navigate('/auth');
//     } catch (error) {
//       console.error('Error logging out:', error);
//       toast({
//         title: "Error logging out",
//         description: "There was a problem logging out. Please try again.",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleCreateThesis = () => {
//     navigate('/create-thesis');
//     toast({
//       title: "Starting New Thesis",
//       description: "You're being redirected to create a new thesis.",
//     });
//   };

//   if (error) {
//     console.error('❌ Error rendering dashboard:', error);
//     toast({
//       title: "Error Loading Dashboard",
//       description: "There was a problem loading your dashboard data. Please try again.",
//       variant: "destructive",
//     });
//     return (
//       <div className="min-h-screen bg-[#1A1F2C] p-6">
//         <div className="text-center text-red-400">
//           Error loading dashboard data. Please try again later.
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#1A1F2C] text-gray-100">
//       <div className="container mx-auto px-4 py-8 space-y-8">
//         {/* Header Section */}
//         <div className="flex justify-between items-center">
//           <div className="space-y-1">
//             <h1 className="text-4xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#9b87f5] to-[#D6BCFA]">
//               Dashboard
//             </h1>
//             <p className="text-[#D6BCFA]/80">
//               Manage your thesis projects and track progress
//             </p>
//           </div>
//           <div className="flex items-center gap-4">
//             {userRole === 'admin' && (
//               <Button 
//                 onClick={() => navigate('/admin')} 
//                 variant="outline"
//                 className="bg-[#7E69AB]/10 hover:bg-[#7E69AB]/20 text-[#D6BCFA] border-[#D6BCFA]/20"
//               >
//                 <Settings className="w-4 h-4 mr-2" />
//                 Admin Panel
//               </Button>
//             )}
//             <Button 
//               onClick={handleLogout}
//               variant="ghost"
//               className="text-red-300 hover:text-red-200 hover:bg-red-500/10"
//             >
//               <LogOut className="w-4 h-4 mr-2" />
//               Logout
//             </Button>
//           </div>
//         </div>

//         {/* User Profile Section */}
//         {isLoading ? (
//           <Skeleton className="h-20 w-full" />
//         ) : (
//           <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6 transition-all duration-200 hover:bg-white/10">
//             <UserProfile 
//               email={userProfile?.email || ''} 
//               role={userProfile?.roles?.name || ''}
//             />
//           </div>
//         )}
        
//         {/* Stats Grid */}
//         {isLoading ? (
//           <Skeleton className="h-32 w-full" />
//         ) : (
//           <StatsGrid stats={thesesStats || { total: 0, inProgress: 0, completed: 0 }} />
//         )}

//         {/* Main Content Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Left Column - Thesis Management */}
//           <div className="space-y-6">
//             <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-serif font-semibold text-[#D6BCFA]">
//                   Thesis Management
//                 </h2>
//                 <Button
//                   onClick={handleCreateThesis}
//                   className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white"
//                 >
//                   <Plus className="w-4 h-4 mr-2" />
//                   Create New Thesis
//                 </Button>
//               </div>
//               <Card className="bg-white/5 border-[#D6BCFA]/20">
//                 <ThesisList />
//               </Card>
//             </div>
//           </div>

//           {/* Right Column - Quick Tips and Getting Started */}
//           <div className="space-y-6">
//             <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6">
//               <QuickTips />
//             </div>
//             <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6">
//               <GettingStartedWizard />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Index;








import React from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, LogOut } from "lucide-react";
import { ThesisList } from "@/components/thesis/ThesisList";
import { useAuth } from "@/contexts/AuthContext";
import { UserProfile } from "@/components/dashboard/UserProfile";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { QuickTips } from "@/components/dashboard/QuickTips";
import { useDashboardData } from "@/hooks/useDashboardData";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingSkeleton } from "@/components/loading/LoadingSkeleton";
import { ErrorState } from "@/components/error/ErrorState";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();
  const { userId, logout, loading: authLoading } = useAuth();
  const { thesesStats, isLoading: statsLoading, error: statsError } = useDashboardData(userId);
  const [userProfile, setUserProfile] = React.useState<any>(null);

  React.useEffect(() => {
    if (!userId) return;

    console.log('🔍 Fetching user profile for:', userId);
    supabase
      .from('profiles')
      .select(`
        *,
        roles (
          name
        )
      `)
      .eq('id', userId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          console.error('❌ Error fetching profile:', error);
          return;
        }
        console.log('✅ Profile fetched:', data);
        setUserProfile(data);
      });
  }, [userId]);

  console.log('📍 Index Page - Initial Render:', { 
    userId, 
    authLoading,
    statsLoading,
    userProfile
  });

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!authLoading && !userId) {
      console.log('🚫 Index Page - No active session, redirecting to welcome page');
      navigate('/welcome');
    }
  }, [userId, authLoading, navigate]);

  // Show loading skeleton only for initial auth check
  if (authLoading || !userId) {
    return <LoadingSkeleton />;
  }

  const handleLogout = async () => {
    console.log('🔄 Index Page - Initiating logout...');
    await logout();
    console.log('✅ Index Page - Logout complete');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="min-h-screen bg-gray-50"
      >
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex justify-between items-center mb-8"
          >
            {userProfile ? (
              <UserProfile
                email={userProfile?.email}
                role={userProfile?.roles?.name || "User"}
              />
            ) : (
              <div className="h-12 w-48 bg-gray-200 animate-pulse rounded" />
            )}
            <Button
              onClick={handleLogout}
              variant="outline"
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </motion.div>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {statsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-lg" />
                ))}
              </div>
            ) : statsError ? (
              <ErrorState error={statsError} onRetry={() => window.location.reload()} />
            ) : (
              <StatsGrid stats={thesesStats} />
            )}
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-between mb-8"
          >
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
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow"
          >
            <ThesisList />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <QuickTips />
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Index;