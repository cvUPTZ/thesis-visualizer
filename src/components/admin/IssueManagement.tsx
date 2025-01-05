import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, RefreshCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const IssueManagement = () => {
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const { toast } = useToast();

    useEffect(() => {
        let subscription: any;

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
    fetchIssues();

    // Set up real-time subscription
     subscription = supabase
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
            if(subscription){
                supabase.removeChannel(subscription);
            }
        };
    }, [toast]);


  const getStatusBadge = (error: any) => {
    if (error.error_stack?.includes('TypeError')) {
      return <Badge variant="destructive">Type Error</Badge>;
    }
    if (error.error_stack?.includes('ReferenceError')) {
      return <Badge variant="destructive">Reference Error</Badge>;
    }
    if (error.error_stack?.includes('SyntaxError')) {
      return <Badge variant="destructive">Syntax Error</Badge>;
    }
    return <Badge variant="secondary">Runtime Error</Badge>;
  };

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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Error Message</TableHead>
              <TableHead>Component</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {issues.map((issue) => (
              <TableRow key={issue.id}>
                <TableCell>{getStatusBadge(issue)}</TableCell>
                <TableCell>{issue.profiles?.email || 'Anonymous'}</TableCell>
                <TableCell className="max-w-[300px] truncate">
                  {issue.error_message}
                </TableCell>
                <TableCell>{issue.component_name || 'N/A'}</TableCell>
                <TableCell>{issue.route_path || 'N/A'}</TableCell>
                <TableCell>{formatDate(issue.created_at)}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Issue Details</DialogTitle>
                      </DialogHeader>
                      <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-semibold">Error Message</h3>
                            <p className="text-sm">{issue.error_message}</p>
                          </div>
                          {issue.error_stack && (
                            <div>
                              <h3 className="font-semibold">Stack Trace</h3>
                              <pre className="text-sm bg-muted p-2 rounded overflow-x-auto">
                                {issue.error_stack}
                              </pre>
                            </div>
                          )}
                          {issue.component_name && (
                            <div>
                              <h3 className="font-semibold">Component</h3>
                              <pre className="text-sm bg-muted p-2 rounded">
                                {issue.component_name}
                              </pre>
                            </div>
                          )}
                          {issue.browser_info && (
                            <div>
                              <h3 className="font-semibold">Browser Information</h3>
                              <pre className="text-sm bg-muted p-2 rounded overflow-x-auto">
                                {JSON.stringify(JSON.parse(issue.browser_info), null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};