import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw } from 'lucide-react';

export const IssueManagement = () => {
  const { data: issues, isLoading, error, refetch } = useQuery({
    queryKey: ['app-issues'],
    queryFn: async () => {
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
      return data;
    }
  });

  if (isLoading) {
    return (
      <Card className="w-full h-[400px] flex items-center justify-center">
        <CardContent className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading issues...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Error Loading Issues</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {error instanceof Error ? error.message : 'Failed to load issues'}
          </p>
          <Button 
            onClick={() => refetch()} 
            variant="outline" 
            className="mt-4"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Application Issues</h2>
        <Button 
          onClick={() => refetch()} 
          variant="outline" 
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Component</TableHead>
              <TableHead>Error Message</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Browser</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {issues?.map((issue) => (
              <TableRow key={issue.id}>
                <TableCell>
                  <Badge variant="outline">
                    {issue.component_name || 'Unknown'}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-md truncate">
                  {issue.error_message}
                </TableCell>
                <TableCell>{issue.profiles?.email || 'Anonymous'}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {issue.browser_info}
                </TableCell>
                <TableCell>
                  {new Date(issue.created_at).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
            {!issues?.length && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No issues found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};