import { supabase } from '@/integrations/supabase/client';

class SupabaseAuthService {
  // Получить всех пользователей (только для админов)
  async getAllUsers() {
    try {
      const { data, error } = await supabase
        .from('auth.users')
        .select('id, email, created_at, last_sign_in_at, email_confirmed_at')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  // Проверить существование пользователя по email
  async checkUserExists(email: string) {
    try {
      const { data, error } = await supabase
        .from('auth.users')
        .select('id, email, created_at')
        .eq('email', email)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return !!data;
    } catch (error: any) {
      console.error('Error checking user:', error);
      return false;
    }
  }

  // Вход через Supabase
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  // Регистрация через Supabase
  async signUp(email: string, password: string, userData?: any) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  // Выход
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  // Получить текущего пользователя
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (error: any) {
      console.error('Get user error:', error);
      return null;
    }
  }

  // Получить статистику пользователей
  async getUserStats() {
    try {
      const { data, error } = await supabase
        .from('auth.users')
        .select('id, created_at, last_sign_in_at, email_confirmed_at');
      
      if (error) throw error;
      
      const total = data?.length || 0;
      const confirmed = data?.filter(u => u.email_confirmed_at).length || 0;
      const active = data?.filter(u => {
        const lastSignIn = u.last_sign_in_at ? new Date(u.last_sign_in_at) : null;
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return lastSignIn && lastSignIn > oneWeekAgo;
      }).length || 0;

      return {
        total,
        confirmed,
        active,
        unconfirmed: total - confirmed
      };
    } catch (error: any) {
      console.error('Error getting user stats:', error);
      return { total: 0, confirmed: 0, active: 0, unconfirmed: 0 };
    }
  }
}

export const supabaseAuthService = new SupabaseAuthService();