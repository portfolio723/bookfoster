
import { supabase } from '@/lib/supabaseClient';
import { User, AuthError, OtpType } from '@supabase/supabase-js';

// Sign Up with profile creation
export const authSignUp = async (
  email: string,
  password: string,
  fullName: string,
  userType: 'reader' | 'donor' | 'both' = 'reader'
) => {
  try {
    // The user's profile is created automatically by a trigger in Supabase.
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          user_type: userType,
        },
      },
    });

    if (error) throw error;
    if (!data.user) throw new Error('User creation failed');
    
    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Sign up failed' };
  }
};

// Sign In with Password
export const authSignIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return { success: true, session: data.session };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Sign in failed' };
  }
};

// Sign In with OTP
export const authSignInWithOtp = async (email: string) => {
    try {
        const { data, error } = await supabase.auth.signInWithOtp({
            email,
        });
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'OTP sign in failed' };
    }
}

// Verify OTP
export const authVerifyOtp = async (email: string, token: string, type: OtpType) => {
    try {
        const { data, error } = await supabase.auth.verifyOtp({
            email,
            token,
            type,
        });
        if (error) throw error;
        return { success: true, session: data.session };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'OTP verification failed' };
    }
};


// Sign Out
export const authSignOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Sign out failed' };
  }
};

// Get current user
export const getCurrentUser = async (): Promise<User | null> => {
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user ?? null;
};

// Get user profile
export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return { success: true, profile: data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch profile' };
  }
};

// Update user profile
export const updateUserProfile = async (userId: string, updates: any) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date() })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, profile: data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update profile' };
  }
};

// Verify email
export const verifyEmail = async (token: string) => {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'email',
    });

    if (error) throw error;
    return { success: true, session: data.session };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Email verification failed' };
  }
};
