import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Notification } from '../types';

export const useNotifications = (thesisId: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const processedNotificationsRef = useRef<Set<string>>(new Set());
  const subscriptionRef = useRef<any>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mapped = (data || []).map((n: any) => ({
        ...n,
        read: n.is_read ?? false,
        thesis_id: n.match_id ?? thesisId,
      })) as Notification[];

      setNotifications(mapped);
      mapped.forEach(n => processedNotificationsRef.current.add(n.id));
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [thesisId, toast]);

  const handleNewNotification = useCallback((payload: any) => {
    const notification = payload.new;
    if (processedNotificationsRef.current.has(notification.id)) return;

    processedNotificationsRef.current.add(notification.id);
    
    const mapped: Notification = {
      ...notification,
      read: notification.is_read ?? false,
      thesis_id: notification.match_id ?? thesisId,
    };

    setNotifications(prev => {
      if (prev.some(n => n.id === mapped.id)) return prev;
      return [mapped, ...prev];
    });

    toast({
      title: "New Notification",
      description: notification.message,
    });
  }, [toast, thesisId]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();

    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
      }, handleNewNotification)
      .subscribe();

    subscriptionRef.current = channel;

    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
      }
      processedNotificationsRef.current.clear();
    };
  }, [thesisId, fetchNotifications, handleNewNotification]);

  return { notifications, loading, markAsRead };
};
