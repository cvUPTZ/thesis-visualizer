import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Star, Users, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FeedbackItem {
  id: string;
  email: string;
  message: string;
  rating: number;
  created_at: string;
}

const AdminDashboard = () => {
  const { toast } = useToast();

  const { data: feedback, isLoading, error } = useQuery({
    queryKey: ['feedback'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load feedback data",
          variant: "destructive",
        });
        throw error;
      }

      return data as FeedbackItem[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#9b87f5]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error loading feedback data</div>
      </div>
    );
  }

  const averageRating = feedback?.reduce((acc, item) => acc + item.rating, 0) / (feedback?.length || 1);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Total Feedback</p>
                <p className="text-3xl font-bold">{feedback?.length || 0}</p>
              </div>
              <MessageSquare className="h-10 w-10 text-[#9b87f5]" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Average Rating</p>
                <p className="text-3xl font-bold">{averageRating.toFixed(1)}</p>
              </div>
              <Star className="h-10 w-10 text-[#9b87f5]" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Unique Users</p>
                <p className="text-3xl font-bold">{new Set(feedback?.map(f => f.email)).size}</p>
              </div>
              <Users className="h-10 w-10 text-[#9b87f5]" />
            </div>
          </div>
        </div>

        {/* Feedback List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Recent Feedback</h2>
            <div className="space-y-6">
              {feedback?.map((item) => (
                <div key={item.id} className="border-b pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{item.email}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className={`h-5 w-5 ${
                            index < item.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700">{item.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;