import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

interface CommentThreadProps {
  comment: {
    id: string;
    content: {
      text: string;
      type: 'comment' | 'suggestion' | 'correction';
    };
    reviewer: {
      email: string;
    };
    created_at: string;
    status: string;
  };
}

export const CommentThread = ({ comment }: CommentThreadProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'resolved':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center gap-4 py-2">
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            {comment.reviewer.email.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-medium">{comment.reviewer.email}</span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
          </span>
        </div>
        <div className={`ml-auto px-2 py-1 rounded-full text-xs text-white ${getStatusColor(comment.status)}`}>
          {comment.status}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm">{comment.content.text}</div>
      </CardContent>
    </Card>
  );
};