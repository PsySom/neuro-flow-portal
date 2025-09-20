import { supabase } from './client';

export interface MoodDiaryEntry {
  id?: string;
  user_id?: string;
  mood_score: number; // -10 to 10
  emotions: {
    name: string;
    intensity: number; // 0 to 10
    category: 'positive' | 'neutral' | 'negative';
  }[];
  triggers?: string[];
  physical_sensations?: string[];
  body_areas?: string[];
  context?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MoodDiaryQueryParams {
  limit?: number;
  offset?: number;
  start_date?: string;
  end_date?: string;
  order_by?: 'created_at' | 'timestamp';
  order_direction?: 'asc' | 'desc';
  mood_min?: number;
  mood_max?: number;
}

export class MoodDiaryRepository {
  private tableName = 'mood_diary_entries';

  async createEntry(data: Omit<MoodDiaryEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<MoodDiaryEntry> {
    console.log('🔄 Creating mood diary entry in Supabase:', data);

    const { data: savedEntry, error } = await supabase
      .from(this.tableName)
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error('❌ Failed to create mood diary entry:', error);
      throw new Error(`Failed to create mood diary entry: ${error.message}`);
    }

    console.log('✅ Mood diary entry created successfully:', savedEntry);
    return savedEntry;
  }

  async getEntries(params?: MoodDiaryQueryParams): Promise<MoodDiaryEntry[]> {
    console.log('🔄 Fetching mood diary entries from Supabase:', params);

    let query = supabase
      .from(this.tableName)
      .select('*');

    // Применяем фильтры
    if (params?.start_date) {
      query = query.gte('created_at', params.start_date);
    }
    if (params?.end_date) {
      query = query.lte('created_at', params.end_date);
    }
    if (params?.mood_min !== undefined) {
      query = query.gte('mood_score', params.mood_min);
    }
    if (params?.mood_max !== undefined) {
      query = query.lte('mood_score', params.mood_max);
    }

    // Сортировка
    let orderBy = params?.order_by || 'created_at';
    if (orderBy === 'timestamp') {
      orderBy = 'created_at';
    }
    const orderDirection = params?.order_direction || 'desc';
    query = query.order(orderBy, { ascending: orderDirection === 'asc' });

    // Пагинация
    if (params?.limit) {
      query = query.limit(params.limit);
    }
    if (params?.offset) {
      query = query.range(params.offset, (params.offset + (params.limit || 50)) - 1);
    }

    const { data: entries, error } = await query;

    if (error) {
      console.error('❌ Failed to fetch mood diary entries:', error);
      throw new Error(`Failed to fetch mood diary entries: ${error.message}`);
    }

    console.log('✅ Mood diary entries fetched successfully:', entries?.length);
    return entries || [];
  }

  async getEntry(entryId: string): Promise<MoodDiaryEntry | null> {
    console.log('🔄 Fetching mood diary entry:', entryId);

    const { data: entry, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', entryId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('❌ Failed to fetch mood diary entry:', error);
      throw new Error(`Failed to fetch mood diary entry: ${error.message}`);
    }

    console.log('✅ Mood diary entry fetched successfully');
    return entry;
  }

  async updateEntry(entryId: string, updates: Partial<MoodDiaryEntry>): Promise<MoodDiaryEntry> {
    console.log('🔄 Updating mood diary entry:', entryId, updates);

    const { data: updatedEntry, error } = await supabase
      .from(this.tableName)
      .update(updates)
      .eq('id', entryId)
      .select()
      .single();

    if (error) {
      console.error('❌ Failed to update mood diary entry:', error);
      throw new Error(`Failed to update mood diary entry: ${error.message}`);
    }

    console.log('✅ Mood diary entry updated successfully:', updatedEntry);
    return updatedEntry;
  }

  async deleteEntry(entryId: string): Promise<void> {
    console.log('🔄 Deleting mood diary entry:', entryId);

    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', entryId);

    if (error) {
      console.error('❌ Failed to delete mood diary entry:', error);
      throw new Error(`Failed to delete mood diary entry: ${error.message}`);
    }

    console.log('✅ Mood diary entry deleted successfully');
  }

  async getStats(): Promise<{
    total_entries: number;
    average_mood: number;
    mood_trend: 'improving' | 'stable' | 'declining';
    most_common_emotions: string[];
    most_common_triggers: string[];
  }> {
    console.log('🔄 Fetching mood diary statistics');

    const { data: entries, error } = await supabase
      .from(this.tableName)
      .select('mood_score, emotions, triggers')
      .order('created_at', { ascending: false })
      .limit(100); // Последние 100 записей для анализа

    if (error) {
      console.error('❌ Failed to fetch mood diary statistics:', error);
      throw new Error(`Failed to fetch mood diary statistics: ${error.message}`);
    }

    if (!entries || entries.length === 0) {
      return {
        total_entries: 0,
        average_mood: 0,
        mood_trend: 'stable',
        most_common_emotions: [],
        most_common_triggers: []
      };
    }

    // Вычисляем статистику
    const totalEntries = entries.length;
    const avgMood = entries.reduce((sum, entry) => sum + entry.mood_score, 0) / totalEntries;

    // Анализ тренда (последние 20 записей vs предыдущие 20)
    const recentEntries = entries.slice(0, Math.min(20, Math.floor(totalEntries / 2)));
    const olderEntries = entries.slice(Math.min(20, Math.floor(totalEntries / 2)));
    
    let moodTrend: 'improving' | 'stable' | 'declining' = 'stable';
    if (recentEntries.length > 0 && olderEntries.length > 0) {
      const recentAvg = recentEntries.reduce((sum, entry) => sum + entry.mood_score, 0) / recentEntries.length;
      const olderAvg = olderEntries.reduce((sum, entry) => sum + entry.mood_score, 0) / olderEntries.length;
      const difference = recentAvg - olderAvg;
      
      if (difference > 0.5) moodTrend = 'improving';
      else if (difference < -0.5) moodTrend = 'declining';
    }

    // Подсчитываем частоту эмоций
    const emotionCount: Record<string, number> = {};
    entries.forEach(entry => {
      if (entry.emotions && Array.isArray(entry.emotions)) {
        entry.emotions.forEach(emotion => {
          if (emotion && typeof emotion === 'object' && emotion.name) {
            emotionCount[emotion.name] = (emotionCount[emotion.name] || 0) + 1;
          }
        });
      }
    });

    // Подсчитываем частоту триггеров
    const triggerCount: Record<string, number> = {};
    entries.forEach(entry => {
      if (entry.triggers && Array.isArray(entry.triggers)) {
        entry.triggers.forEach(trigger => {
          triggerCount[trigger] = (triggerCount[trigger] || 0) + 1;
        });
      }
    });

    const mostCommonEmotions = Object.entries(emotionCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([emotion]) => emotion);

    const mostCommonTriggers = Object.entries(triggerCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([trigger]) => trigger);

    const stats = {
      total_entries: totalEntries,
      average_mood: Math.round(avgMood * 100) / 100,
      mood_trend: moodTrend,
      most_common_emotions: mostCommonEmotions,
      most_common_triggers: mostCommonTriggers
    };

    console.log('✅ Mood diary statistics calculated:', stats);
    return stats;
  }
}

export const moodDiaryRepository = new MoodDiaryRepository();