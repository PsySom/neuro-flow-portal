import apiClient, { handleApiError } from './api.client';

// === DIARY INTERFACES ===

export interface MoodEntry {
  id?: string;
  user_id?: string;
  mood_score: number; // -10 to 10
  emotions: {
    name: string;
    intensity: number; // 0 to 10
    category: 'positive' | 'neutral' | 'negative';
  }[];
  timestamp: string; // ISO 8601
  triggers?: string[];
  physical_sensations?: string[];
  body_areas?: string[];
  context?: string;
  notes?: string;
}

export interface ThoughtEntry {
  id?: string;
  user_id?: string;
  situation: string;
  automatic_thoughts: {
    content: string;
    belief_level: number; // 0 to 100
    cognitive_distortions?: string[];
  }[];
  emotions: {
    name: string;
    intensity: number; // 0 to 10
  }[];
  timestamp?: string; // ISO 8601
  evidence_for?: string[];
  evidence_against?: string[];
  balanced_thought?: string;
  new_belief_level?: number; // 0 to 100
  action_plan?: string;
}

export interface SleepEntry {
  id?: string;
  user_id?: string;
  bedtime: string; // HH:MM format
  wake_up_time: string; // HH:MM format
  sleep_duration: number; // hours (0.5-24.0)
  sleep_quality: number; // -5 to +5
  night_awakenings: number; // 0-10
  sleep_disruptors?: string[];
  sleep_comment?: string;
  morning_feeling: number; // 1 to 10
  has_day_rest: boolean;
  day_rest_type?: string;
  day_rest_effectiveness?: number; // 1 to 10
  overall_sleep_impact: number; // -5 to +5
  rest_comment?: string;
  timestamp?: string; // ISO 8601
}

// === QUERY PARAMETERS ===
export interface DiaryQueryParams {
  start_date?: string; // YYYY-MM-DD
  end_date?: string; // YYYY-MM-DD
  limit?: number;
  skip?: number;
  sort_desc?: boolean;
  sleep_quality_min?: number;
  sleep_quality_max?: number;
  has_day_rest?: boolean;
}

class BackendDiaryService {
  // === MOOD DIARY ===
  
  async createMoodEntry(entry: MoodEntry): Promise<MoodEntry> {
    try {
      console.log('🔄 Creating mood entry');
      // Используем новый frontend endpoint с автоматической конвертацией
      const response = await apiClient.post<MoodEntry>('/diary/mood/frontend', entry);
      console.log('✅ Mood entry created');
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to create mood entry:', error);
      throw handleApiError(error);
    }
  }

  async getMoodEntries(params?: DiaryQueryParams): Promise<MoodEntry[]> {
    try {
      // Используем гибкий endpoint с автоматическим fallback
      const response = await apiClient.get<MoodEntry[]>('/diary/mood/flexible', { params });
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to fetch mood data:', error);
      // Возвращаем пустой массив как fallback
      return [];
    }
  }

  async getMoodEntry(entryId: string): Promise<MoodEntry> {
    try {
      const response = await apiClient.get<MoodEntry>(`/diary/mood/${entryId}`);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  async updateMoodEntry(entryId: string, entry: Partial<MoodEntry>): Promise<MoodEntry> {
    try {
      const response = await apiClient.put<MoodEntry>(`/diary/mood/${entryId}`, entry);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  async deleteMoodEntry(entryId: string): Promise<void> {
    try {
      await apiClient.delete(`/diary/mood/${entryId}`);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // === THOUGHT DIARY ===
  
  async createThoughtEntry(entry: ThoughtEntry): Promise<ThoughtEntry> {
    try {
      console.log('🔄 Creating thought entry');
      const response = await apiClient.post<ThoughtEntry>('/diary/thought', entry);
      console.log('✅ Thought entry created');
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to create thought entry:', error);
      throw handleApiError(error);
    }
  }

  async getThoughtEntries(params?: DiaryQueryParams): Promise<ThoughtEntry[]> {
    try {
      const response = await apiClient.get<ThoughtEntry[]>('/diary/thought', { params });
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  async getThoughtEntry(entryId: string): Promise<ThoughtEntry> {
    try {
      const response = await apiClient.get<ThoughtEntry>(`/diary/thought/${entryId}`);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  async updateThoughtEntry(entryId: string, entry: Partial<ThoughtEntry>): Promise<ThoughtEntry> {
    try {
      const response = await apiClient.put<ThoughtEntry>(`/diary/thought/${entryId}`, entry);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  async deleteThoughtEntry(entryId: string): Promise<void> {
    try {
      await apiClient.delete(`/diary/thought/${entryId}`);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // === SLEEP DIARY ===
  
  async createSleepEntry(entry: SleepEntry): Promise<SleepEntry> {
    try {
      console.log('🔄 Creating sleep entry');
      const response = await apiClient.post<SleepEntry>('/diary/sleep', entry);
      console.log('✅ Sleep entry created');
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to create sleep entry:', error);
      throw handleApiError(error);
    }
  }

  async getSleepEntries(params?: DiaryQueryParams): Promise<SleepEntry[]> {
    try {
      const response = await apiClient.get<SleepEntry[]>('/diary/sleep', { params });
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  async getSleepEntry(entryId: string): Promise<SleepEntry> {
    try {
      const response = await apiClient.get<SleepEntry>(`/diary/sleep/${entryId}`);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  async updateSleepEntry(entryId: string, entry: Partial<SleepEntry>): Promise<SleepEntry> {
    try {
      const response = await apiClient.put<SleepEntry>(`/diary/sleep/${entryId}`, entry);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  async deleteSleepEntry(entryId: string): Promise<void> {
    try {
      await apiClient.delete(`/diary/sleep/${entryId}`);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  // === ANALYTICS & STATISTICS ===

  async getMoodStatistics(params?: DiaryQueryParams) {
    try {
      const response = await apiClient.get('/diary/mood/statistics', { params });
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  async getMoodTrends(params?: DiaryQueryParams) {
    try {
      const response = await apiClient.get('/diary/mood/trends', { params });
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  async getSleepStatistics(params?: DiaryQueryParams) {
    try {
      const response = await apiClient.get('/diary/sleep/statistics', { params });
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  async getSleepTrends(params?: DiaryQueryParams) {
    try {
      const response = await apiClient.get('/diary/sleep/trends', { params });
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }
}

export const backendDiaryService = new BackendDiaryService();
export default backendDiaryService;