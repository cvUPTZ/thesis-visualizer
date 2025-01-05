import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IssueDetailsDialog } from './IssueDetailsDialog';

interface IssueTableProps {
  issues: any[];
  formatDate: (date: string) => string;
}

export const IssueTable = ({ issues, formatDate }: IssueTableProps) => {
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

  return (
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
              <IssueDetailsDialog issue={issue} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};