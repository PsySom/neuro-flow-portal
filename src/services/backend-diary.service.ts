import apiClient, { handleApiError } from './api.client';
import { mockDiaryService } from './mock-diary.service';

// Switch between mock and real API
const USE_MOCK = false;

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
  order_by?: 'created_at' | 'bedtime' | 'timestamp';
  order_direction?: 'asc' | 'desc';
  offset?: number;
  user_id?: string;
  mood_min?: number;
  mood_max?: number;
  emotions?: string[];
}

class BackendDiaryService {
  // === MOOD DIARY ===
  
  async createMoodEntry(entry: MoodEntry): Promise<MoodEntry> {
    if (USE_MOCK) {
      return mockDiaryService.createMoodEntry(entry);
    }
    
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
    if (USE_MOCK) {
      return mockDiaryService.getMoodEntries(params);
    }
    
    try {
      console.log('🔄 Fetching mood entries via Supabase');
      
      // Используем Supabase репозиторий напрямую
      const { moodDiaryRepository } = await import('@/integrations/supabase/mood-diary.repo');
      const supabaseEntries = await moodDiaryRepository.getEntries({
        start_date: params?.start_date,
        end_date: params?.end_date,
        order_direction: params?.sort_desc ? 'desc' : 'asc',
        limit: params?.limit || 100,
        offset: params?.offset,
        mood_min: params?.mood_min,
        mood_max: params?.mood_max
      });

      // Конвертируем в формат MoodEntry
      const result: MoodEntry[] = supabaseEntries.map(entry => ({
        id: entry.id,
        user_id: entry.user_id,
        mood_score: entry.mood_score,
        emotions: entry.emotions || [],
        triggers: entry.triggers || [],
        physical_sensations: entry.physical_sensations || [],
        body_areas: entry.body_areas || [],
        context: entry.context || '',
        notes: entry.notes || '',
        timestamp: entry.created_at || new Date().toISOString()
      }));

      console.log('✅ Mood entries fetched via Supabase:', result.length);
      return result;
    } catch (error: any) {
      console.error('❌ Failed to fetch mood entries:', error);
      // Fallback к старому API
      try {
        const response = await apiClient.get<MoodEntry[]>('/diary/mood/flexible', { params });
        return response.data;
      } catch (apiError) {
        console.error('❌ API also failed, returning empty array');
        return [];
      }
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
  
  async createSleepEntry(entry: SleepEntry, recommendations?: string[]): Promise<SleepEntry> {
    if (USE_MOCK) {
      return mockDiaryService.createSleepEntry(entry);
    }
    
    try {
      console.log('🔄 Creating sleep entry via Supabase');
      
      // Импортируем репозиторий динамически чтобы избежать циклических импортов
      const { sleepDiaryRepository } = await import('@/integrations/supabase/sleep-diary.repo');
      
      // Конвертируем SleepEntry в SleepDiaryData для репозитория
      const sleepData = {
        bedtime: entry.bedtime,
        wakeUpTime: entry.wake_up_time,
        sleepDuration: entry.sleep_duration,
        sleepQuality: entry.sleep_quality,
        nightAwakenings: entry.night_awakenings,
        morningFeeling: entry.morning_feeling,
        hasDayRest: entry.has_day_rest || false,
        dayRestType: entry.day_rest_type || '',
        dayRestEffectiveness: entry.day_rest_effectiveness || 5,
        overallSleepImpact: entry.overall_sleep_impact,
        sleepDisruptors: entry.sleep_disruptors || [],
        sleepComment: entry.sleep_comment || '',
        restComment: entry.rest_comment || ''
      };
      
      const savedEntry = await sleepDiaryRepository.createEntry(sleepData, recommendations || []);
      
      // Конвертируем обратно в SleepEntry формат
      const result: SleepEntry = {
        id: savedEntry.id!,
        user_id: savedEntry.user_id!,
        bedtime: savedEntry.bedtime,
        wake_up_time: savedEntry.wake_up_time,
        sleep_duration: savedEntry.sleep_duration,
        sleep_quality: savedEntry.sleep_quality,
        night_awakenings: savedEntry.night_awakenings,
        morning_feeling: savedEntry.morning_feeling,
        has_day_rest: savedEntry.has_day_rest,
        day_rest_type: savedEntry.day_rest_type,
        day_rest_effectiveness: savedEntry.day_rest_effectiveness,
        overall_sleep_impact: savedEntry.overall_sleep_impact,
        sleep_disruptors: savedEntry.sleep_disruptors,
        sleep_comment: savedEntry.sleep_comment,
        rest_comment: savedEntry.rest_comment,
        timestamp: savedEntry.created_at!
      };
      
      console.log('✅ Sleep entry created via Supabase');
      return result;
    } catch (error: any) {
      console.error('❌ Failed to create sleep entry:', error);
      throw error;
    }
  }

  async getSleepEntries(params?: DiaryQueryParams): Promise<SleepEntry[]> {
    if (USE_MOCK) {
      return mockDiaryService.getSleepEntries(params);
    }
    
    try {
      console.log('🔄 Fetching sleep entries via Supabase');
      
      const { sleepDiaryRepository } = await import('@/integrations/supabase/sleep-diary.repo');
      const entries = await sleepDiaryRepository.getEntries(params);
      
      // Конвертируем в формат SleepEntry
      const result: SleepEntry[] = entries.map(entry => ({
        id: entry.id!,
        user_id: entry.user_id!,
        bedtime: entry.bedtime,
        wake_up_time: entry.wake_up_time,
        sleep_duration: entry.sleep_duration,
        sleep_quality: entry.sleep_quality,
        night_awakenings: entry.night_awakenings,
        morning_feeling: entry.morning_feeling,
        has_day_rest: entry.has_day_rest,
        day_rest_type: entry.day_rest_type,
        day_rest_effectiveness: entry.day_rest_effectiveness,
        overall_sleep_impact: entry.overall_sleep_impact,
        sleep_disruptors: entry.sleep_disruptors,
        sleep_comment: entry.sleep_comment,
        rest_comment: entry.rest_comment,
        timestamp: entry.created_at!
      }));
      
      console.log('✅ Sleep entries fetched via Supabase:', result.length);
      return result;
    } catch (error: any) {
      console.error('❌ Failed to fetch sleep entries:', error);
      return [];
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
    if (USE_MOCK) {
      return mockDiaryService.getSleepStats();
    }
    
    try {
      console.log('🔄 Fetching sleep statistics via Supabase');
      
      const { sleepDiaryRepository } = await import('@/integrations/supabase/sleep-diary.repo');
      const stats = await sleepDiaryRepository.getStats();
      
      console.log('✅ Sleep statistics fetched via Supabase');
      return stats;
    } catch (error: any) {
      console.error('❌ Failed to fetch sleep statistics:', error);
      return {
        total_entries: 0,
        average_sleep_duration: 0,
        average_sleep_quality: 0,
        average_morning_feeling: 0,
        most_common_disruptors: []
      };
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