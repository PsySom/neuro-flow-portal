
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface SupabaseAuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(undefined);

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const notify = (message: string) => { try { console.log('[toast]', message); } catch {} };
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1) Subscribe to auth changes FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, sess) => {
      console.log('Auth state change:', event, sess?.user?.email);
      setSession(sess);
      setUser(sess?.user ?? null);

      // Defer any additional Supabase calls
      if (event === 'SIGNED_IN') {
        setTimeout(async () => {
          // Ensure a profile row exists
          if (sess?.user?.id) {
            await supabase.from('profiles')
              .upsert({ id: sess.user.id }, { onConflict: 'id', ignoreDuplicates: false });
          }
        }, 0);
      }
    });

    // 2) Then get initial session
    supabase.auth.getSession().then(({ data }) => {
      console.log('Initial session:', data.session?.user?.email);
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('Attempting sign in for:', email);
    
    // Clean up any stale auth state before sign in to prevent limbo states
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) localStorage.removeItem(key);
      });
      Object.keys(sessionStorage || {}).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) sessionStorage.removeItem(key as any);
      });
      try { await supabase.auth.signOut({ scope: 'global' }); } catch {}
    } catch {}

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Sign in error:', error);
      notify(`Ошибка входа: ${error.message}`);
      throw error;
    }
    
    console.log('Sign in successful, redirecting to dashboard');
    // Успешный вход - перенаправляем на dashboard
    window.location.href = '/dashboard';
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    console.log('Attempting sign up for:', email);
    
    // Clean up any stale auth state before sign up
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) localStorage.removeItem(key);
      });
      Object.keys(sessionStorage || {}).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) sessionStorage.removeItem(key as any);
      });
      try { await supabase.auth.signOut({ scope: 'global' }); } catch {}
    } catch {}

    const redirectUrl = `${window.location.origin}/dashboard`;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: fullName ? { full_name: fullName } : undefined,
      },
    });
    if (error) {
      console.error('Sign up error:', error);
      notify(`Ошибка регистрации: ${error.message}`);
      throw error;
    }

    // Не выполняем редирект здесь — навигацию контролирует вызывающий код (например, Auth.tsx)
    if (data.session) {
      console.log('Sign up returned active session');
    }
    // Письмо отправляем, но подтверждение не обязательно
    notify('Письмо с подтверждением отправлено (необязательно).');
  };

  const signOut = async () => {
    console.log('Signing out user');
    // Cleanup local state and try global sign out
    try {
      // Remove all supabase related keys from storage
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) localStorage.removeItem(key);
      });
      Object.keys(sessionStorage || {}).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) sessionStorage.removeItem(key as any);
      });
      // Также очищаем данные онбординга
      localStorage.removeItem('onboarding-completed');
      localStorage.removeItem('onboarding-data');
    } catch {}
    try { await supabase.auth.signOut({ scope: 'global' }); } catch {}
    // Full refresh to reset state
    window.location.href = '/auth';
  };

  const value = useMemo(() => ({
    user,
    session,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signUp,
    signOut,
  }), [user, session, isLoading]);

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  );
}

export function useSupabaseAuth() {
  const ctx = useContext(SupabaseAuthContext);
  if (!ctx) throw new Error('useSupabaseAuth must be used within SupabaseAuthProvider');
  return ctx;
}

export default SupabaseAuthProvider;
