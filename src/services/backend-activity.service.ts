import apiClient, { handleApiError } from './api.client';

// === ACTIVITY INTERFACES ===

export interface CreateActivityRequest {
  title: string;
  description?: string;
  activity_type_id?: string; // UUID
  activity_subtype_id?: string; // UUID
  start_time: string; // ISO 8601
  end_time: string; // ISO 8601
  is_recurring?: boolean;
  recurrence_pattern?: Record<string, any>;
  priority?: number; // 1-5
  energy_required?: number; // 1-5
  color?: string;
  location?: string;
  tags?: string[];
  parent_activity_id?: string; // UUID
}

export interface UpdateActivityRequest {
  title?: string;
  description?: string;
  activity_type_id?: string;
  activity_subtype_id?: string;
  start_time?: string;
  end_time?: string;
  is_completed?: boolean;
  completion_time?: string;
  is_recurring?: boolean;
  recurrence_pattern?: Record<string, any>;
  priority?: number;
  energy_required?: number;
  color?: string;
  location?: string;
  tags?: string[];
}

export interface Activity {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  activity_type_id?: string;
  activity_subtype_id?: string;
  start_time: string;
  end_time: string;
  is_completed: boolean;
  completion_time?: string;
  is_recurring: boolean;
  recurrence_pattern?: Record<string, any>;
  priority: number;
  energy_required: number;
  color?: string;
  location?: string;
  tags?: string[];
  parent_activity_id?: string;
  created_at: string;
  updated_at: string;
}

// === ACTIVITY STATE INTERFACES ===

export interface ActivityEvaluation {
  id?: string;
  user_id?: string;
  activity_id: string; // UUID
  timestamp: string; // ISO 8601
  completion_status: string;
  schedule_id?: string;
  satisfaction_result: number; // 1-10
  satisfaction_process: number; // 1-10
  energy_impact: number; // -5 to 5
  stress_impact: number; // -5 to 5
  needs_impact?: {
    need_id: string;
    impact_score: number;
  }[];
  duration_minutes?: number;
  notes?: string;
}

export interface StateSnapshot {
  id?: string;
  user_id?: string;
  timestamp: string; // ISO 8601
  snapshot_type: string;
  mood: {
    level: number;
    notes?: string;
  };
  energy: {
    level: number;
    notes?: string;
  };
  stress: {
    level: number;
    notes?: string;
  };
  needs?: {
    need_id: string;
    satisfaction_level: number;
  }[];
  focus_level?: number; // 1-10
  sleep_quality?: number; // 1-10
  context_factors?: string[];
}

// === QUERY PARAMETERS ===
export interface ActivityQueryParams {
  start_date?: string; // YYYY-MM-DD
  end_date?: string; // YYYY-MM-DD
  is_completed?: boolean;
  activity_type_id?: string;
  activity_subtype_id?: string;
  priority?: number;
  tags?: string[];
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_desc?: boolean;
}

class BackendActivityService {
  // === ACTIVITIES ===
  
  async createActivity(activity: CreateActivityRequest): Promise<Activity> {
    try {
      console.log('🔄 Creating activity');
      const response = await apiClient.post<Activity>('/activities/', activity);
      console.log('✅ Activity created');
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to create activity:', error);
      throw handleApiError(error);
    }
  }

  async getActivities(params?: ActivityQueryParams): Promise<Activity[]> {
    try {
      const response = await apiClient.get<Activity[]>('/activities/', { params });
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  async getActivity(activityId: string): Promise<Activity> {
    try {
      const response = await apiClient.get<Activity>(`/activities/${activityId}`);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  async updateActivity(activityId: string, activity: UpdateActivityRequest): Promise<Activity> {
    try {
      const response = await apiClient.put<Activity>(`/activities/${activityId}`, activity);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  async deleteActivity(activityId: string): Promise<void> {
    try {
      await apiClient.delete(`/activities/${activityId}`);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  async getCalendarView(startDate: string, endDate: string): Promise<Activity[]> {
    try {
      const response = await apiClient.get<Activity[]>('/activities/calendar/view', {
        params: { start_date: startDate, end_date: endDate }
      });
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // === ACTIVITY EVALUATIONS ===
  
  async createEvaluation(evaluation: ActivityEvaluation): Promise<ActivityEvaluation> {
    try {
      console.log('🔄 Creating activity evaluation');
      const response = await apiClient.post<ActivityEvaluation>('/activity-state/evaluations', evaluation);
      console.log('✅ Activity evaluation created');
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to create evaluation:', error);
      throw handleApiError(error);
    }
  }

  async getEvaluations(): Promise<ActivityEvaluation[]> {
    try {
      const response = await apiClient.get<ActivityEvaluation[]>('/activity-state/evaluations');
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  async getEvaluation(evaluationId: string): Promise<ActivityEvaluation> {
    try {
      const response = await apiClient.get<ActivityEvaluation>(`/activity-state/evaluations/${evaluationId}`);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  async updateEvaluation(evaluationId: string, evaluation: Partial<ActivityEvaluation>): Promise<ActivityEvaluation> {
    try {
      const response = await apiClient.put<ActivityEvaluation>(`/activity-state/evaluations/${evaluationId}`, evaluation);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  async deleteEvaluation(evaluationId: string): Promise<void> {
    try {
      await apiClient.delete(`/activity-state/evaluations/${evaluationId}`);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  async getEvaluationStatistics(): Promise<any> {
    try {
      const response = await apiClient.get('/activity-state/evaluations/statistics');
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // === State Snapshots ===

  async createSnapshot(snapshot: StateSnapshot): Promise<StateSnapshot> {
    try {
      console.log('🔄 Creating state snapshot');
      const response = await apiClient.post<StateSnapshot>('/activity-state/snapshots', snapshot);
      console.log('✅ State snapshot created');
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to create snapshot:', error);
      throw handleApiError(error);
    }
  }

  async getSnapshots(): Promise<StateSnapshot[]> {
    try {
      const response = await apiClient.get<StateSnapshot[]>('/activity-state/snapshots');
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  async getSnapshot(snapshotId: string): Promise<StateSnapshot> {
    try {
      const response = await apiClient.get<StateSnapshot>(`/activity-state/snapshots/${snapshotId}`);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  async updateSnapshot(snapshotId: string, snapshot: Partial<StateSnapshot>): Promise<StateSnapshot> {
    try {
      const response = await apiClient.put<StateSnapshot>(`/activity-state/snapshots/${snapshotId}`, snapshot);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  async deleteSnapshot(snapshotId: string): Promise<void> {
    try {
      await apiClient.delete(`/activity-state/snapshots/${snapshotId}`);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  async getStateTrends(): Promise<any> {
    try {
      const response = await apiClient.get('/activity-state/snapshots/trends');
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  async getNeedsTrends(): Promise<any> {
    try {
      const response = await apiClient.get('/activity-state/snapshots/needs-trends');
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  async getContextAnalysis(): Promise<any> {
    try {
      const response = await apiClient.get('/activity-state/snapshots/context-analysis');
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }
}

export const backendActivityService = new BackendActivityService();
export default backendActivityService;