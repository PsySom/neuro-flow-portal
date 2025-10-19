import { supabase } from "@/integrations/supabase/client";

export interface UserActiveDiary {
  id: string;
  user_id: string;
  scenario_slug: string;
  created_at: string;
}

class UserActiveDiariesService {
  async listUserActiveDiaries(): Promise<UserActiveDiary[]> {
    const { data, error } = await supabase
      .from('user_active_diaries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching active diaries:', error);
      throw error;
    }

    return data || [];
  }

  async activateScenario(scenarioSlug: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('user_active_diaries')
      .insert({
        user_id: user.id,
        scenario_slug: scenarioSlug
      });

    if (error && error.code !== '23505') { // Ignore unique constraint violations
      console.error('Error activating scenario:', error);
      throw error;
    }
  }

  async deactivateScenario(scenarioSlug: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('user_active_diaries')
      .delete()
      .eq('user_id', user.id)
      .eq('scenario_slug', scenarioSlug);

    if (error) {
      console.error('Error deactivating scenario:', error);
      throw error;
    }
  }

  async isScenarioActive(scenarioSlug: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('user_active_diaries')
      .select('id')
      .eq('user_id', user.id)
      .eq('scenario_slug', scenarioSlug)
      .single();

    if (error && error.code !== 'PGRST116') { // Ignore "not found" errors
      console.error('Error checking scenario status:', error);
    }

    return !!data;
  }
}

export const userActiveDiariesService = new UserActiveDiariesService();
