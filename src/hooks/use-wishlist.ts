
'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from './use-toast';
import * as wishlistService from '@/lib/services/wishlistService';

export type WishlistItem = {
  id: string;
  user_id: string;
  bookId: string;
  created_at: string;
};

export function useWishlist(userId?: string) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const { toast } = useToast();

  const fetchWishlistItems = useCallback(async () => {
    if (!userId) return;

    const { success, wishlist, error } = await wishlistService.getUserWishlist(userId);

    if (error) {
      console.error('Error fetching wishlist items:', error);
    } else if (success && wishlist) {
      // The service returns a more complex object, let's adapt
      const adaptedWishlist = wishlist.map((item: any) => ({
        id: item.id,
        user_id: item.user_id,
        bookId: item.book_id,
        created_at: item.added_at,
        // The service also returns the full book object, which you could use later
        book: item.books,
      }));
      setWishlist(adaptedWishlist);
    }
  }, [userId]);

  useEffect(() => {
    fetchWishlistItems();
  }, [fetchWishlistItems]);

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`wishlist-changes:${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'wishlist', filter: `user_id=eq.${userId}` },
        (payload) => {
          console.log('Wishlist change received!', payload);
          fetchWishlistItems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, fetchWishlistItems]);


  const addToWishlist = async (bookId: string) => {
    if (!userId) {
      toast({
        variant: 'destructive',
        title: 'Please log in',
        description: 'You need to be logged in to manage your wishlist.',
      });
      return;
    }
    
    const existingItem = wishlist.find(item => item.bookId === bookId);
    if(existingItem) {
        toast({ title: "Already in your wishlist." });
        return;
    }
    
    const { success, error } = await wishlistService.addToWishlist(userId, bookId);

    if (error) {
      console.error('Error adding to wishlist:', error);
      toast({ variant: 'destructive', title: error === 'Already in wishlist' ? error : "Something went wrong." });
    } else if (success) {
      toast({ title: 'Added to wishlist!' });
    }
  };

  const removeFromWishlist = async (bookId: string) => {
    if (!userId) return;

    const { success, error } = await wishlistService.removeFromWishlist(userId, bookId);

     if (error) {
      console.error('Error removing from wishlist:', error);
      toast({ variant: 'destructive', title: "Something went wrong." });
    } else if (success) {
      toast({ title: 'Removed from wishlist!' });
    }
  };

  return { wishlist, addToWishlist, removeFromWishlist };
}
