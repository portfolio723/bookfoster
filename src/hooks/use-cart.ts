
'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from './use-toast';

export type CartItem = {
  id: string;
  user_id: string;
  bookId: string;
  quantity: number;
  type: 'buy' | 'rent';
  created_at: string;
};

export function useCart(userId?: string) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const fetchCartItems = useCallback(async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('cart')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching cart items:', error);
    } else {
      setCartItems(data as CartItem[]);
    }
  }, [userId]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);
  
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`cart-changes:${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'cart', filter: `user_id=eq.${userId}` },
        (payload) => {
          console.log('Cart change received!', payload);
          fetchCartItems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, fetchCartItems]);

  const addToCart = async (bookId: string, type: 'buy' | 'rent') => {
    if (!userId) {
      toast({
        variant: 'destructive',
        title: 'Please log in',
        description: 'You need to be logged in to add items to your cart.',
      });
      return;
    }

    const existingItem = cartItems.find(
      (item) => item.bookId === bookId && item.type === type
    );

    if (existingItem) {
      // Item exists, update quantity
      const { error } = await supabase
        .from('cart')
        .update({ quantity: existingItem.quantity + 1 })
        .eq('id', existingItem.id);
        
      if (error) {
        console.error('Error updating cart item:', error);
      } else {
        toast({ title: 'Quantity updated in cart!' });
      }

    } else {
      // Item doesn't exist, insert new row
      const { error } = await supabase.from('cart').insert([
        {
          user_id: userId,
          bookId: bookId,
          quantity: 1,
          type: type,
        },
      ]);
      
      if (error) {
        console.error('Error adding to cart:', error);
      } else {
        toast({ title: 'Added to cart!' });
      }
    }
  };
  
  const updateItem = async (itemId: string, quantity: number) => {
    if (!userId) return;

    if (quantity <= 0) {
      await removeItem(itemId);
    } else {
      const { error } = await supabase
        .from('cart')
        .update({ quantity })
        .eq('id', itemId);

      if (error) {
        console.error('Error updating cart item:', error);
      }
    }
  };

  const removeItem = async (itemId: string) => {
    if (!userId) return;
    
    const { error } = await supabase.from('cart').delete().eq('id', itemId);

    if (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const clearCart = async () => {
    if (!userId) return;

    const { error } = await supabase.from('cart').delete().eq('user_id', userId);
    
    if (error) {
        console.error('Error clearing cart:', error);
    }
  };

  return { cartItems, addToCart, updateItem, removeItem, clearCart };
}
