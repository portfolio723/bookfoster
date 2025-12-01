'use client';

import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut as firebaseSignOut, type User } from 'firebase/auth';
import { app } from '@/firebase/config';
import { useRouter } from 'next/navigation';

const auth = getAuth(app);

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return { user, loading, signOut };
}
