import apiClient, { handleApiError } from './api.client';
import { 
  Activity, 
  CreateActivityRequest, 
  UpdateActivityRequest,
  ActivityState,
  UpdateActivityStateRequest,
  ActivityType,
  PaginatedResponse
} from '../types/api.types';

class ActivityService {
  // Get activities for a specific date
  async getActivities(date?: string): Promise<Activity[]> {
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
    try {
      const response = await apiClient.post<Activity>('/activities', data);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Update activity
  async updateActivity(id: number, data: UpdateActivityRequest): Promise<Activity> {
    try {
      const response = await apiClient.put<Activity>(`/activities/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Delete activity
  async deleteActivity(id: number): Promise<void> {
    try {
      await apiClient.delete(`/activities/${id}`);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Get activity types
  async getActivityTypes(): Promise<ActivityType[]> {
    try {
      const response = await apiClient.get<ActivityType[]>('/activities/types');
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // Activity States
  async getActivityState(activityId: number): Promise<ActivityState | null> {
    try {
      const response = await apiClient.get<ActivityState>(`/activities/${activityId}/state`);
      return response.data;
    } catch (error: any) {
      if (error.status === 404) return null;
      throw handleApiError(error);
    }
  }

  async updateActivityState(activityId: number, data: UpdateActivityStateRequest): Promise<ActivityState> {
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