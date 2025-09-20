import { useState, useEffect } from 'react';
import { backendDiaryService } from '@/services/backend-diary.service';
import { SleepDiaryEntry } from '@/integrations/supabase/sleep-diary.repo';
import { supabase } from '@/integrations/supabase/client';

export interface UseSleepDiaryReturn {
  entries: SleepDiaryEntry[];
  loading: boolean;
  error: string | null;
  refreshEntries: () => Promise<void>;
  getStats: () => Promise<any>;
}

export const useSleepDiary = (): UseSleepDiaryReturn => {
  const [entries, setEntries] = useState<SleepDiaryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshEntries = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Загружаем записи дневника сна...');
      const fetchedEntries = await backendDiaryService.getSleepEntries({
        limit: 50,
        order_by: 'created_at',
        order_direction: 'desc'
      });
      
      // Конвертируем в формат SleepDiaryEntry
      const convertedEntries: SleepDiaryEntry[] = fetchedEntries.map(entry => ({
        id: entry.id,
        user_id: entry.user_id,
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
        recommendations: [], // Пока нет в API ответе
        created_at: entry.timestamp
      }));
      
      setEntries(convertedEntries);
      console.log('✅ Записи дневника сна загружены:', convertedEntries.length);
    } catch (err: any) {
      console.error('❌ Ошибка загрузки записей дневника сна:', err);
      setError(err.message || 'Не удалось загрузить записи дневника сна');
    } finally {
      setLoading(false);
    }
  };

  const getStats = async () => {
    try {
      console.log('🔄 Загружаем статистику дневника сна...');
      const stats = await backendDiaryService.getSleepStatistics();
      console.log('✅ Статистика дневника сна загружена:', stats);
      return stats;
    } catch (err: any) {
      console.error('❌ Ошибка загрузки статистики дневника сна:', err);
      throw err;
    }
  };

  // Загружаем записи при монтировании компонента
  useEffect(() => {
    refreshEntries();
  }, []);

  // Слушаем обновления статуса дневника
  useEffect(() => {
    const handleDiaryUpdate = (event: CustomEvent) => {
      if (event.detail?.path === '/sleep-diary') {
        console.log('📱 Получено обновление дневника сна, перезагружаем записи');
        refreshEntries();
      }
    };

    window.addEventListener('diaryStatusUpdate', handleDiaryUpdate as EventListener);
    
    return () => {
      window.removeEventListener('diaryStatusUpdate', handleDiaryUpdate as EventListener);
    };
  }, []);

  // Подписка на realtime изменения в таблице сна
  useEffect(() => {
    const channel = supabase
      .channel('sleep_diary_entries_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'sleep_diary_entries' },
        (payload) => {
          console.log('🟢 Realtime sleep diary change:', payload.eventType);
          // Обновляем только при вставке/обновлении
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE' || payload.eventType === 'DELETE') {
            refreshEntries();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    entries,
    loading,
    error,
    refreshEntries,
    getStats
  };
};