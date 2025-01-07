import React from 'react';
import { useNotifications } from './notifications/useNotifications';
import { NotificationList } from './notifications/NotificationList';
import { Card } from '../ui/card';
import { LoadingSkeleton } from '../loading/LoadingSkeleton';

interface NotificationCenterProps {
  thesisId: string;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ thesisId }) => {
  console.log('🎯 Rendering NotificationCenter for thesis:', thesisId);
  
  const { notifications, loading, markAsRead } = useNotifications(thesisId);

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <Card className="w-full">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Notifications</h3>
      </div>
      <NotificationList
        notifications={notifications}
        onMarkAsRead={markAsRead}
      />
    </Card>
  );
};