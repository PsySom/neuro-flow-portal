import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

interface MessageSaveResult {
  success: boolean;
  error?: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  session_id?: string;
}

export class AIDiaryService {
  private static readonly SESSION_STORAGE_KEY = 'ai_diary_session_id';
  private static realtimeChannel: RealtimeChannel | null = null;

  /**
   * Получить текущую сессию из localStorage или создать новую
   */
  private static getCurrentSession(): string {
    let sessionId = localStorage.getItem(this.SESSION_STORAGE_KEY);
    
    if (!sessionId) {
      sessionId = this.generateSessionId();
      localStorage.setItem(this.SESSION_STORAGE_KEY, sessionId);
    }
    
    return sessionId;
  }

  /**
   * Генерировать новый ID сессии
   */
  private static generateSessionId(): string {
    return `ai_diary_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Получить ID текущего пользователя из Supabase Auth
   */
  static async getCurrentUserId(): Promise<string | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Ошибка получения пользователя:', error);
        return null;
      }
      
      return user?.id || null;
    } catch (error) {
      console.error('Ошибка при получении пользователя:', error);
      return null;
    }
  }

  /**
   * Отправить сообщение в AI дневник (сохраняет в Supabase, AI ответ придет через Realtime)
   */
  static async sendMessage(message: string): Promise<MessageSaveResult> {
    try {
      // Получаем ID пользователя
      const userId = await this.getCurrentUserId();
      if (!userId) {
        return {
          success: false,
          error: 'Необходимо войти в систему для использования AI дневника.'
        };
      }

      // Получаем или создаем сессию
      const sessionId = this.getCurrentSession();

      // Сохраняем сообщение пользователя в Supabase
      const saveResult = await this.saveMessageToSupabase(sessionId, 'user', message);
      
      if (!saveResult) {
        return {
          success: false,
          error: 'Ошибка при сохранении сообщения'
        };
      }

      return {
        success: true
      };

    } catch (error) {
      console.error('Ошибка при отправке сообщения в AI дневник:', error);
      
      return {
        success: false,
        error: 'Произошла ошибка при отправке сообщения'
      };
    }
  }

  /**
   * Начать новую сессию (очистить текущую)
   */
  static startNewSession(): void {
    localStorage.removeItem(this.SESSION_STORAGE_KEY);
  }

  /**
   * Получить ID текущей сессии
   */
  static getCurrentSessionId(): string | null {
    return localStorage.getItem(this.SESSION_STORAGE_KEY);
  }

  /**
   * Проверить, авторизован ли пользователь
   */
  static async isUserAuthenticated(): Promise<boolean> {
    const userId = await this.getCurrentUserId();
    return userId !== null;
  }

  /**
   * Сохранить сообщение в Supabase
   */
  static async saveMessageToSupabase(
    sessionId: string,
    messageType: 'user' | 'ai',
    content: string
  ): Promise<boolean> {
    try {
      const userId = await this.getCurrentUserId();
      if (!userId) {
        console.error('Пользователь не авторизован для сохранения сообщения');
        return false;
      }

      // Сначала убеждаемся, что сессия существует в таблице ai_diary_sessions
      await this.ensureSessionExists(sessionId, userId);

      // Сохраняем сообщение
      const { error } = await supabase
        .from('ai_diary_messages')
        .insert({
          user_id: userId,
          session_id: sessionId,
          message_type: messageType,
          content: content,
          metadata: {
            timestamp: new Date().toISOString(),
            source: 'free_chat'
          }
        });

      if (error) {
        console.error('Ошибка сохранения сообщения в Supabase:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Ошибка при сохранении сообщения:', error);
      return false;
    }
  }

  /**
   * Убедиться, что сессия существует в таблице ai_diary_sessions
   */
  private static async ensureSessionExists(sessionId: string, userId: string): Promise<void> {
    try {
      // Проверяем, существует ли сессия
      const { data: existingSession } = await supabase
        .from('ai_diary_sessions')
        .select('session_id')
        .eq('session_id', sessionId)
        .single();

      // Если сессия не существует, создаем её
      if (!existingSession) {
        const { error } = await supabase
          .from('ai_diary_sessions')
          .insert({
            user_id: userId,
            session_id: sessionId,
            started_at: new Date().toISOString(),
            insights: {},
            emotional_state: {}
          });

        if (error) {
          console.error('Ошибка создания сессии в Supabase:', error);
        }
      }
    } catch (error) {
      console.error('Ошибка при проверке существования сессии:', error);
    }
  }

  /**
   * Загрузить историю сессии из Supabase
   */
  static async loadSessionHistory(sessionId: string): Promise<ChatMessage[]> {
    try {
      const userId = await this.getCurrentUserId();
      if (!userId) {
        console.error('Пользователь не авторизован для загрузки истории');
        return [];
      }

      const { data, error } = await supabase
        .from('ai_diary_messages')
        .select('*')
        .eq('session_id', sessionId)
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Ошибка загрузки истории сессии:', error);
        return [];
      }

      // Преобразуем данные в формат ChatMessage
      return (data || []).map((msg: any) => ({
        id: msg.id,
        type: msg.message_type as 'user' | 'ai',
        content: msg.content,
        timestamp: new Date(msg.created_at),
        session_id: msg.session_id
      }));

    } catch (error) {
      console.error('Ошибка при загрузке истории сессии:', error);
      return [];
    }
  }

  /**
   * Завершить текущую сессию
   */
  static async endSession(): Promise<boolean> {
    try {
      const sessionId = this.getCurrentSessionId();
      const userId = await this.getCurrentUserId();

      if (!sessionId || !userId) {
        console.warn('Нет активной сессии для завершения');
        return false;
      }

      // Обновляем сессию в Supabase, устанавливая время окончания
      const { error } = await supabase
        .from('ai_diary_sessions')
        .update({
          ended_at: new Date().toISOString()
        })
        .eq('session_id', sessionId)
        .eq('user_id', userId);

      if (error) {
        console.error('Ошибка завершения сессии в Supabase:', error);
        return false;
      }

      // Очищаем localStorage
      localStorage.removeItem(this.SESSION_STORAGE_KEY);
      
      return true;
    } catch (error) {
      console.error('Ошибка при завершении сессии:', error);
      return false;
    }
  }

  /**
   * Подписаться на новые AI сообщения через Supabase Realtime
   */
  static subscribeToAIMessages(
    sessionId: string,
    onNewMessage: (message: ChatMessage) => void
  ): RealtimeChannel {
    // Отписываемся от предыдущего канала если есть
    if (this.realtimeChannel) {
      supabase.removeChannel(this.realtimeChannel);
    }

    this.realtimeChannel = supabase
      .channel('ai-diary-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ai_diary_messages',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          const newMessage = payload.new as any;
          
          // Обрабатываем только AI сообщения
          if (newMessage.message_type === 'ai') {
            const chatMessage: ChatMessage = {
              id: newMessage.id,
              type: 'ai',
              content: newMessage.content,
              timestamp: new Date(newMessage.created_at),
              session_id: newMessage.session_id,
            };
            
            onNewMessage(chatMessage);
          }
        }
      )
      .subscribe();

    return this.realtimeChannel;
  }

  /**
   * Отписаться от Realtime уведомлений
   */
  static unsubscribeFromMessages(): void {
    if (this.realtimeChannel) {
      supabase.removeChannel(this.realtimeChannel);
      this.realtimeChannel = null;
    }
  }

  /**
   * Получить список активных сессий пользователя
   */
  static async getUserActiveSessions(): Promise<string[]> {
    try {
      const userId = await this.getCurrentUserId();
      if (!userId) {
        return [];
      }

      const { data, error } = await supabase
        .from('ai_diary_sessions')
        .select('session_id')
        .eq('user_id', userId)
        .is('ended_at', null)
        .order('started_at', { ascending: false });

      if (error) {
        console.error('Ошибка получения активных сессий:', error);
        return [];
      }

      return (data || []).map(session => session.session_id);
    } catch (error) {
      console.error('Ошибка при получении активных сессий:', error);
      return [];
    }
  }
}

export default AIDiaryService;