import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NotificationItem } from './NotificationItem';
import { Notification } from '../types';

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onMarkAsRead,
}) => {
  if (notifications.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No notifications yet
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
      <div className="space-y-4">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            id={notification.id}
            message={notification.message}
            createdAt={notification.created_at}
            read={notification.read}
            onMarkAsRead={onMarkAsRead}
          />
        ))}
      </div>
    </ScrollArea>
  );
};