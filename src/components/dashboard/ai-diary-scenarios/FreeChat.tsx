import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useAIDiaryChat } from './hooks/useAIDiaryChat';
import FreeChatHeader from './FreeChatHeader';
import FreeChatMessages from './FreeChatMessages';
import FreeChatInput from './FreeChatInput';

const FreeChat: React.FC = () => {
  const {
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
    isUserAuthenticated
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
      <Card className="h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 animate-fade-in flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {isAuthenticated === null ? 'Загрузка...' : 'Загружаем историю сессии...'}
          </p>
        </div>
      </Card>
    );
  }

  // Если не авторизован
  if (!isAuthenticated) {
    return (
      <Card className="h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 animate-fade-in flex items-center justify-center">
        <div className="max-w-md mx-auto p-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Для использования AI дневника необходимо войти в систему. 
              Пожалуйста, авторизуйтесь или зарегистрируйтесь.
            </AlertDescription>
          </Alert>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 animate-fade-in flex flex-col overflow-hidden">
      <div className="flex-shrink-0 border-b border-border">
        <FreeChatHeader 
          sessionId={sessionId}
          messageCount={messages.length}
          onNewSession={startNewSession}
          onEndSession={endSession}
        />
      </div>
      
      <div className="flex-1 min-h-0 overflow-hidden">
        <FreeChatMessages 
          messages={messages}
          isLoading={isLoading}
          isAITyping={isAITyping}
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
    </Card>
  );
};

export default FreeChat;