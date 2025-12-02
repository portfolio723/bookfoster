
import { supabase } from '@/lib/supabaseClient';
import { createNotification } from './notificationService';

// Send private message
export const sendPrivateMessage = async (
  senderId: string,
  recipientId: string,
  message: string,
  bookId?: string
) => {
  try {
    const { data, error } = await supabase
      .from('private_messages')
      .insert([
        {
          sender_id: senderId,
          recipient_id: recipientId,
          message,
          book_id: bookId,
          is_read: false,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Create notification
    await createNotification(
      recipientId,
      'New Message',
      'You have a new private message'
    );

    return { success: true, message: data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to send message' };
  }
};

// Get conversation
export const getConversation = async (userId: string, conversationWithId: string) => {
  try {
    const { data, error } = await supabase
      .from('private_messages')
      .select('*')
      .or(
        `and(sender_id.eq.${userId},recipient_id.eq.${conversationWithId}),and(sender_id.eq.${conversationWithId},recipient_id.eq.${userId})`
      )
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Mark all messages as read
    await supabase
      .from('private_messages')
      .update({ is_read: true, read_at: new Date() })
      .eq('recipient_id', userId)
      .eq('sender_id', conversationWithId);

    return { success: true, messages: data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch conversation' };
  }
};

// Get all conversations for user
export const getUserConversations = async (userId: string) => {
  try {
    const { data: sent, error: sentError } = await supabase
      .from('private_messages')
      .select('recipient_id, sender_id, created_at')
      .eq('sender_id', userId);

    const { data: received, error: receivedError } = await supabase
      .from('private_messages')
      .select('recipient_id, sender_id, created_at')
      .eq('recipient_id', userId);

    if (sentError || receivedError) throw sentError || receivedError;

    // Get unique conversation partners
    const conversationPartners = new Set<string>();
    sent?.forEach(msg => conversationPartners.add(msg.recipient_id));
    received?.forEach(msg => conversationPartners.add(msg.sender_id));

    // Fetch profile details for each partner
    const partners = await Promise.all(
      Array.from(conversationPartners).map(async (partnerId) => {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, email')
          .eq('id', partnerId)
          .single();

        // Get last message
        const { data: lastMessage } = await supabase
          .from('private_messages')
          .select('*')
          .or(
            `and(sender_id.eq.${userId},recipient_id.eq.${partnerId}),and(sender_id.eq.${partnerId},recipient_id.eq.${userId})`
          )
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        // Get unread count
        const { data: unread } = await supabase
          .from('private_messages')
          .select('id', { count: 'exact' })
          .eq('recipient_id', userId)
          .eq('sender_id', partnerId)
          .eq('is_read', false);

        return {
          profile,
          lastMessage,
          unreadCount: unread?.length || 0,
        };
      })
    );

    return { success: true, conversations: partners };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch conversations' };
  }
};

// Get unread message count
export const getUnreadMessageCount = async (userId: string) => {
  try {
    const { data, error, count } = await supabase
      .from('private_messages')
      .select('id', { count: 'exact' })
      .eq('recipient_id', userId)
      .eq('is_read', false);

    if (error) throw error;
    return { success: true, count: count || 0 };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch unread count' };
  }
};
