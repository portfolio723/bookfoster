
import { supabase } from '@/lib/supabaseClient';
import { createNotification } from './notificationService';

// Create purchase
export const createPurchase = async (
  bookId: string,
  buyerId: string,
  quantity: number = 1,
  shippingAddress?: string
) => {
  try {
    // Get book details
    const { data: book, error: bookError } = await supabase
      .from('books')
      .select('*')
      .eq('id', bookId)
      .single();

    if (bookError || !book || book.available_quantity < quantity) {
      throw new Error('Insufficient stock');
    }

    const { data, error } = await supabase
      .from('purchases')
      .insert([
        {
          book_id: bookId,
          buyer_id: buyerId,
          seller_id: book.owner_id,
          purchase_price: book.price_buy,
          quantity,
          payment_status: 'pending',
          status: 'pending',
          shipping_address: shippingAddress,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Create notification
    await createNotification(
      book.owner_id,
      'New Purchase Order',
      `New purchase order for ${book.title}`
    );

    return { success: true, purchase: data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create purchase' };
  }
};

// Get user purchases
export const getUserPurchases = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('purchases')
      .select('*, books(title, cover_image_url)')
      .eq('buyer_id', userId);

    if (error) throw error;
    return { success: true, purchases: data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch purchases' };
  }
};

// Update payment status
export const updatePaymentStatus = async (
  purchaseId: string,
  status: 'paid' | 'failed',
  transactionId?: string
) => {
  try {
    const { data, error } = await supabase
      .from('purchases')
      .update({
        payment_status: status,
        transaction_id: transactionId,
        updated_at: new Date(),
      })
      .eq('id', purchaseId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, purchase: data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update payment' };
  }
};
