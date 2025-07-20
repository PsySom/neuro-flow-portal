import apiClient, { handleApiError } from './api.client';

export interface ActivityEvaluation {
  id?: number;
  activity_id?: string;
  mood_before?: number;
  mood_after?: number;
  energy_before?: number;
  energy_after?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface StateSnapshot {
  id?: number;
  mood?: number;
  energy?: number;
  anxiety?: number;
  focus?: number;
  motivation?: number;
  social_connection?: number;
  physical_comfort?: number;
  sleep_quality?: number;
  stress_level?: number;
  notes?: string;
  created_at?: string;
}

class BackendActivityService {
  // === Activity Evaluations ===
  
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

  async getEvaluation(evaluationId: number): Promise<ActivityEvaluation> {
    try {
      const response = await apiClient.get<ActivityEvaluation>(`/activity-state/evaluations/${evaluationId}`);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  async updateEvaluation(evaluationId: number, evaluation: Partial<ActivityEvaluation>): Promise<ActivityEvaluation> {
    try {
      const response = await apiClient.put<ActivityEvaluation>(`/activity-state/evaluations/${evaluationId}`, evaluation);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  async deleteEvaluation(evaluationId: number): Promise<void> {
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

  async getSnapshot(snapshotId: number): Promise<StateSnapshot> {
    try {
      const response = await apiClient.get<StateSnapshot>(`/activity-state/snapshots/${snapshotId}`);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  async updateSnapshot(snapshotId: number, snapshot: Partial<StateSnapshot>): Promise<StateSnapshot> {
    try {
      const response = await apiClient.put<StateSnapshot>(`/activity-state/snapshots/${snapshotId}`, snapshot);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  async deleteSnapshot(snapshotId: number): Promise<void> {
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