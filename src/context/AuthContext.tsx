import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import {
  supabase,
  isSupabaseConfigured,
  CommunityProfile,
  DEMO_PHONE,
  DEMO_OTP
} from '../services/supabase';

interface AuthTarget {
  type: 'phone' | 'email';
  value: string; // digits for phone (10 digits), or trimmed email
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  communityProfile: CommunityProfile | null;
  isLoading: boolean;
  isDemoSession: boolean;
  authTarget: AuthTarget | null;
  setAuthTarget: (target: AuthTarget | null) => void;
  sendOtp: (type: 'phone' | 'email', value: string) => Promise<{ success: boolean; error?: string }>;
  verifyOtp: (token: string) => Promise<{ success: boolean; error?: string; onboarded?: boolean }>;
  completeOnboarding: (data: { alias: string; firstName?: string; language?: string }) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  deleteCommunityData: () => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const LOCAL_DEMO_SESSION_KEY = 'abhaya_demo_session';
const LOCAL_DEMO_PROFILE_KEY = 'abhaya_demo_profile';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [communityProfile, setCommunityProfile] = useState<CommunityProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDemoSession, setIsDemoSession] = useState<boolean>(false);
  const [authTarget, setAuthTarget] = useState<AuthTarget | null>(null);

  // Fetch Supabase Profile
  const fetchSupabaseProfile = useCallback(async (userId: string): Promise<CommunityProfile | null> => {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        // Table might not exist yet or user not inserted
        return null;
      }
      return data as CommunityProfile | null;
    } catch {
      return null;
    }
  }, []);

  // Initialize Session on Load
  useEffect(() => {
    let isMounted = true;

    async function initSession() {
      // 1. If Supabase is configured, check real session
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session: initialSession } } = await supabase.auth.getSession();
          if (!isMounted) return;

          if (initialSession) {
            setSession(initialSession);
            setUser(initialSession.user);
            const prof = await fetchSupabaseProfile(initialSession.user.id);
            if (isMounted) {
              setCommunityProfile(prof);
              setIsDemoSession(false);
            }
          } else {
            // Check if demo session was stored locally
            const savedDemo = localStorage.getItem(LOCAL_DEMO_SESSION_KEY);
            if (savedDemo) {
              try {
                const parsed = JSON.parse(savedDemo);
                const lastPhone = localStorage.getItem('abhaya_last_phone');
                if (lastPhone && parsed.user && parsed.user.phone?.includes(DEMO_PHONE)) {
                  parsed.user.phone = `+91${lastPhone}`;
                }
                setSession(parsed.session);
                setUser(parsed.user);
                setIsDemoSession(true);
                const savedProf = localStorage.getItem(LOCAL_DEMO_PROFILE_KEY);
                if (savedProf) {
                  setCommunityProfile(JSON.parse(savedProf));
                }
              } catch {
                localStorage.removeItem(LOCAL_DEMO_SESSION_KEY);
              }
            }
          }
        } catch {
          // Fallback to demo check
        } finally {
          if (isMounted) {
            // Delay slightly to give splash arch screen an organic, polished feel
            setTimeout(() => {
              if (isMounted) setIsLoading(false);
            }, 750);
          }
        }

        // Listen for Supabase auth state changes
        const { data: authSubscription } = supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            if (!isMounted) return;
            setSession(newSession);
            setUser(newSession?.user ?? null);
            if (newSession?.user) {
              setIsDemoSession(false);
              const prof = await fetchSupabaseProfile(newSession.user.id);
              if (isMounted) setCommunityProfile(prof);
            } else {
              setCommunityProfile(null);
            }
            setIsLoading(false);
          }
        );

        return () => {
          authSubscription.subscription.unsubscribe();
        };
      } else {
        // 2. Local Demo fallback mode if Supabase env is not yet connected
        const savedDemo = localStorage.getItem(LOCAL_DEMO_SESSION_KEY);
        if (savedDemo) {
          try {
            const parsed = JSON.parse(savedDemo);
            const lastPhone = localStorage.getItem('abhaya_last_phone');
            if (lastPhone && parsed.user && parsed.user.phone?.includes(DEMO_PHONE)) {
              parsed.user.phone = `+91${lastPhone}`;
            }
            setSession(parsed.session);
            setUser(parsed.user);
            setIsDemoSession(true);
            const savedProf = localStorage.getItem(LOCAL_DEMO_PROFILE_KEY);
            if (savedProf) {
              setCommunityProfile(JSON.parse(savedProf));
            }
          } catch {
            localStorage.removeItem(LOCAL_DEMO_SESSION_KEY);
          }
        }
        setTimeout(() => {
          if (isMounted) setIsLoading(false);
        }, 750);
      }
    }

    initSession();

    return () => {
      isMounted = false;
    };
  }, [fetchSupabaseProfile]);

  // Send OTP
  const sendOtp = async (type: 'phone' | 'email', value: string): Promise<{ success: boolean; error?: string }> => {
    setAuthTarget({ type, value });
    try {
      localStorage.setItem('abhaya_auth_target', JSON.stringify({ type, value }));
      if (type === 'phone') {
        const clean = value.replace(/\D/g, '').slice(-10);
        localStorage.setItem('abhaya_last_phone', clean);
      }
    } catch {}

    // In demo evaluator mode:
    const isDemoTarget = (type === 'phone' && value.replace(/\D/g, '').slice(-10) === DEMO_PHONE);

    if (isDemoTarget || !isSupabaseConfigured || !supabase) {
      // Simulated instant OTP dispatch for evaluator
      return { success: true };
    }

    try {
      if (type === 'phone') {
        const phoneFormatted = `+91${value.replace(/\D/g, '').slice(-10)}`;
        const { error } = await supabase.auth.signInWithOtp({
          phone: phoneFormatted
        });
        if (error) {
          return { success: false, error: error.message };
        }
        return { success: true };
      } else {
        const cleanEmail = value.trim().toLowerCase();
        const { error } = await supabase.auth.signInWithOtp({
          email: cleanEmail,
          options: {
            shouldCreateUser: true
          }
        });
        if (error) {
          return { success: false, error: error.message };
        }
        return { success: true };
      }
    } catch {
      return { success: false, error: 'Could not send verification code. Please check your network and try again.' };
    }
  };

  // Verify OTP
  const verifyOtp = async (token: string): Promise<{ success: boolean; error?: string; onboarded?: boolean }> => {
    let currentTarget = authTarget;
    if (!currentTarget) {
      const savedTarget = localStorage.getItem('abhaya_auth_target');
      if (savedTarget) {
        try {
          currentTarget = JSON.parse(savedTarget);
          setAuthTarget(currentTarget);
        } catch {}
      }
    }

    if (!currentTarget) {
      return { success: false, error: 'Verification target missing. Please request a new code.' };
    }

    const isDemoTarget = (currentTarget.type === 'phone' && currentTarget.value.replace(/\D/g, '').slice(-10) === DEMO_PHONE);

    // If evaluator uses demo credentials or Supabase is not yet configured:
    if ((isDemoTarget && token === DEMO_OTP) || (!isSupabaseConfigured && token === DEMO_OTP)) {
      const lastPhoneClean = currentTarget.type === 'phone'
        ? currentTarget.value.replace(/\D/g, '').slice(-10)
        : localStorage.getItem('abhaya_last_phone') || DEMO_PHONE;

      const userPhone = currentTarget.type === 'phone'
        ? `+91${lastPhoneClean}`
        : undefined;

      const userEmail = currentTarget.type === 'email'
        ? currentTarget.value.trim().toLowerCase()
        : undefined;

      const mockUser: User = {
        id: 'user-' + Date.now(),
        app_metadata: { provider: currentTarget.type },
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        phone: userPhone,
        email: userEmail
      };
      const mockSession: Session = {
        access_token: 'mock-evaluator-token',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'mock-refresh-token',
        user: mockUser
      };

      setSession(mockSession);
      setUser(mockUser);
      setIsDemoSession(true);
      localStorage.setItem(LOCAL_DEMO_SESSION_KEY, JSON.stringify({ session: mockSession, user: mockUser }));
      if (userPhone) {
        localStorage.setItem('abhaya_logged_in_account', userPhone);
      } else if (userEmail) {
        localStorage.setItem('abhaya_logged_in_account', userEmail);
      }

      const savedProf = localStorage.getItem(LOCAL_DEMO_PROFILE_KEY);
      if (savedProf) {
        const prof = JSON.parse(savedProf);
        setCommunityProfile(prof);
        return { success: true, onboarded: prof.onboarded };
      }
      return { success: true, onboarded: false };
    }

    if (!supabase) {
      return {
        success: false,
        error: token === DEMO_OTP ? undefined : 'Invalid verification code. Please enter the 6-digit code or use the demo evaluator code.'
      };
    }

    try {
      if (currentTarget.type === 'phone') {
        const phoneFormatted = `+91${currentTarget.value.replace(/\D/g, '').slice(-10)}`;
        const { data, error } = await supabase.auth.verifyOtp({
          phone: phoneFormatted,
          token,
          type: 'sms'
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.session && data.user) {
          if (!data.user.phone) {
            data.user.phone = phoneFormatted;
          }
          localStorage.setItem('abhaya_logged_in_account', data.user.phone);
          setSession(data.session);
          setUser(data.user);
          setIsDemoSession(false);
          const prof = await fetchSupabaseProfile(data.user.id);
          setCommunityProfile(prof);
          return { success: true, onboarded: Boolean(prof?.onboarded) };
        }
        return { success: true, onboarded: false };
      } else {
        const cleanEmail = currentTarget.value.trim().toLowerCase();
        const { data, error } = await supabase.auth.verifyOtp({
          email: cleanEmail,
          token,
          type: 'email'
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.session && data.user) {
          localStorage.setItem('abhaya_logged_in_account', data.user.email || cleanEmail);
          setSession(data.session);
          setUser(data.user);
          setIsDemoSession(false);
          const prof = await fetchSupabaseProfile(data.user.id);
          setCommunityProfile(prof);
          return { success: true, onboarded: Boolean(prof?.onboarded) };
        }
        return { success: true, onboarded: false };
      }
    } catch {
      return { success: false, error: 'Verification failed. Please try again.' };
    }
  };

  // Complete Onboarding
  const completeOnboarding = async (data: {
    alias: string;
    firstName?: string;
    language?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'No active session found.' };
    }

    const newProfile: CommunityProfile = {
      id: user.id,
      alias: data.alias.trim(),
      first_name: data.firstName?.trim() || null,
      language: data.language || 'en',
      onboarded: true,
      created_at: new Date().toISOString()
    };

    if (isDemoSession || !isSupabaseConfigured || !supabase) {
      setCommunityProfile(newProfile);
      localStorage.setItem(LOCAL_DEMO_PROFILE_KEY, JSON.stringify(newProfile));
      return { success: true };
    }

    try {
      const { error } = await supabase.from('profiles').upsert(newProfile);
      if (error) {
        if (error.code === '23505') {
          return { success: false, error: 'This alias is already taken. Please pick another one.' };
        }
        return { success: false, error: error.message };
      }

      setCommunityProfile(newProfile);
      return { success: true };
    } catch {
      return { success: false, error: 'Failed to save profile. Please try again.' };
    }
  };

  // Sign out
  const signOut = async () => {
    if (supabase && !isDemoSession) {
      try {
        await supabase.auth.signOut();
      } catch {
        // Continue
      }
    }
    localStorage.removeItem(LOCAL_DEMO_SESSION_KEY);
    localStorage.removeItem(LOCAL_DEMO_PROFILE_KEY);
    localStorage.removeItem('abhaya_auth_target');
    localStorage.removeItem('abhaya_last_phone');
    localStorage.removeItem('abhaya_logged_in_account');
    setSession(null);
    setUser(null);
    setCommunityProfile(null);
    setIsDemoSession(false);
    setAuthTarget(null);
  };

  // Delete Community Data RPC
  const deleteCommunityData = async (): Promise<{ success: boolean; error?: string }> => {
    if (isDemoSession || !isSupabaseConfigured || !supabase) {
      localStorage.removeItem(LOCAL_DEMO_PROFILE_KEY);
      setCommunityProfile(null);
      return { success: true };
    }

    try {
      const { error } = await supabase.rpc('delete_user_community_data');
      if (error) {
        // Fallback direct delete if RPC is missing
        await supabase.from('profiles').delete().eq('id', user?.id || '');
      }
      setCommunityProfile(null);
      return { success: true };
    } catch {
      return { success: false, error: 'Failed to delete community profile from server.' };
    }
  };

  const refreshProfile = async () => {
    if (user && supabase && !isDemoSession) {
      const prof = await fetchSupabaseProfile(user.id);
      setCommunityProfile(prof);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        communityProfile,
        isLoading,
        isDemoSession,
        authTarget,
        setAuthTarget,
        sendOtp,
        verifyOtp,
        completeOnboarding,
        signOut,
        deleteCommunityData,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
