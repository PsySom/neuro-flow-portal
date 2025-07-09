import { supabase } from '@/integrations/supabase/client';
import { mockActivityService } from './mock-activity.service';
import { 
  Activity, 
  CreateActivityRequest, 
  UpdateActivityRequest,
  ActivityState,
  UpdateActivityStateRequest,
  ActivityType,
  PaginatedResponse
} from '../types/api.types';

// Use mock service while authentication is not implemented
const USE_MOCK = true;

class ActivityService {
  // Get activities for a specific date
  async getActivities(date?: string): Promise<Activity[]> {
    if (USE_MOCK) {
      return mockActivityService.getActivities(date);
    }
    
    try {
      let query = supabase
        .from('activities')
        .select(`
          *,
          activity_type:activity_types(*)
        `)
        .order('start_time', { ascending: true });

      if (date) {
        // Filter by date part of start_time
        const startOfDay = `${date}T00:00:00.000Z`;
        const endOfDay = `${date}T23:59:59.999Z`;
        query = query.gte('start_time', startOfDay).lte('start_time', endOfDay);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      return (data || []).map(this.mapDbActivityToApi);
    } catch (error: any) {
      console.error('Error fetching activities:', error);
      throw new Error(error.message || 'Failed to fetch activities');
    }
  }

  // Get activities for date range (for calendar)
  async getActivitiesRange(startDate: string, endDate: string): Promise<Activity[]> {
    if (USE_MOCK) {
      return mockActivityService.getActivitiesRange(startDate, endDate);
    }
    
    try {
      const startOfPeriod = `${startDate}T00:00:00.000Z`;
      const endOfPeriod = `${endDate}T23:59:59.999Z`;
      
      const { data, error } = await supabase
        .from('activities')
        .select(`
          *,
          activity_type:activity_types(*)
        `)
        .gte('start_time', startOfPeriod)
        .lte('start_time', endOfPeriod)
        .order('start_time', { ascending: true });
      
      if (error) throw error;
      
      return (data || []).map(this.mapDbActivityToApi);
    } catch (error: any) {
      console.error('Error fetching activities range:', error);
      throw new Error(error.message || 'Failed to fetch activities range');
    }
  }

  // Create new activity
  async createActivity(data: CreateActivityRequest): Promise<Activity> {
    if (USE_MOCK) {
      return mockActivityService.createActivity(data);
    }
    
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('User not authenticated');

      const { data: newActivity, error } = await supabase
        .from('activities')
        .insert({
          user_id: user.id,
          title: data.title,
          description: data.description,
          activity_type_id: data.activity_type_id,
          start_time: data.start_time,
          end_time: data.end_time,
          status: data.status || 'planned',
          metadata: data.metadata || {}
        })
        .select(`
          *,
          activity_type:activity_types(*)
        `)
        .single();
      
      if (error) throw error;
      
      return this.mapDbActivityToApi(newActivity);
    } catch (error: any) {
      console.error('Error creating activity:', error);
      throw new Error(error.message || 'Failed to create activity');
    }
  }

  // Update activity
  async updateActivity(id: number, data: UpdateActivityRequest): Promise<Activity> {
    if (USE_MOCK) {
      return mockActivityService.updateActivity(id, data);
    }
    
    try {
      const { data: updatedActivity, error } = await supabase
        .from('activities')
        .update({
          title: data.title,
          description: data.description,
          activity_type_id: data.activity_type_id,
          start_time: data.start_time,
          end_time: data.end_time,
          status: data.status,
          metadata: data.metadata
        })
        .eq('id', id)
        .select(`
          *,
          activity_type:activity_types(*)
        `)
        .single();
      
      if (error) throw error;
      
      return this.mapDbActivityToApi(updatedActivity);
    } catch (error: any) {
      console.error('Error updating activity:', error);
      throw new Error(error.message || 'Failed to update activity');
    }
  }

  // Delete activity
  async deleteActivity(id: number): Promise<void> {
    if (USE_MOCK) {
      return mockActivityService.deleteActivity(id);
    }
    
    try {
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error: any) {
      console.error('Error deleting activity:', error);
      throw new Error(error.message || 'Failed to delete activity');
    }
  }

  // Get activity types
  async getActivityTypes(): Promise<ActivityType[]> {
    if (USE_MOCK) {
      return mockActivityService.getActivityTypes();
    }
    
    try {
      const { data, error } = await supabase
        .from('activity_types')
        .select('*')
        .order('id', { ascending: true });
      
      if (error) throw error;
      
      return data || [];
    } catch (error: any) {
      console.error('Error fetching activity types:', error);
      throw new Error(error.message || 'Failed to fetch activity types');
    }
  }

  // Activity States
  async getActivityState(activityId: number): Promise<ActivityState | null> {
    if (USE_MOCK) {
      return mockActivityService.getActivityState(activityId);
    }
    
    try {
      const { data, error } = await supabase
        .from('activity_states')
        .select('*')
        .eq('activity_id', activityId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') return null; // No rows found
        throw error;
      }
      
      return data;
    } catch (error: any) {
      console.error('Error fetching activity state:', error);
      return null;
    }
  }

  async updateActivityState(activityId: number, data: UpdateActivityStateRequest): Promise<ActivityState> {
    if (USE_MOCK) {
      return mockActivityService.updateActivityState(activityId, data);
    }
    
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('User not authenticated');

      const { data: activityState, error } = await supabase
        .from('activity_states')
        .upsert({
          activity_id: activityId,
          user_id: user.id,
          state: data.state,
          mood_before: data.mood_before,
          mood_after: data.mood_after,
          energy_before: data.energy_before,
          energy_after: data.energy_after,
          notes: data.notes,
          metadata: data.metadata || {}
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return activityState;
    } catch (error: any) {
      console.error('Error updating activity state:', error);
      throw new Error(error.message || 'Failed to update activity state');
    }
  }

  // Get today's activities
  async getTodayActivities(): Promise<Activity[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.getActivities(today);
  }

  // Helper method to map database activity to API format
  private mapDbActivityToApi(dbActivity: any): Activity {
    return {
      id: dbActivity.id,
      user_id: dbActivity.user_id,
      title: dbActivity.title,
      description: dbActivity.description,
      activity_type: dbActivity.activity_type,
      start_time: dbActivity.start_time,
      end_time: dbActivity.end_time,
      status: dbActivity.status,
      metadata: dbActivity.metadata,
      created_at: dbActivity.created_at,
      updated_at: dbActivity.updated_at
    };
  }
}

export const activityService = new ActivityService();
export default activityService;