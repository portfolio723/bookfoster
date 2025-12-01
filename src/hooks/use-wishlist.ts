'use client';

import { useState, useEffect } from 'react';
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  doc
} from 'firebase/firestore';

export type WishlistItem = {
  id: string;
  bookId: string;
};

export function useWishlist(userId?: string) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const db = getFirestore();

  useEffect(() => {
    if (!userId) {
      setWishlist([]);
      return;
    }

    const wishlistColRef = collection(db, 'users', userId, 'wishlist');
    const unsubscribe = onSnapshot(wishlistColRef, (snapshot) => {
      const items = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as WishlistItem)
      );
      setWishlist(items);
    });

    return () => unsubscribe();
  }, [userId, db]);

  const addToWishlist = async (bookId: string) => {
    if (!userId) return;
    const wishlistColRef = collection(db, 'users', userId, 'wishlist');
    
    // Check if already in wishlist
    const q = query(wishlistColRef, where("bookId", "==", bookId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        return; // Already exists
    }

    await addDoc(wishlistColRef, {
      bookId,
      addedAt: serverTimestamp(),
    });
  };

  const removeFromWishlist = async (bookId: string) => {
    if (!userId) return;
    const wishlistColRef = collection(db, 'users', userId, 'wishlist');
    const q = query(wishlistColRef, where('bookId', '==', bookId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const docId = querySnapshot.docs[0].id;
        await deleteDoc(doc(db, 'users', userId, 'wishlist', docId));
    }
  };

  return { wishlist, addToWishlist, removeFromWishlist };
}
