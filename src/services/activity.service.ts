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

// Use mock service while backend activities API is not yet fully implemented
const USE_MOCK = true;

class ActivityService {
  // Get activities for a specific date
  async getActivities(date?: string): Promise<Activity[]> {
    if (USE_MOCK) {
      return mockActivityService.getActivities(date);
    }
    
    try {
      // TODO: Implement backend API call for activities
      throw new Error('Backend activities API not yet implemented');
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
      // TODO: Implement backend API call for activities range
      throw new Error('Backend activities range API not yet implemented');
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
      // TODO: Implement backend API call for creating activity
      throw new Error('Backend create activity API not yet implemented');
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
      // TODO: Implement backend API call for updating activity
      throw new Error('Backend update activity API not yet implemented');
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
      // TODO: Implement backend API call for deleting activity
      throw new Error('Backend delete activity API not yet implemented');
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
      // TODO: Implement backend API call for activity types
      throw new Error('Backend activity types API not yet implemented');
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
      // TODO: Implement backend API call for activity states
      return null;
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
      // TODO: Implement backend API call for updating activity state
      throw new Error('Backend update activity state API not yet implemented');
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