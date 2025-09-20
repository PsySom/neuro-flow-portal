import { supabase } from '@/integrations/supabase/client';

export interface SessionStats {
  totalSessions: number;
  averageMessagesPerSession: number;
  totalMessages: number;
  currentSessionDuration?: number;
  currentSessionMessages?: number;
  averageUserMessageLength?: number;
}

export interface TopicFrequency {
  topic: string;
  count: number;
}

export class AIDiaryAnalyticsService {
  /**
   * Получить общую статистику пользователя
   */
  static async getUserStats(userId: string): Promise<SessionStats | null> {
    try {
      // Получаем количество сессий
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('ai_diary_sessions')
        .select('session_id, started_at, ended_at')
        .eq('user_id', userId);

      if (sessionsError) {
        console.error('Ошибка получения сессий:', sessionsError);
        return null;
      }

      // Получаем общее количество сообщений
      const { data: messagesData, error: messagesError } = await supabase
        .from('ai_diary_messages')
        .select('session_id, message_type, content')
        .eq('user_id', userId);

      if (messagesError) {
        console.error('Ошибка получения сообщений:', messagesError);
        return null;
      }

      const totalSessions = sessionsData?.length || 0;
      const totalMessages = messagesData?.length || 0;
      const averageMessagesPerSession = totalSessions > 0 ? Math.round(totalMessages / totalSessions) : 0;

      return {
        totalSessions,
        totalMessages,
        averageMessagesPerSession
      };

    } catch (error) {
      console.error('Ошибка получения статистики пользователя:', error);
      return null;
    }
  }

  /**
   * Получить статистику текущей сессии
   */
  static async getCurrentSessionStats(
    sessionId: string, 
    userId: string,
    currentMessages: any[]
  ): Promise<Partial<SessionStats>> {
    try {
      // Получаем информацию о сессии
      const { data: sessionData, error: sessionError } = await supabase
        .from('ai_diary_sessions')
        .select('started_at, ended_at')
        .eq('session_id', sessionId)
        .eq('user_id', userId)
        .single();

      if (sessionError) {
        console.error('Ошибка получения данных сессии:', sessionError);
        return {};
      }

      // Вычисляем длительность сессии
      const startTime = new Date(sessionData.started_at);
      const endTime = sessionData.ended_at ? new Date(sessionData.ended_at) : new Date();
      const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));

      // Подсчитываем сообщения пользователя из текущего состояния
      const userMessages = currentMessages.filter(msg => msg.type === 'user');
      const userMessageLengths = userMessages.map(msg => msg.content.length);
      const averageUserMessageLength = userMessageLengths.length > 0 
        ? Math.round(userMessageLengths.reduce((a, b) => a + b, 0) / userMessageLengths.length)
        : 0;

      return {
        currentSessionDuration: durationMinutes,
        currentSessionMessages: currentMessages.length,
        averageUserMessageLength
      };

    } catch (error) {
      console.error('Ошибка получения статистики текущей сессии:', error);
      return {};
    }
  }

  /**
   * Получить самые частые темы (простой анализ ключевых слов)
   */
  static async getTopTopics(userId: string, limit: number = 5): Promise<TopicFrequency[]> {
    try {
      const { data: messagesData, error } = await supabase
        .from('ai_diary_messages')
        .select('content')
        .eq('user_id', userId)
        .eq('message_type', 'user');

      if (error) {
        console.error('Ошибка получения сообщений для анализа тем:', error);
        return [];
      }

      if (!messagesData || messagesData.length === 0) {
        return [];
      }

      // Простой анализ ключевых слов
      const topicWords = [
        'работа', 'семья', 'здоровье', 'стресс', 'тревога', 'сон', 
        'отношения', 'друзья', 'учеба', 'деньги', 'будущее', 'прошлое',
        'настроение', 'депрессия', 'радость', 'грусть', 'злость', 'страх',
        'мечты', 'цели', 'планы', 'проблемы', 'решения', 'мысли'
      ];

      const topicCounts: Record<string, number> = {};

      // Подсчитываем упоминания тем
      messagesData.forEach(message => {
        const content = message.content.toLowerCase();
        topicWords.forEach(topic => {
          if (content.includes(topic)) {
            topicCounts[topic] = (topicCounts[topic] || 0) + 1;
          }
        });
      });

      // Сортируем по частоте и возвращаем топ
      return Object.entries(topicCounts)
        .map(([topic, count]) => ({ topic, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);

    } catch (error) {
      console.error('Ошибка анализа тем:', error);
      return [];
    }
  }

  /**
   * Форматировать длительность в читаемый вид
   */
  static formatDuration(minutes: number): string {
    if (minutes < 1) return '< 1 мин';
    if (minutes < 60) return `${minutes} мин`;
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) return `${hours} ч`;
    return `${hours} ч ${remainingMinutes} мин`;
  }
}