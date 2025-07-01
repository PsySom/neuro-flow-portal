
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sun, Sunset, Moon, Clock } from 'lucide-react';
import { DiarySession } from './types';

interface DiaryHeaderProps {
  currentSession: DiarySession;
}

const DiaryHeader: React.FC<DiaryHeaderProps> = ({ currentSession }) => {
  const getTimeIcon = (type: string) => {
    switch (type) {
      case 'morning': return <Sun className="w-4 h-4" />;
      case 'midday': return <Sunset className="w-4 h-4" />;
      case 'evening': return <Moon className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getSessionTitle = (type: string) => {
    switch (type) {
      case 'morning': return 'Утренний дневник';
      case 'midday': return 'Дневной дневник';
      case 'evening': return 'Вечерний дневник';
      default: return 'Дневник';
    }
  };

  return (
    <CardHeader className="flex-shrink-0 pb-3">
      <CardTitle className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getTimeIcon(currentSession.type)}
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            {getSessionTitle(currentSession.type)}
          </span>
        </div>
        <Badge variant="outline" className="animate-pulse">
          {currentSession.currentStep} / {currentSession.totalSteps}
        </Badge>
      </CardTitle>
    </CardHeader>
  );
};

export default DiaryHeader;
