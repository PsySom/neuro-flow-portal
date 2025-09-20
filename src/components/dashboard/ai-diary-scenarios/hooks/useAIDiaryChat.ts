import { useState, useEffect, useCallback } from 'react';
import { AIDiaryService } from '@/services/ai-diary.service';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  session_id?: string;
}

export const useAIDiaryChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { toast } = useToast();

  // Загружаем историю сессии при монтировании
  useEffect(() => {
    const loadSessionHistory = async () => {
      const existingSessionId = AIDiaryService.getCurrentSessionId();
      
      if (existingSessionId) {
        setIsLoadingHistory(true);
        setSessionId(existingSessionId);
        
        try {
          // Загружаем историю из Supabase
          const history = await AIDiaryService.loadSessionHistory(existingSessionId);
          
          if (history.length > 0) {
            // Преобразуем историю в формат Message
            const historyMessages: Message[] = history.map(msg => ({
              id: msg.id,
              type: msg.type,
              content: msg.content,
              timestamp: msg.timestamp,
              session_id: msg.session_id
            }));
            
            setMessages(historyMessages);
          } else {
            // Если истории нет, добавляем приветственное сообщение для продолжения сессии
            const welcomeMessage: Message = {
              id: `welcome_${Date.now()}`,
              type: 'ai',
              content: 'Привет! Продолжаем наш разговор. О чем хотели бы поговорить?',
              timestamp: new Date(),
              session_id: existingSessionId
            };
            setMessages([welcomeMessage]);
          }
        } catch (error) {
          console.error('Ошибка загрузки истории сессии:', error);
          toast({
            title: "Ошибка",
            description: "Не удалось загрузить историю сессии",
            variant: "destructive",
          });
          
          // Fallback: показываем приветственное сообщение
          const welcomeMessage: Message = {
            id: `welcome_${Date.now()}`,
            type: 'ai',
            content: 'Привет! Продолжаем наш разговор. О чем хотели бы поговорить?',
            timestamp: new Date(),
            session_id: existingSessionId
          };
          setMessages([welcomeMessage]);
        } finally {
          setIsLoadingHistory(false);
        }
      } else {
        // Новая сессия - показываем начальное приветствие
        const initialMessage: Message = {
          id: `initial_${Date.now()}`,
          type: 'ai',
          content: 'Привет! Я ваш AI-помощник для психологического благополучия. Расскажите, как дела? О чем хотели бы поговорить?',
          timestamp: new Date()
        };
        setMessages([initialMessage]);
      }
    };

    loadSessionHistory();
  }, [toast]);

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim() || isLoading) return;

    const messageText = message.trim();
    const userMessage: Message = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };

    // Добавляем сообщение пользователя
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Отправляем сообщение через AI Diary Service
      const response = await AIDiaryService.sendMessage(messageText);
      
      if (response.status === 'success') {
        // Получаем session_id (новый или текущий)
        const currentSessionId = response.session_id || sessionId;
        
        // Обновляем session_id если получили новый
        if (response.session_id && response.session_id !== sessionId) {
          setSessionId(response.session_id);
        }

        const aiMessage: Message = {
          id: `ai_${Date.now()}`,
          type: 'ai',
          content: response.ai_response,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiMessage]);

        // Сохраняем оба сообщения в Supabase (пользователя и AI)
        if (currentSessionId) {
          try {
            await Promise.all([
              AIDiaryService.saveMessageToSupabase(currentSessionId, 'user', messageText),
              AIDiaryService.saveMessageToSupabase(currentSessionId, 'ai', response.ai_response)
            ]);
          } catch (saveError) {
            console.error('Ошибка сохранения сообщений в Supabase:', saveError);
            // Не показываем пользователю ошибку сохранения, чтобы не прерывать разговор
          }
        }

      } else {
        // Показываем ошибку через toast
        toast({
          title: "Ошибка",
          description: response.error || "Произошла ошибка при отправке сообщения",
          variant: "destructive",
        });

        // Добавляем сообщение об ошибке в чат
        const errorMessage: Message = {
          id: `error_${Date.now()}`,
          type: 'ai',
          content: response.ai_response,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Ошибка при отправке сообщения:', error);
      
      toast({
        title: "Ошибка сети",
        description: "Не удалось отправить сообщение. Проверьте подключение к интернету.",
        variant: "destructive",
      });

      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        type: 'ai',
        content: 'Извините, произошла ошибка при обработке вашего сообщения. Попробуйте еще раз.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, sessionId, toast]);

  const startNewSession = useCallback(() => {
    // Очищаем сессию в сервисе
    AIDiaryService.startNewSession();
    setSessionId(null);
    
    // Очищаем сообщения и добавляем новое приветствие
    const welcomeMessage: Message = {
      id: `new_session_${Date.now()}`,
      type: 'ai',
      content: 'Начинаем новый разговор! Я ваш AI-помощник для психологического благополучия. О чем хотели бы поговорить?',
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
    setInputMessage('');
    setIsLoading(false);

    toast({
      title: "Новая сессия",
      description: "Начинаем новый разговор",
    });
  }, [toast]);

  const endSession = useCallback(async () => {
    try {
      const success = await AIDiaryService.endSession();
      
      if (success) {
        setSessionId(null);
        
        // Очищаем сообщения и добавляем новое приветствие
        const welcomeMessage: Message = {
          id: `session_ended_${Date.now()}`,
          type: 'ai',
          content: 'Сессия завершена. Спасибо за разговор! Начнем новый диалог, когда будете готовы.',
          timestamp: new Date()
        };
        
        setMessages([welcomeMessage]);
        setInputMessage('');
        setIsLoading(false);

        toast({
          title: "Сессия завершена",
          description: "Диалог сохранен в вашей истории",
        });
      } else {
        toast({
          title: "Ошибка",
          description: "Не удалось завершить сессию",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Ошибка завершения сессии:', error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при завершении сессии",
        variant: "destructive",
      });
    }
  }, [toast]);

  const isUserAuthenticated = useCallback(async () => {
    return await AIDiaryService.isUserAuthenticated();
  }, []);

  return {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    isLoadingHistory,
    sessionId,
    sendMessage,
    startNewSession,
    endSession,
    isUserAuthenticated
  };
};