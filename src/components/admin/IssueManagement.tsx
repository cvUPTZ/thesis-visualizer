import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IssueTable } from './issues/IssueTable';

export const IssueManagement = () => {
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const { toast } = useToast();

  const fetchIssues = async () => {
    try {
      console.log('Fetching app issues...');
      setLoading(true);
      const { data, error } = await supabase
        .from('app_issues')
        .select(`
          *,
          profiles (
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('Fetched issues:', data);
      setIssues(data || []);
      setLastRefresh(new Date());
    } catch (error: any) {
      console.error('Error fetching issues:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch issues',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();

    const subscription = supabase
      .channel('app_issues_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'app_issues' 
        }, 
        () => {
          console.log('Issues table changed, refreshing data...');
          fetchIssues();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [toast]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Application Issues</h2>
          <p className="text-sm text-muted-foreground">
            Showing {issues.length} total issues • Last updated {formatDate(lastRefresh.toISOString())}
          </p>
        </div>
        <Button onClick={fetchIssues} variant="outline" className="gap-2">
          <RefreshCcw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      <div className="border rounded-lg">
        <IssueTable issues={issues} formatDate={formatDate} />
      </div>
    </div>
  );
};