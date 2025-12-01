'use client';

import { useState, useEffect } from 'react';
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  writeBatch,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { useUser } from '@/firebase/auth/use-user';

export type CartItem = {
  id: string;
  bookId: string;
  quantity: number;
  type: 'buy' | 'rent';
};

export function useCart(userId?: string) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const db = getFirestore();

  useEffect(() => {
    if (!userId) {
      setCartItems([]);
      return;
    }

    const cartColRef = collection(db, 'users', userId, 'cart');
    const unsubscribe = onSnapshot(cartColRef, (snapshot) => {
      const items = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as CartItem)
      );
      setCartItems(items);
    });

    return () => unsubscribe();
  }, [userId, db]);

  const addToCart = async (bookId: string, type: 'buy' | 'rent') => {
    if (!userId) return;
    const cartColRef = collection(db, 'users', userId, 'cart');

    const q = query(cartColRef, where('bookId', '==', bookId), where('type', '==', type));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;
      const currentQuantity = querySnapshot.docs[0].data().quantity;
      await updateDoc(docRef, { quantity: currentQuantity + 1 });
    } else {
      await addDoc(cartColRef, {
        bookId,
        quantity: 1,
        type,
        addedAt: serverTimestamp(),
      });
    }
  };
  
  const updateItem = async (itemId: string, quantity: number) => {
    if (!userId) return;
    const itemRef = doc(db, 'users', userId, 'cart', itemId);
    if (quantity <= 0) {
      await deleteDoc(itemRef);
    } else {
      await updateDoc(itemRef, { quantity });
    }
  };

  const removeItem = async (itemId: string) => {
    if (!userId) return;
    const itemRef = doc(db, 'users', userId, 'cart', itemId);
    await deleteDoc(itemRef);
  };

  const clearCart = async () => {
    if (!userId) return;
    const cartColRef = collection(db, 'users', userId, 'cart');
    const snapshot = await getDocs(cartColRef);
    const batch = writeBatch(db);
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  };

  return { cartItems, addToCart, updateItem, removeItem, clearCart };
}
