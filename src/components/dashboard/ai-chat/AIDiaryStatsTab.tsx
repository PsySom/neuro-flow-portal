import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useAIDiaryChat } from '../ai-diary-scenarios/hooks/useAIDiaryChat';
import { useAIDiaryAnalytics } from '../ai-diary-scenarios/hooks/useAIDiaryAnalytics';
import FreeChatHeader from '../ai-diary-scenarios/FreeChatHeader';
import AIDiaryStats from '../ai-diary-scenarios/AIDiaryStats';

const AIDiaryStatsTab: React.FC = () => {
  const {
    messages,
    isLoadingHistory,
    sessionId,
    startNewSession,
    endSession,
    isUserAuthenticated
  } = useAIDiaryChat();

  const analyticsData = useAIDiaryAnalytics({
    sessionId,
    messages,
    isLoadingHistory
  });

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
            {isAuthenticated === null ? 'Загрузка...' : 'Загружаем данные статистики...'}
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
              Для просмотра статистики AI дневника необходимо войти в систему. 
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

      {/* Основная область статистики */}
      <div className="flex-1 p-6 overflow-y-auto">
        <AIDiaryStats
          globalStats={analyticsData.globalStats}
          currentSessionStats={analyticsData.currentSessionStats}
          topTopics={analyticsData.topTopics}
          isLoading={analyticsData.isLoadingStats}
          sessionId={sessionId}
        />
        
        {!sessionId && (
          <div className="mt-6 text-center text-muted-foreground">
            <p className="text-lg mb-2">Здесь будет отображаться статистика ваших сессий AI дневника</p>
            <p className="text-sm">
              Начните новую беседу во вкладке "Свободное общение", чтобы увидеть данные
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AIDiaryStatsTab;