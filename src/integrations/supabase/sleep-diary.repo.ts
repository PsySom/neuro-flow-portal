import { supabase } from './client';
import { SleepDiaryData } from '@/components/diaries/sleep/types';

export interface SleepDiaryEntry {
  id?: string;
  user_id?: string;
  bedtime: string;
  wake_up_time: string;
  sleep_duration: number;
  sleep_quality: number;
  night_awakenings: number;
  morning_feeling: number;
  has_day_rest: boolean;
  day_rest_type?: string;
  day_rest_effectiveness?: number;
  overall_sleep_impact: number;
  sleep_disruptors?: string[];
  sleep_comment?: string;
  rest_comment?: string;
  recommendations?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface SleepDiaryQueryParams {
  limit?: number;
  offset?: number;
  start_date?: string;
  end_date?: string;
  order_by?: 'created_at' | 'bedtime' | 'timestamp';
  order_direction?: 'asc' | 'desc';
}

export class SleepDiaryRepository {
  private tableName = 'sleep_diary_entries';

  async createEntry(data: SleepDiaryData, recommendations: string[]): Promise<SleepDiaryEntry> {
    console.log('🔄 Creating sleep diary entry in Supabase:', data);

    const entry: Omit<SleepDiaryEntry, 'id' | 'created_at' | 'updated_at'> = {
      bedtime: data.bedtime,
      wake_up_time: data.wakeUpTime,
      sleep_duration: data.sleepDuration,
      sleep_quality: data.sleepQuality,
      night_awakenings: data.nightAwakenings,
      morning_feeling: data.morningFeeling,
      has_day_rest: data.hasDayRest,
      day_rest_type: data.dayRestType || null,
      day_rest_effectiveness: data.dayRestEffectiveness || null,
      overall_sleep_impact: data.overallSleepImpact,
      sleep_disruptors: data.sleepDisruptors || [],
      sleep_comment: data.sleepComment || null,
      rest_comment: data.restComment || null,
      recommendations: recommendations
    };

    const { data: savedEntry, error } = await supabase
      .from(this.tableName)
      .insert([entry])
      .select()
      .single();

    if (error) {
      console.error('❌ Failed to create sleep diary entry:', error);
      throw new Error(`Failed to create sleep diary entry: ${error.message}`);
    }

    console.log('✅ Sleep diary entry created successfully:', savedEntry);
    return savedEntry;
  }

  async getEntries(params?: SleepDiaryQueryParams): Promise<SleepDiaryEntry[]> {
    console.log('🔄 Fetching sleep diary entries from Supabase:', params);

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

    // Сортировка
    let orderBy = params?.order_by || 'created_at';
    // Если указан timestamp, используем created_at
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
      console.error('❌ Failed to fetch sleep diary entries:', error);
      throw new Error(`Failed to fetch sleep diary entries: ${error.message}`);
    }

    console.log('✅ Sleep diary entries fetched successfully:', entries?.length);
    return entries || [];
  }

  async getEntry(entryId: string): Promise<SleepDiaryEntry | null> {
    console.log('🔄 Fetching sleep diary entry:', entryId);

    const { data: entry, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', entryId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found
        return null;
      }
      console.error('❌ Failed to fetch sleep diary entry:', error);
      throw new Error(`Failed to fetch sleep diary entry: ${error.message}`);
    }

    console.log('✅ Sleep diary entry fetched successfully');
    return entry;
  }

  async updateEntry(entryId: string, updates: Partial<SleepDiaryEntry>): Promise<SleepDiaryEntry> {
    console.log('🔄 Updating sleep diary entry:', entryId, updates);

    const { data: updatedEntry, error } = await supabase
      .from(this.tableName)
      .update(updates)
      .eq('id', entryId)
      .select()
      .single();

    if (error) {
      console.error('❌ Failed to update sleep diary entry:', error);
      throw new Error(`Failed to update sleep diary entry: ${error.message}`);
    }

    console.log('✅ Sleep diary entry updated successfully:', updatedEntry);
    return updatedEntry;
  }

  async deleteEntry(entryId: string): Promise<void> {
    console.log('🔄 Deleting sleep diary entry:', entryId);

    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', entryId);

    if (error) {
      console.error('❌ Failed to delete sleep diary entry:', error);
      throw new Error(`Failed to delete sleep diary entry: ${error.message}`);
    }

    console.log('✅ Sleep diary entry deleted successfully');
  }

  async getStats(): Promise<{
    total_entries: number;
    average_sleep_duration: number;
    average_sleep_quality: number;
    average_morning_feeling: number;
    most_common_disruptors: string[];
  }> {
    console.log('🔄 Fetching sleep diary statistics');

    const { data: entries, error } = await supabase
      .from(this.tableName)
      .select('sleep_duration, sleep_quality, morning_feeling, sleep_disruptors');

    if (error) {
      console.error('❌ Failed to fetch sleep diary statistics:', error);
      throw new Error(`Failed to fetch sleep diary statistics: ${error.message}`);
    }

    if (!entries || entries.length === 0) {
      return {
        total_entries: 0,
        average_sleep_duration: 0,
        average_sleep_quality: 0,
        average_morning_feeling: 0,
        most_common_disruptors: []
      };
    }

    // Вычисляем статистику
    const totalEntries = entries.length;
    const avgSleepDuration = entries.reduce((sum, entry) => sum + entry.sleep_duration, 0) / totalEntries;
    const avgSleepQuality = entries.reduce((sum, entry) => sum + entry.sleep_quality, 0) / totalEntries;
    const avgMorningFeeling = entries.reduce((sum, entry) => sum + entry.morning_feeling, 0) / totalEntries;

    // Подсчитываем частоту нарушителей сна
    const disruptorCount: Record<string, number> = {};
    entries.forEach(entry => {
      if (entry.sleep_disruptors) {
        entry.sleep_disruptors.forEach(disruptor => {
          disruptorCount[disruptor] = (disruptorCount[disruptor] || 0) + 1;
        });
      }
    });

    const mostCommonDisruptors = Object.entries(disruptorCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([disruptor]) => disruptor);

    const stats = {
      total_entries: totalEntries,
      average_sleep_duration: Math.round(avgSleepDuration * 100) / 100,
      average_sleep_quality: Math.round(avgSleepQuality * 100) / 100,
      average_morning_feeling: Math.round(avgMorningFeeling * 100) / 100,
      most_common_disruptors: mostCommonDisruptors
    };

    console.log('✅ Sleep diary statistics calculated:', stats);
    return stats;
  }
}

export const sleepDiaryRepository = new SleepDiaryRepository();