import React from 'react';
import { formatDistanceToNow } from 'date-fns';

interface NotificationItemProps {
  id: string;
  message: string;
  createdAt: string;
  read: boolean;
  onMarkAsRead: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  id,
  message,
  createdAt,
  read,
  onMarkAsRead,
}) => {
  return (
    <div
      className={`p-4 rounded-lg ${read ? 'bg-muted' : 'bg-muted/50'}`}
      onClick={() => !read && onMarkAsRead(id)}
    >
      <p className="text-sm">{message}</p>
      <span className="text-xs text-muted-foreground">
        {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
      </span>
    </div>
  );
};