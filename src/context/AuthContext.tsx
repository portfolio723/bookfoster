
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { 
  authSignInEmailPassword, 
  authSignOut, 
  authSignUpEmailPassword, 
  sendOtpEmail, 
  verifyOtpEmail 
} from '@/lib/services/authService';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, userType: 'reader' | 'donor' | 'both') => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signInWithOtp: (email: string) => Promise<any>;
  verifyOtp: (email: string, token: string, type: 'email' | 'sms') => Promise<any>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (_event === 'SIGNED_IN') {
        router.push('/');
      }
      if (_event === 'SIGNED_OUT') {
        router.push('/login');
      }
    });

    return () => subscription?.unsubscribe();
  }, [router]);

  const signUp = async (email: string, password: string, fullName: string, userType: 'reader' | 'donor' | 'both') => {
    const result = await authSignUpEmailPassword(email, password, fullName, userType);
    if (result.error) throw new Error(result.error);
    return result;
  };

  const signIn = async (email: string, password: string) => {
    const result = await authSignInEmailPassword(email, password);
    if (result.error) throw new Error(result.error);
    // Redirect is handled by onAuthStateChange
    return result;
  };
  
  const signInWithOtp = async (email: string) => {
    const result = await sendOtpEmail(email);
    if (result.error) throw new Error(result.error);
    return result;
  };

  const verifyOtp = async (email: string, token: string) => {
    const result = await verifyOtpEmail(email, token);
    if (result.error) throw new Error(result.error);
     // Redirect is handled by onAuthStateChange
    return result;
  };

  const signOut = async () => {
    const result = await authSignOut();
    if (result.error) throw new Error(result.error);
     // Redirect is handled by onAuthStateChange
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
    return data;
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithOtp,
    verifyOtp,
    signOut,
    signInWithGoogle,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
