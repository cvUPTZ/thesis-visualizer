import React from 'react';
import { NotificationItem } from './NotificationItem';
import { Notification } from '../types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onMarkAsRead,
}) => {
  console.log('🎯 Rendering NotificationList with', notifications.length, 'notifications');
  
  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-2 p-4">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onMarkAsRead={onMarkAsRead}
          />
        ))}
        {notifications.length === 0 && (
          <div className="text-center text-muted-foreground p-4">
            No notifications
          </div>
        )}
      </div>
    </ScrollArea>
  );
};