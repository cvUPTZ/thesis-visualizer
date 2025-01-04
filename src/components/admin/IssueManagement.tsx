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
} from '@/components/ui/dialog';

export const IssueManagement = () => {
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const { data, error } = await supabase
        .from('app_issues')
        .select('*, profiles(email)')
        .order('created_at', { ascending: false });

      if (error) throw error;
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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Error Message</TableHead>
            <TableHead>Route</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {issues.map((issue) => (
            <TableRow key={issue.id}>
              <TableCell>{issue.profiles?.email || 'Anonymous'}</TableCell>
              <TableCell className="max-w-md truncate">
                {issue.error_message}
              </TableCell>
              <TableCell>{issue.route_path || 'N/A'}</TableCell>
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
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold">Error Message</h4>
                        <p className="text-sm">{issue.error_message}</p>
                      </div>
                      {issue.error_stack && (
                        <div>
                          <h4 className="font-semibold">Stack Trace</h4>
                          <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-60">
                            {issue.error_stack}
                          </pre>
                        </div>
                      )}
                      {issue.component_name && (
                        <div>
                          <h4 className="font-semibold">Component</h4>
                          <p className="text-sm">{issue.component_name}</p>
                        </div>
                      )}
                      {issue.browser_info && (
                        <div>
                          <h4 className="font-semibold">Browser Info</h4>
                          <pre className="text-xs bg-gray-100 p-2 rounded">
                            {JSON.stringify(JSON.parse(issue.browser_info), null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
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