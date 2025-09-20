import { useState, useEffect, useCallback } from 'react';
import { AIDiaryService } from '@/services/ai-diary.service';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export const useAIDiaryChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { toast } = useToast();

  // Проверяем активную сессию при монтировании
  useEffect(() => {
    const checkExistingSession = async () => {
      const existingSessionId = AIDiaryService.getCurrentSessionId();
      if (existingSessionId) {
        setSessionId(existingSessionId);
        // Добавляем приветственное сообщение для продолжения сессии
        const welcomeMessage: Message = {
          id: `welcome_${Date.now()}`,
          type: 'ai',
          content: 'Привет! Продолжаем наш разговор. О чем хотели бы поговорить?',
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);
      } else {
        // Добавляем начальное приветствие для новой сессии
        const initialMessage: Message = {
          id: `initial_${Date.now()}`,
          type: 'ai',
          content: 'Привет! Я ваш AI-помощник для психологического благополучия. Расскажите, как дела? О чем хотели бы поговорить?',
          timestamp: new Date()
        };
        setMessages([initialMessage]);
      }
    };

    checkExistingSession();
  }, []);

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

  const isUserAuthenticated = useCallback(async () => {
    return await AIDiaryService.isUserAuthenticated();
  }, []);

  return {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    sessionId,
    sendMessage,
    startNewSession,
    isUserAuthenticated
  };
};