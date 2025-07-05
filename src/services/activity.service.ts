import apiClient, { handleApiError } from './api.client';
import mockActivityService from './mock-activity.service';
import { 
  Activity, 
  CreateActivityRequest, 
  UpdateActivityRequest,
  ActivityState,
  UpdateActivityStateRequest,
  ActivityType,
  PaginatedResponse
} from '../types/api.types';

// Use mock service for development in Lovable environment
const USE_MOCK = true;

class ActivityService {
  // Get activities for a specific date
  async getActivities(date?: string): Promise<Activity[]> {
    if (USE_MOCK) {
      return mockActivityService.getActivities(date);
    }
    
    try {
      const params = date ? { date } : {};
      const response = await apiClient.get<Activity[]>('/activities', { params });
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Get activities for date range (for calendar)
  async getActivitiesRange(startDate: string, endDate: string): Promise<Activity[]> {
    if (USE_MOCK) {
      return mockActivityService.getActivitiesRange(startDate, endDate);
    }
    
    try {
      const response = await apiClient.get<Activity[]>('/activities/range', {
        params: { start_date: startDate, end_date: endDate }
      });
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Create new activity
  async createActivity(data: CreateActivityRequest): Promise<Activity> {
    if (USE_MOCK) {
      return mockActivityService.createActivity(data);
    }
    
    try {
      const response = await apiClient.post<Activity>('/activities', data);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Update activity
  async updateActivity(id: number, data: UpdateActivityRequest): Promise<Activity> {
    if (USE_MOCK) {
      return mockActivityService.updateActivity(id, data);
    }
    
    try {
      const response = await apiClient.put<Activity>(`/activities/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Delete activity
  async deleteActivity(id: number): Promise<void> {
    if (USE_MOCK) {
      return mockActivityService.deleteActivity(id);
    }
    
    try {
      await apiClient.delete(`/activities/${id}`);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Get activity types
  async getActivityTypes(): Promise<ActivityType[]> {
    if (USE_MOCK) {
      return mockActivityService.getActivityTypes();
    }
    
    try {
      const response = await apiClient.get<ActivityType[]>('/activities/types');
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Activity States
  async getActivityState(activityId: number): Promise<ActivityState | null> {
    if (USE_MOCK) {
      return mockActivityService.getActivityState(activityId);
    }
    
    try {
      const response = await apiClient.get<ActivityState>(`/activities/${activityId}/state`);
      return response.data;
    } catch (error: any) {
      if (error.status === 404) return null;
      throw handleApiError(error);
    }
  }

  async updateActivityState(activityId: number, data: UpdateActivityStateRequest): Promise<ActivityState> {
    if (USE_MOCK) {
      return mockActivityService.updateActivityState(activityId, data);
    }
    
    try {
      const response = await apiClient.put<ActivityState>(`/activities/${activityId}/state`, data);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Get today's activities
  async getTodayActivities(): Promise<Activity[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.getActivities(today);
  }
}

export const activityService = new ActivityService();
export default activityService;