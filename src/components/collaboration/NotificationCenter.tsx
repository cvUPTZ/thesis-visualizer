import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  message: string;
  created_at: string;
  read: boolean;
}

export const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();
  const notificationIds = useRef(new Set<string>());

  const fetchNotifications = useCallback(async () => {
    console.log('Fetching notifications');
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notifications:', error);
      return;
    }

    // Update our ref with existing notification IDs
    notificationIds.current = new Set(data.map(n => n.id));
    
    setNotifications(data);
    setUnreadCount(data.filter(n => !n.read).length);
  }, []);

  const handleNewNotification = useCallback((newNotification: Notification) => {
    console.log('Processing new notification:', newNotification.id);
    
    // Check if we've already seen this notification
    if (notificationIds.current.has(newNotification.id)) {
      console.log('Notification already exists, skipping:', newNotification.id);
      return;
    }

    // Add to our tracking set
    notificationIds.current.add(newNotification.id);

    setNotifications(prev => {
      // Double check in case of race conditions
      if (prev.some(n => n.id === newNotification.id)) {
        return prev;
      }
      return [newNotification, ...prev];
    });

    setUnreadCount(prev => prev + 1);
    
    toast({
      title: "New Notification",
      description: newNotification.message,
    });
  }, [toast]);

  useEffect(() => {
    console.log('Setting up notifications subscription');
    
    // Initial fetch
    fetchNotifications();

    // Set up realtime subscription
    const channel = supabase
      .channel('public:notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
        },
        (payload) => {
          console.log('New notification received:', payload);
          handleNewNotification(payload.new as Notification);
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up notifications subscription');
      supabase.removeChannel(channel);
    };
  }, [fetchNotifications, handleNewNotification]);

  const markAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) {
      console.error('Error marking notification as read:', error);
      return;
    }

    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg ${
                  notification.read ? 'bg-muted' : 'bg-muted/50'
                }`}
                onClick={() => !notification.read && markAsRead(notification.id)}
              >
                <p className="text-sm">{notification.message}</p>
                <span className="text-xs text-muted-foreground">
                  {new Date(notification.created_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};