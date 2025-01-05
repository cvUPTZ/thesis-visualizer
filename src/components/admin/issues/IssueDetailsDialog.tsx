import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';

interface IssueDetailsDialogProps {
  issue: any;
}

export const IssueDetailsDialog = ({ issue }: IssueDetailsDialogProps) => {
  return (
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
  );
};