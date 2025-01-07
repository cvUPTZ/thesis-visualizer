import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Notification } from '../components/collaboration/types';

export const useNotifications = (thesisId: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const processedNotificationsRef = useRef<Set<string>>(new Set());
  const subscriptionRef = useRef<any>(null);
  const lastToastTime = useRef<number>(0);
  const TOAST_COOLDOWN = 5000; // 5 seconds between toasts

  const fetchNotifications = useCallback(async () => {
    try {
      console.log('🔄 Fetching notifications for thesis:', thesisId);
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        console.error('❌ No authenticated user found');
        return;
      }

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('thesis_id', thesisId)
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching notifications:', error);
        throw error;
      }

      console.log('✅ Fetched notifications:', data?.length);
      setNotifications(data || []);
      data?.forEach(notification => {
        processedNotificationsRef.current.add(notification.id);
      });
    } catch (error) {
      console.error('❌ Error in fetchNotifications:', error);
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
    console.log('📨 New notification received:', payload);
    const notification = payload.new;
    
    if (processedNotificationsRef.current.has(notification.id)) {
      console.log('🔄 Notification already processed, skipping:', notification.id);
      return;
    }

    console.log('✨ Processing new notification:', notification.id);
    processedNotificationsRef.current.add(notification.id);
    
    setNotifications(prev => {
      const exists = prev.some(n => n.id === notification.id);
      if (exists) {
        console.log('🔄 Notification already in state, skipping:', notification.id);
        return prev;
      }
      console.log('➕ Adding new notification to state:', notification.id);
      return [notification, ...prev];
    });

    // Only show toast if enough time has passed since the last one
    const now = Date.now();
    if (now - lastToastTime.current >= TOAST_COOLDOWN) {
      lastToastTime.current = now;
      toast({
        title: "New Notification",
        description: notification.message,
      });
    }
  }, [toast]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      console.log('📝 Marking notification as read:', notificationId);
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) {
        console.error('❌ Error marking notification as read:', error);
        throw error;
      }

      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      console.log('✅ Notification marked as read:', notificationId);
    } catch (error) {
      console.error('❌ Error in markAsRead:', error);
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    console.log('🔄 Setting up notifications subscription for thesis:', thesisId);
    
    fetchNotifications();

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `thesis_id=eq.${thesisId}`,
        },
        handleNewNotification
      )
      .subscribe(status => {
        console.log('📡 Notification subscription status:', status);
      });

    subscriptionRef.current = channel;

    return () => {
      console.log('🧹 Cleaning up notifications subscription');
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
      }
      processedNotificationsRef.current.clear();
    };
  }, [thesisId, fetchNotifications, handleNewNotification]);

  return {
    notifications,
    loading,
    markAsRead,
  };
};