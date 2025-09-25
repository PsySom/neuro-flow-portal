import { useState, useEffect, useCallback, useRef } from 'react';
import AIDiaryService from '@/services/ai-diary.service';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  session_id?: string;
  isTyping?: boolean;
  suggestions?: string[];
}

export const useAIDiaryChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isAITyping, setIsAITyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const realtimeChannelRef = useRef<RealtimeChannel | null>(null);
  const { toast } = useToast();

  // Функция для эффекта печати
  const typeMessage = useCallback((message: Message, fullText: string) => {
    let currentIndex = 0;
    const typingSpeed = 30; // миллисекунды между символами

    const typeNextChar = () => {
      if (currentIndex <= fullText.length) {
        const currentText = fullText.substring(0, currentIndex);
        setMessages(prev => prev.map(msg => 
          msg.id === message.id 
            ? { ...msg, content: currentText, isTyping: currentIndex < fullText.length }
            : msg
        ));
        currentIndex++;
        
        if (currentIndex <= fullText.length) {
          setTimeout(typeNextChar, typingSpeed);
        }
      }
    };

    typeNextChar();
  }, []);

  // Функция для парсинга suggestions из AI ответа
  const parseSuggestions = useCallback((content: string, metadata?: any): string[] => {
    const suggestions: string[] = [];
    
    // Проверяем metadata на наличие suggestions
    if (metadata?.suggestions && Array.isArray(metadata.suggestions)) {
      suggestions.push(...metadata.suggestions);
    }
    
    // Парсим suggestions из текста (формат: [suggestion1, suggestion2, suggestion3])
    const suggestionMatch = content.match(/\[([^\]]+)\]/g);
    if (suggestionMatch) {
      suggestionMatch.forEach(match => {
        const cleanMatch = match.slice(1, -1); // убираем скобки
        const parsedSuggestions = cleanMatch.split(',').map(s => s.trim());
        suggestions.push(...parsedSuggestions);
      });
    }
    
    // Парсим suggestions из текста (формат: "Варианты: вариант1 | вариант2 | вариант3")
    const variantMatch = content.match(/(?:Варианты|Быстрые ответы|Suggestions?):\s*(.+?)(?:\n|$)/i);
    if (variantMatch) {
      const variants = variantMatch[1].split(/\s*\|\s*/).map(s => s.trim());
      suggestions.push(...variants);
    }
    
    // Убираем дубликаты и пустые значения, ограничиваем до 4 suggestions
    return [...new Set(suggestions)]
      .filter(s => s.length > 0 && s.length < 100)
      .slice(0, 4);
  }, []);

  // Автофокус на поле ввода
  const focusInput = useCallback(() => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  }, []);

  // Обработка новых AI сообщений через Realtime
  const handleNewAIMessage = useCallback((aiMessageData: any) => {
    console.log('Получено новое AI сообщение через Realtime:', aiMessageData);
    
    setIsAITyping(false);
    setIsLoading(false);
    
    // Парсим suggestions из AI ответа
    const suggestions = parseSuggestions(aiMessageData.content, aiMessageData.metadata);
    
    // Убираем placeholder "AI печатает..." если он есть
    setMessages(prev => {
      const filteredMessages = prev.filter(msg => msg.id !== 'ai-typing-placeholder');
      
      // Создаем новое AI сообщение
      const aiMessage: Message = {
        id: aiMessageData.id || `ai_${Date.now()}`,
        type: 'ai',
        content: '',
        timestamp: new Date(aiMessageData.created_at || Date.now()),
        session_id: aiMessageData.session_id,
        isTyping: true,
        suggestions: suggestions.length > 0 ? suggestions : undefined
      };
      
      const newMessages = [...filteredMessages, aiMessage];
      
      // Запускаем эффект печати для длинных сообщений (>50 символов)
      if (aiMessageData.content.length > 50) {
        setTimeout(() => typeMessage(aiMessage, aiMessageData.content), 100);
      } else {
        // Для коротких сообщений показываем сразу
        setTimeout(() => {
          setMessages(prev => prev.map(msg => 
            msg.id === aiMessage.id 
              ? { ...msg, content: aiMessageData.content, isTyping: false }
              : msg
          ));
        }, 500);
      }
      
      return newMessages;
    });
  }, [typeMessage, parseSuggestions]);

  // Загружаем историю сессии и настраиваем Realtime подписку
  useEffect(() => {
    const loadSessionHistoryAndSetupRealtime = async () => {
      const existingSessionId = AIDiaryService.getCurrentSessionId();
      
      if (existingSessionId) {
        setIsLoadingHistory(true);
        setSessionId(existingSessionId);
        
        try {
          // Загружаем историю из Supabase
          const history = await AIDiaryService.loadSessionHistory(existingSessionId);
          
          if (history.length > 0) {
            // Преобразуем историю в формат Message
            const historyMessages: Message[] = history.map((msg: any) => ({
              id: msg.id,
              type: msg.message_type as 'user' | 'ai',
              content: msg.content,
              timestamp: new Date(msg.created_at),
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
              session_id: existingSessionId,
              suggestions: ['Как дела?', 'Расскажу о своем дне', 'Поговорим о настроении', 'Нужна поддержка']
            };
            setMessages([welcomeMessage]);
          }
          
          // Настраиваем Realtime подписку для существующей сессии
          realtimeChannelRef.current = AIDiaryService.subscribeToMessages(
            existingSessionId,
            handleNewAIMessage
          );
          
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
          timestamp: new Date(),
          suggestions: ['Как дела?', 'Расскажу о своем дне', 'Хочу поговорить о стрессе', 'Нужен совет']
        };
        setMessages([initialMessage]);
      }
    };

    loadSessionHistoryAndSetupRealtime();
    
    // Очистка при размонтировании
    return () => {
      if (realtimeChannelRef.current) {
        AIDiaryService.unsubscribe();
        realtimeChannelRef.current = null;
      }
    };
  }, [toast, handleNewAIMessage]);

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
    setIsAITyping(true);

    // Автофокус на поле ввода
    focusInput();

    try {
      // Получаем или создаем sessionId
      let currentSessionId = AIDiaryService.getCurrentSessionId();
      
      if (!currentSessionId) {
        currentSessionId = await AIDiaryService.startNewSession();
        setSessionId(currentSessionId);
      }

      // Отправляем сообщение (сохраняем в Supabase, trigger вызовет n8n)
      const result = await AIDiaryService.sendMessage(messageText, currentSessionId);
      
      if (result.success) {
        if (!sessionId) {
          setSessionId(currentSessionId);
          
          // Настраиваем Realtime подписку для новой сессии
          realtimeChannelRef.current = AIDiaryService.subscribeToMessages(
            currentSessionId,
            handleNewAIMessage
          );
        }
        
        // Добавляем placeholder "AI печатает..." пока ждем ответ через Realtime
        const typingPlaceholder: Message = {
          id: 'ai-typing-placeholder',
          type: 'ai',
          content: 'AI печатает...',
          timestamp: new Date(),
          isTyping: true
        };
        setMessages(prev => [...prev, typingPlaceholder]);
        
        // AI ответ придет через Realtime подписку автоматически и заменит placeholder
        
      } else {
        setIsAITyping(false);
        setIsLoading(false);
        
        // Убираем placeholder если ошибка
        setMessages(prev => prev.filter(msg => msg.id !== 'ai-typing-placeholder'));
        
        // Показываем ошибку через toast
        toast({
          title: "Ошибка",
          description: result.error || "Произошла ошибка при отправке сообщения",
          variant: "destructive",
        });

        // Добавляем сообщение об ошибке в чат
        const errorMessage: Message = {
          id: `error_${Date.now()}`,
          type: 'ai',
          content: 'Извините, произошла ошибка при отправке вашего сообщения. Попробуйте еще раз.',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      setIsAITyping(false);
      setIsLoading(false);
      console.error('Ошибка при отправке сообщения:', error);
      
      // Убираем placeholder если ошибка
      setMessages(prev => prev.filter(msg => msg.id !== 'ai-typing-placeholder'));
      
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
    }
  }, [isLoading, sessionId, toast, focusInput, handleNewAIMessage]);

  const startNewSession = useCallback(async () => {
    // Отписываемся от текущей Realtime подписки
    if (realtimeChannelRef.current) {
      AIDiaryService.unsubscribe();
      realtimeChannelRef.current = null;
    }
    
    // Очищаем сессию в сервисе и создаем новую
    const newSessionId = await AIDiaryService.startNewSession();
    setSessionId(newSessionId);
    
    // Очищаем сообщения и добавляем новое приветствие
    const welcomeMessage: Message = {
      id: `new_session_${Date.now()}`,
      type: 'ai',
      content: 'Начинаем новый разговор! Я ваш AI-помощник для психологического благополучия. Что у вас на душе? О чем хотели бы поговорить сегодня?',
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
    setInputMessage('');
    setIsLoading(false);
    setIsAITyping(false);

    // Автофокус на поле ввода
    focusInput();

    toast({
      title: "Новая сессия",
      description: "Начинаем новый разговор",
    });
  }, [toast, focusInput]);

  const endSession = useCallback(async () => {
    if (!sessionId) return;

    try {
      // Отписываемся от Realtime подписки
      if (realtimeChannelRef.current) {
        AIDiaryService.unsubscribe();
        realtimeChannelRef.current = null;
      }
      
      await AIDiaryService.endSession(sessionId);
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
    } catch (error) {
      console.error('Ошибка завершения сессии:', error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при завершении сессии",
        variant: "destructive",
      });
    }
  }, [sessionId, toast]);

  const isUserAuthenticated = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return !!user;
  }, []);

  // Обработка клика по suggestion
  const handleSuggestionClick = useCallback((suggestion: string) => {
    setInputMessage(suggestion);
    // Автоматически отправляем suggestion как сообщение
    setTimeout(() => {
      if (suggestion.trim()) {
        sendMessage(suggestion);
      }
    }, 100);
  }, [sendMessage]);

  return {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    isLoadingHistory,
    isAITyping,
    sessionId,
    inputRef,
    sendMessage,
    startNewSession,
    endSession,
    isUserAuthenticated,
    handleSuggestionClick
  };
};