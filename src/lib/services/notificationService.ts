
import { supabase } from '@/lib/supabaseClient';

// Create a notification for a user
export const createNotification = async (userId: string, title: string, message: string) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert([
        {
          user_id: userId,
          title: title,
          message: message,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return { success: true, notification: data };
  } catch (error) {
    console.error('Error creating notification:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create notification' };
  }
};

// Get notifications for a user
export const getNotifications = async (userId: string) => {
    try {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { success: true, notifications: data };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch notifications' };
    }
};

// Mark a notification as read
export const markNotificationAsRead = async (notificationId: string, userId: string) => {
    try {
        const { data, error } = await supabase
            .from('notifications')
            .update({ is_read: true, read_at: new Date() })
            .eq('id', notificationId)
            .eq('user_id', userId) // Ensure user can only mark their own notifications
            .select()
            .single();
        
        if (error) throw error;
        return { success: true, notification: data };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Failed to mark notification as read' };
    }
}
