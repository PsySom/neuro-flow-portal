
import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useAIDiaryChat } from '../ai-diary-scenarios/hooks/useAIDiaryChat';
import FreeChatMessages from '../ai-diary-scenarios/FreeChatMessages';
import FreeChatInput from '../ai-diary-scenarios/FreeChatInput';

const FreeChat = () => {
  const {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    isLoadingHistory,
    isAITyping,
    inputRef,
    sendMessage,
    isUserAuthenticated,
    handleSuggestionClick
  } = useAIDiaryChat();

  const [isAuthenticated, setIsAuthenticated] = useState<null | boolean>(null);

  // Проверяем аутентификацию при монтировании
  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isUserAuthenticated();
      setIsAuthenticated(authenticated);
    };
    checkAuth();
  }, [isUserAuthenticated]);

  // Если еще проверяем аутентификацию или загружаем историю
  if (isAuthenticated === null || isLoadingHistory) {
    return (
      <div className="h-full bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {isAuthenticated === null ? 'Загрузка...' : 'Загружаем историю сессии...'}
          </p>
        </div>
      </div>
    );
  }

  // Если не авторизован
  if (!isAuthenticated) {
    return (
      <div className="h-full bg-background flex items-center justify-center">
        <div className="max-w-md mx-auto p-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Для использования AI дневника необходимо войти в систему. 
              Пожалуйста, авторизуйтесь или зарегистрируйтесь.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      <div className="flex-1 min-h-0 overflow-hidden">
        <FreeChatMessages 
          messages={messages}
          isLoading={isLoading}
          isAITyping={isAITyping}
          onSuggestionClick={handleSuggestionClick}
        />
      </div>
      
      <div className="flex-shrink-0">
        <FreeChatInput
          ref={inputRef}
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          onSendMessage={sendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default FreeChat;