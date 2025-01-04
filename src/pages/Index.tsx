import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ThesisCreationModal } from '@/components/thesis/ThesisCreationModal';
import { ThesisList } from '@/components/thesis/ThesisList';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  console.log('🔄 Rendering Index with auth state:', { isAuthenticated });

  const { data: userProfile, error: profileError } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      try {
        console.log('🔍 Fetching user profile...');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          console.log('⚠️ No session found');
          return null;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select(`
            *,
            roles (
              name
            )
          `)
          .eq('id', session.user.id)
          .maybeSingle();

        if (error) {
          console.error('❌ Error fetching profile:', error);
          throw error;
        }

        if (!profile) {
          console.log('⚠️ No profile found for user');
          return null;
        }

        console.log('✅ Profile fetched:', profile);
        return profile;
      } catch (error) {
        console.error('❌ Error in profile query:', error);
        throw error;
      }
    },
    enabled: isAuthenticated,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
  });

  // Handle authentication check after query is ready
  React.useEffect(() => {
    if (!isAuthenticated) {
      console.log('🚫 User not authenticated, redirecting...');
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  if (profileError) {
    console.error('❌ Profile error:', profileError);
    toast({
      title: "Error",
      description: "Failed to load user profile. Please try again.",
      variant: "destructive",
    });
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg text-red-500">Error loading profile</div>
      </div>
    );
  }

  const handleThesisCreated = (thesisId: string) => {
    console.log('✨ Thesis created, navigating to:', thesisId);
    navigate(`/thesis/${thesisId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to Thesis Editor</h1>
        <p className="text-gray-600">
          Create, manage, and collaborate on your thesis documents
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <ThesisCreationModal onThesisCreated={handleThesisCreated} />
        <div className="flex items-center space-x-4">
          {userProfile?.roles?.name === 'admin' && (
            <button
              onClick={() => navigate('/admin')}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            >
              Admin Panel
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <ThesisList />
      </div>
    </div>
  );
};

export default Index;