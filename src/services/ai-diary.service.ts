import { supabase } from '@/integrations/supabase/client';

interface AIDiaryRequest {
  session_id: string;
  user_id: string;
  message: string;
  metadata?: {
    timestamp: string;
    source: string;
  };
}

interface AIDiaryResponse {
  ai_response: string;
  session_id: string;
  status: 'success' | 'error';
  error?: string;
}

export class AIDiaryService {
  private static readonly WEBHOOK_URL = import.meta.env.VITE_AI_DIARY_WEBHOOK_URL || 'https://mentalbalans.com/webhook/ai-diary-message';
  private static readonly SESSION_STORAGE_KEY = 'ai_diary_session_id';

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
  private static async getCurrentUserId(): Promise<string | null> {
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
   * Отправить сообщение в AI дневник
   */
  static async sendMessage(message: string): Promise<AIDiaryResponse> {
    try {
      // Получаем ID пользователя
      const userId = await this.getCurrentUserId();
      if (!userId) {
        return {
          ai_response: 'Ошибка: необходимо войти в систему для использования AI дневника.',
          session_id: '',
          status: 'error',
          error: 'Пользователь не авторизован'
        };
      }

      // Получаем или создаем сессию
      const sessionId = this.getCurrentSession();

      // Подготавливаем данные для отправки
      const requestData: AIDiaryRequest = {
        session_id: sessionId,
        user_id: userId,
        message: message.trim(),
        metadata: {
          timestamp: new Date().toISOString(),
          source: 'free_chat'
        }
      };

      // Отправляем запрос на webhook
      const response = await fetch(this.WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: AIDiaryResponse = await response.json();

      // Проверяем формат ответа
      if (!data.ai_response) {
        throw new Error('Некорректный формат ответа от сервера');
      }

      return {
        ai_response: data.ai_response,
        session_id: data.session_id || sessionId,
        status: 'success'
      };

    } catch (error) {
      console.error('Ошибка при отправке сообщения в AI дневник:', error);
      
      let errorMessage = 'Произошла ошибка при обращении к AI дневнику.';
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Ошибка сети. Проверьте подключение к интернету.';
        } else if (error.message.includes('HTTP error')) {
          errorMessage = 'Сервер временно недоступен. Попробуйте позже.';
        } else {
          errorMessage = error.message;
        }
      }

      return {
        ai_response: errorMessage,
        session_id: '',
        status: 'error',
        error: errorMessage
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
}

export default AIDiaryService;