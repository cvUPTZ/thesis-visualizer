import React from 'react';
import { Notification } from '../types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Bell } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
}) => {
  console.log('🔔 Rendering NotificationItem:', notification.id, 'Read:', notification.read);
  
  const handleMarkAsRead = () => {
    console.log('👆 Marking notification as read:', notification.id);
    onMarkAsRead(notification.id);
  };

  return (
    <Card className={`p-4 ${notification.read ? 'bg-muted' : 'bg-primary/5'}`}>
      <div className="flex items-start gap-3">
        <Bell className="w-4 h-4 mt-1 text-primary" />
        <div className="flex-1 space-y-1">
          <p className="text-sm">{notification.message}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
            </span>
            {!notification.read && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAsRead}
                className="text-xs"
              >
                Mark as read
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};