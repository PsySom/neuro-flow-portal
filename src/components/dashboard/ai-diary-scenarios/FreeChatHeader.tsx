import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, RotateCcw, Square } from 'lucide-react';

interface FreeChatHeaderProps {
  sessionId: string | null;
  onNewSession: () => void;
  onEndSession: () => void;
}

const FreeChatHeader: React.FC<FreeChatHeaderProps> = ({ sessionId, onNewSession, onEndSession }) => {
  return (
    <CardHeader className="flex-shrink-0 pb-3">
      <CardTitle className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5 text-primary" />
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            Свободное общение с AI
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {sessionId && (
            <Badge variant="outline" className="text-xs">
              Активная сессия
            </Badge>
          )}
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={onNewSession}
              className="flex items-center space-x-1 transition-all duration-200 hover:scale-105"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="text-xs hidden sm:inline">Новая сессия</span>
            </Button>
            {sessionId && (
              <Button
                variant="outline"
                size="sm"
                onClick={onEndSession}
                className="flex items-center space-x-1 transition-all duration-200 hover:scale-105 text-orange-600 hover:text-orange-700 border-orange-200 hover:border-orange-300"
              >
                <Square className="w-3 h-3" />
                <span className="text-xs hidden sm:inline">Завершить</span>
              </Button>
            )}
          </div>
        </div>
      </CardTitle>
    </CardHeader>
  );
};

export default FreeChatHeader;