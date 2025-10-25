import { supabase } from '@/integrations/supabase/client';

export interface PasswordBreachResult {
  isBreached: boolean;
  breachCount?: number;
}

export class PasswordBreachService {
  static async checkPassword(password: string): Promise<PasswordBreachResult> {
    try {
      const { data, error } = await supabase.functions.invoke('check-password-breach', {
        body: { password },
      });

      if (error) {
        console.error('Error checking password breach:', error);
        // Fail open - don't block user if check fails
        return { isBreached: false };
      }

      return data as PasswordBreachResult;
    } catch (error) {
      console.error('Error invoking password breach check:', error);
      // Fail open - don't block user if check fails
      return { isBreached: false };
    }
  }
}
