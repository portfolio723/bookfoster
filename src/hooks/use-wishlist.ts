
'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from './use-toast';

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

    const { data, error } = await supabase
      .from('wishlist')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching wishlist items:', error);
    } else {
      setWishlist(data as WishlistItem[]);
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
    
    const { error } = await supabase.from('wishlist').insert([
      {
        user_id: userId,
        bookId: bookId,
      },
    ]);

    if (error) {
      console.error('Error adding to wishlist:', error);
      toast({ variant: 'destructive', title: "Something went wrong." });
    } else {
      toast({ title: 'Added to wishlist!' });
    }
  };

  const removeFromWishlist = async (bookId: string) => {
    if (!userId) return;

    const itemToRemove = wishlist.find(item => item.bookId === bookId);
    if (!itemToRemove) return;

    const { error } = await supabase.from('wishlist').delete().eq('id', itemToRemove.id);

     if (error) {
      console.error('Error removing from wishlist:', error);
      toast({ variant: 'destructive', title: "Something went wrong." });
    } else {
      toast({ title: 'Removed from wishlist!' });
    }
  };

  return { wishlist, addToWishlist, removeFromWishlist };
}
