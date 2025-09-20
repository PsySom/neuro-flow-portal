import { useState, useEffect } from 'react';
import { moodDiaryRepository, MoodDiaryEntry } from '@/integrations/supabase/mood-diary.repo';

interface UseMoodDiaryReturn {
  entries: MoodDiaryEntry[];
  loading: boolean;
  error: string | null;
  refreshEntries: () => Promise<void>;
  getStats: () => Promise<any>;
}

export const useMoodDiary = (): UseMoodDiaryReturn => {
  const [entries, setEntries] = useState<MoodDiaryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshEntries = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Загружаем записи дневника настроения...');
      const fetchedEntries = await moodDiaryRepository.getEntries({
        limit: 50,
        order_by: 'created_at',
        order_direction: 'desc'
      });
      
      setEntries(fetchedEntries);
      console.log('✅ Записи дневника настроения загружены:', fetchedEntries.length);
    } catch (err: any) {
      console.error('❌ Ошибка загрузки записей дневника настроения:', err);
      setError(err.message || 'Ошибка загрузки данных');
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const getStats = async () => {
    try {
      console.log('🔄 Загружаем статистику дневника настроения...');
      const stats = await moodDiaryRepository.getStats();
      console.log('✅ Статистика дневника настроения загружена');
      return stats;
    } catch (err: any) {
      console.error('❌ Ошибка загрузки статистики дневника настроения:', err);
      throw err;
    }
  };

  // Загружаем записи при монтировании компонента
  useEffect(() => {
    refreshEntries();
  }, []);

  // Слушаем события обновления дневника
  useEffect(() => {
    const handleDiaryUpdate = () => {
      console.log('📊 Обнаружено обновление дневника, обновляем записи настроения');
      refreshEntries();
    };

    // Слушаем кастомные события
    window.addEventListener('diaryStatusUpdate', handleDiaryUpdate);
    window.addEventListener('mood-data-updated', handleDiaryUpdate);
    
    return () => {
      window.removeEventListener('diaryStatusUpdate', handleDiaryUpdate);
      window.removeEventListener('mood-data-updated', handleDiaryUpdate);
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