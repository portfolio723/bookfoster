
import { supabase } from '@/lib/supabaseClient';

// Add book to wishlist
export const addToWishlist = async (userId: string, bookId: string) => {
  try {
    const { data, error } = await supabase
      .from('wishlist')
      .insert([
        {
          user_id: userId,
          book_id: bookId,
        },
      ])
      .select()
      .single();

    if (error) {
      // If error is unique constraint, it's already in wishlist
      if (error.code === '23505') {
        return { success: false, error: 'Already in wishlist' };
      }
      throw error;
    }

    return { success: true, wishlistItem: data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to add to wishlist' };
  }
};

// Remove from wishlist
export const removeFromWishlist = async (userId: string, bookId: string) => {
  try {
    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', userId)
      .eq('book_id', bookId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to remove from wishlist' };
  }
};

// Get user's wishlist
export const getUserWishlist = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('wishlist')
      .select('*, books(*, profiles!books_owner_id_fkey(full_name, avatar_url))')
      .eq('user_id', userId)
      .order('added_at', { ascending: false });

    if (error) throw error;
    return { success: true, wishlist: data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch wishlist' };
  }
};

// Check if book is in wishlist
export const isInWishlist = async (userId: string, bookId: string) => {
  try {
    const { data, error } = await supabase
      .from('wishlist')
      .select('id')
      .eq('user_id', userId)
      .eq('book_id', bookId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return { success: true, inWishlist: !!data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to check wishlist' };
  }
};
