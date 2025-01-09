import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export const FeedbackManagement = () => {
  const { data: feedback, isLoading } = useQuery({
    queryKey: ['feedback'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <Card className="w-full h-[400px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">User Feedback</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {feedback?.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.email}</TableCell>
              <TableCell>{item.message}</TableCell>
              <TableCell>{item.rating ? `${item.rating}/5` : 'N/A'}</TableCell>
              <TableCell>
                {new Date(item.created_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};