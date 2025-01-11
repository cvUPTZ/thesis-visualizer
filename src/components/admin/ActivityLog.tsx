import React from 'react';
import { Card } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export const ActivityLog = () => {
  const { data: activityData, isLoading } = useQuery({
    queryKey: ['activity-stats'],
    queryFn: async () => {
      console.log('Fetching activity statistics...');
      
      // Get messages per day
      const { data: messages, error: messagesError } = await supabase
        .from('chat_messages')
        .select('created_at')
        .order('created_at');

      if (messagesError) throw messagesError;

      // Get thesis actions per day
      const { data: thesisActions, error: thesisError } = await supabase
        .from('thesis_versions')
        .select('created_at')
        .order('created_at');

      if (thesisError) throw thesisError;

      // Get feedback submissions per day
      const { data: feedback, error: feedbackError } = await supabase
        .from('user_feedback')
        .select('created_at')
        .order('created_at');

      if (feedbackError) throw feedbackError;

      // Process data to get daily counts
      const processDataByDay = (data: any[]) => {
        return data.reduce((acc: {[key: string]: number}, item) => {
          const date = new Date(item.created_at).toISOString().split('T')[0];
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});
      };

      const messagesByDay = processDataByDay(messages || []);
      const thesisByDay = processDataByDay(thesisActions || []);
      const feedbackByDay = processDataByDay(feedback || []);

      // Combine all dates
      const allDates = [...new Set([
        ...Object.keys(messagesByDay),
        ...Object.keys(thesisByDay),
        ...Object.keys(feedbackByDay),
      ])].sort();

      // Create final dataset
      const chartData = allDates.map(date => ({
        date,
        messages: messagesByDay[date] || 0,
        thesisActions: thesisByDay[date] || 0,
        feedback: feedbackByDay[date] || 0,
      }));

      console.log('Activity data processed:', chartData);

      return chartData;
    },
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  if (isLoading) {
    return <div>Loading activity data...</div>;
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">System Activity</h2>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={activityData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="messages"
              stroke="#8884d8"
              name="Messages"
            />
            <Line
              type="monotone"
              dataKey="thesisActions"
              stroke="#82ca9d"
              name="Thesis Actions"
            />
            <Line
              type="monotone"
              dataKey="feedback"
              stroke="#ffc658"
              name="Feedback"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};