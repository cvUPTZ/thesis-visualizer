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

export const IssueManagement = () => {
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      console.log('Fetching app issues...');
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

  if (loading) {
    return <div>Loading issues...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Application Issues</h2>
        <Button onClick={fetchIssues} variant="outline">
          Refresh
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Error Message</TableHead>
            <TableHead>Route</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {issues.map((issue) => (
            <TableRow key={issue.id}>
              <TableCell>{issue.profiles?.email || 'Anonymous'}</TableCell>
              <TableCell className="max-w-[300px] truncate">
                {issue.error_message}
              </TableCell>
              <TableCell>{issue.route_path}</TableCell>
              <TableCell>
                {new Date(issue.created_at).toLocaleDateString()}
              </TableCell>
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
                            <pre className="text-sm bg-muted p-2 rounded">
                              {issue.error_stack}
                            </pre>
                          </div>
                        )}
                        {issue.component_name && (
                          <div>
                            <h3 className="font-semibold">Component Stack</h3>
                            <pre className="text-sm bg-muted p-2 rounded">
                              {issue.component_name}
                            </pre>
                          </div>
                        )}
                        {issue.browser_info && (
                          <div>
                            <h3 className="font-semibold">Browser Information</h3>
                            <pre className="text-sm bg-muted p-2 rounded">
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
  );
};