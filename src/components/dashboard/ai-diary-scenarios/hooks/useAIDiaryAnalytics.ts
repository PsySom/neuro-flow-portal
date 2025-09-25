import { useState, useEffect, useCallback } from 'react';
import { AIDiaryAnalyticsService, SessionStats, TopicFrequency } from '@/services/ai-diary-analytics.service';
import { supabase } from '@/integrations/supabase/client';

interface UseAIDiaryAnalyticsProps {
  sessionId: string | null;
  messages: any[];
  isLoadingHistory: boolean;
}

export const useAIDiaryAnalytics = ({ sessionId, messages, isLoadingHistory }: UseAIDiaryAnalyticsProps) => {
  const [globalStats, setGlobalStats] = useState<SessionStats | null>(null);
  const [currentSessionStats, setCurrentSessionStats] = useState<Partial<SessionStats>>({});
  const [topTopics, setTopTopics] = useState<TopicFrequency[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  // Загружаем глобальную статистику
  const loadGlobalStats = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;
      if (!userId) return;

      setIsLoadingStats(true);
      const stats = await AIDiaryAnalyticsService.getUserStats(userId);
      setGlobalStats(stats);

      // Загружаем топ тем
      const topics = await AIDiaryAnalyticsService.getTopTopics(userId, 3);
      setTopTopics(topics);
    } catch (error) {
      console.error('Ошибка загрузки глобальной статистики:', error);
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  // Загружаем статистику текущей сессии
  const loadCurrentSessionStats = useCallback(async () => {
    if (!sessionId || messages.length === 0) {
      setCurrentSessionStats({});
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;
      if (!userId) return;

      const stats = await AIDiaryAnalyticsService.getCurrentSessionStats(
        sessionId, 
        userId, 
        messages
      );
      setCurrentSessionStats(stats);
    } catch (error) {
      console.error('Ошибка загрузки статистики текущей сессии:', error);
    }
  }, [sessionId, messages]);

  // Загружаем глобальную статистику при монтировании
  useEffect(() => {
    if (!isLoadingHistory) {
      loadGlobalStats();
    }
  }, [isLoadingHistory, loadGlobalStats]);

  // Обновляем статистику текущей сессии при изменении сообщений
  useEffect(() => {
    if (!isLoadingHistory) {
      loadCurrentSessionStats();
    }
  }, [sessionId, messages.length, isLoadingHistory, loadCurrentSessionStats]);

  // Обновляем статистику текущей сессии каждую минуту (для длительности)
  useEffect(() => {
    if (!sessionId) return;

    const interval = setInterval(() => {
      loadCurrentSessionStats();
    }, 60000); // каждую минуту

    return () => clearInterval(interval);
  }, [sessionId, loadCurrentSessionStats]);

  return {
    globalStats,
    currentSessionStats,
    topTopics,
    isLoadingStats,
    refreshStats: loadGlobalStats
  };
};