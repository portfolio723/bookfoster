
import { supabase } from '@/lib/supabaseClient';
import { User, AuthError, OtpType, Session } from '@supabase/supabase-js';

// Sign Up with Password
export const authSignUpEmailPassword = async (
  email: string,
  password: string,
  fullName: string,
  userType: 'reader' | 'donor' | 'both'
) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          user_type: userType
        },
      },
    });

    if (error) throw error;
    if (!data.user) throw new Error('User creation failed');
    
    return { success: true, user: data.user, message: 'Check your email to confirm your account' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Sign up failed' };
  }
};


// Sign In with Password
export const authSignInEmailPassword = async (email: string, password: string) => {
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
export const sendOtpEmail = async (email: string) => {
    try {
        const { data, error } = await supabase.auth.signInWithOtp({
            email,
        });
        if (error) throw error;
        return { success: true, data, message: 'OTP sent to your email' };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'OTP sign in failed' };
    }
}

// Verify OTP
export const verifyOtpEmail = async (email: string, token: string) => {
    try {
        const { data, error } = await supabase.auth.verifyOtp({
            email,
            token,
            type: 'email',
        });
        if (error) throw error;
        return { success: true, session: data.session };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'OTP verification failed' };
    }
};

// Resend OTP
export const resendOtp = async (email: string) => {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
    });

    if (error) throw error;

    return {
      success: true,
      message: 'OTP resent to your email',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to resend OTP',
    };
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
export const confirmEmail = async (token: string) => {
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

// Request Password Reset
export const requestPasswordReset = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) throw error;

    return {
      success: true,
      message: 'Password reset link sent to your email',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send reset email',
    };
  }
};

// Update Password
export const updatePassword = async (newPassword: string) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;

    return {
      success: true,
      message: 'Password updated successfully',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update password',
    };
  }
};

// Get User Session
export const getUserSession = async (): Promise<Session | null> => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session || null;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
};
