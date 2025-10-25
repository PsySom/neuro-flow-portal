import { supabase } from '@/integrations/supabase/client';
import { OnboardingData } from '@/components/onboarding/hooks/useOnboardingState';

export class OnboardingSaveService {
  /**
   * Save onboarding data to user's profile
   */
  async saveOnboardingData(data: OnboardingData): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      // Prepare data for saving
      const profileUpdate = {
        full_name: data.name || null,
        onboarding_completed: true,
        onboarding_data: data,
        primary_goal: data.primaryGoal || null,
        challenges: data.challenges || [],
        chronotype: data.chronotype || null,
        time_commitment: data.timeCommitment || null,
        reminder_frequency: data.reminders || null,
        updated_at: new Date().toISOString()
      };

      // Update profile
      const { error } = await supabase
        .from('profiles')
        .update(profileUpdate)
        .eq('id', user.id);

      if (error) {
        console.error('Error saving onboarding data:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Unexpected error saving onboarding:', error);
      return { success: false, error: error.message || 'Unknown error' };
    }
  }

  /**
   * Check if user has completed onboarding
   */
  async hasCompletedOnboarding(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return false;

      const { data, error } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error checking onboarding status:', error);
        return false;
      }

      return data?.onboarding_completed || false;
    } catch (error) {
      console.error('Unexpected error checking onboarding:', error);
      return false;
    }
  }

  /**
   * Get user's onboarding data
   */
  async getOnboardingData(): Promise<OnboardingData | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('onboarding_data')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching onboarding data:', error);
        return null;
      }

      return data?.onboarding_data as OnboardingData || null;
    } catch (error) {
      console.error('Unexpected error fetching onboarding:', error);
      return null;
    }
  }
}

export const onboardingSaveService = new OnboardingSaveService();
