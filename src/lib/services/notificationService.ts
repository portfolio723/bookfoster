
import { supabase } from '@/lib/supabaseClient';

// Create a notification for a user
export const createNotification = async (
  userId: string,
  title: string,
  message: string,
  notificationType?: string,
  relatedItemId?: string
) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert([
        {
          user_id: userId,
          title: title,
          message: message,
          notification_type: notificationType,
          related_item_id: relatedItemId,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return { success: true, notification: data };
  } catch (error) {
    console.error('Notification creation failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create notification' };
  }
};

// Get notifications for a user
export const getUserNotifications = async (userId: string, limit: number = 20) => {
    try {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return { success: true, notifications: data };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch notifications' };
    }
};

// Mark a notification as read
export const markNotificationAsRead = async (notificationId: string) => {
    try {
        const { data, error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', notificationId)
            .select()
            .single();
        
        if (error) throw error;
        return { success: true, notification: data };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Failed to update notification' };
    }
}

// Get unread notification count
export const getUnreadNotificationCount = async (userId: string) => {
  try {
    const { data, error, count } = await supabase
      .from('notifications')
      .select('id', { count: 'exact' })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw error;
    return { success: true, count: count || 0 };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch notification count' };
  }
};

// Delete notification
export const deleteNotification = async (notificationId: string) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete notification' };
  }
};
