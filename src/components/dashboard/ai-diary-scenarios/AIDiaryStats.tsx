import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, MessageSquare, BarChart3, Hash, TrendingUp, Timer } from 'lucide-react';
import { SessionStats, TopicFrequency } from '@/services/ai-diary-analytics.service';
import { AIDiaryAnalyticsService } from '@/services/ai-diary-analytics.service';

interface AIDiaryStatsProps {
  globalStats: SessionStats | null;
  currentSessionStats: Partial<SessionStats>;
  topTopics: TopicFrequency[];
  isLoading: boolean;
  sessionId: string | null;
}

const AIDiaryStats: React.FC<AIDiaryStatsProps> = ({
  globalStats,
  currentSessionStats,
  topTopics,
  isLoading,
  sessionId
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-3">
            <CardContent className="p-0">
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-6 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 mb-4">
      {/* Текущая сессия */}
      {sessionId && (
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <CardContent className="p-0">
              <div className="flex items-center space-x-2">
                <Timer className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Длительность</p>
                  <p className="text-sm font-bold text-blue-800 dark:text-blue-200">
                    {currentSessionStats.currentSessionDuration !== undefined 
                      ? AIDiaryAnalyticsService.formatDuration(currentSessionStats.currentSessionDuration)
                      : '—'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="p-3 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
            <CardContent className="p-0">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-green-600 dark:text-green-400" />
                <div>
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium">Сообщений</p>
                  <p className="text-sm font-bold text-green-800 dark:text-green-200">
                    {currentSessionStats.currentSessionMessages || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
            <CardContent className="p-0">
              <div className="flex items-center space-x-2">
                <Hash className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <div>
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Ср. длина</p>
                  <p className="text-sm font-bold text-purple-800 dark:text-purple-200">
                    {currentSessionStats.averageUserMessageLength 
                      ? `${currentSessionStats.averageUserMessageLength} симв.`
                      : '—'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Общая статистика */}
      {globalStats && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Card className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
            <CardContent className="p-0">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <div>
                  <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">Всего сессий</p>
                  <p className="text-sm font-bold text-orange-800 dark:text-orange-200">
                    {globalStats.totalSessions}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="p-3 bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950 dark:to-teal-900 border-teal-200 dark:border-teal-800">
            <CardContent className="p-0">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <div>
                  <p className="text-xs text-teal-600 dark:text-teal-400 font-medium">Ср. сообщений</p>
                  <p className="text-sm font-bold text-teal-800 dark:text-teal-200">
                    {globalStats.averageMessagesPerSession}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Топ темы */}
          <Card className="p-3 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 border-indigo-200 dark:border-indigo-800">
            <CardContent className="p-0">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Топ темы</p>
              </div>
              <div className="flex flex-wrap gap-1">
                {topTopics.length > 0 ? (
                  topTopics.map((topic, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="text-xs py-0 px-1 bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-300"
                    >
                      {topic.topic} ({topic.count})
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-indigo-400">Пока нет данных</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AIDiaryStats;