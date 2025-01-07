import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Notification } from '../types';
import { useToast } from '@/hooks/use-toast';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();
  const notificationIds = useRef(new Set<string>());
  const subscriptionRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const showToast = useCallback((message: string) => {
    toast({
      title: "New Notification",
      description: message,
    });
  }, [toast]);

  const fetchNotifications = useCallback(async () => {
    console.log('Fetching notifications');
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        notificationIds.current = new Set(data.map(n => n.id));
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.read).length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, []);

  const handleNewNotification = useCallback((newNotification: Notification) => {
    console.log('Processing new notification:', newNotification.id);
    
    if (notificationIds.current.has(newNotification.id)) {
      console.log('Notification already exists, skipping:', newNotification.id);
      return;
    }

    notificationIds.current.add(newNotification.id);
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
    showToast(newNotification.message);
  }, [showToast]);

  const markAsRead = useCallback(async (notificationId: string) => {
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
  }, []);

  useEffect(() => {
    console.log('Setting up notifications subscription');
    
    if (subscriptionRef.current) {
      console.log('Cleaning up existing subscription');
      supabase.removeChannel(subscriptionRef.current);
    }

    fetchNotifications();

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

    subscriptionRef.current = channel;

    return () => {
      console.log('Cleaning up notifications subscription');
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
      }
    };
  }, [fetchNotifications, handleNewNotification]);

  return {
    notifications,
    unreadCount,
    markAsRead,
  };
};