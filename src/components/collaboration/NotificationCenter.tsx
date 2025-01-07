import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    console.log('Setting up notifications');
    let isMounted = true;
    
    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notifications:', error);
        return;
      }

      if (isMounted) {
        // Prevent duplicate notifications by checking IDs
        const uniqueNotifications = data.filter(newNotif => 
          !notifications.some(existingNotif => existingNotif.id === newNotif.id)
        );
        
        setNotifications(prev => {
          const combined = [...prev, ...uniqueNotifications];
          // Remove duplicates and sort by creation date
          return Array.from(new Map(combined.map(item => [item.id, item])).values())
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        });
        setUnreadCount(data.filter(n => !n.read).length);
      }
    };

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
          if (!isMounted) return;

          const newNotification = payload.new as Notification;
          
          // Check if notification already exists
          if (!notifications.some(n => n.id === newNotification.id)) {
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
            toast({
              title: "New Notification",
              description: newNotification.message,
            });
          }
        }
      )
      .subscribe();

    // Cleanup function
    return () => {
      console.log('Cleaning up notifications subscription');
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []); // Remove notifications from dependency array to prevent infinite loop

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