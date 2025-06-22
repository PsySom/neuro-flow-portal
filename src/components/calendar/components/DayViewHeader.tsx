
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

interface DayViewHeaderProps {
  visibleActivitiesCount: number;
  currentTimeString: string;
  onScrollToCurrentTime: () => void;
}

const DayViewHeader: React.FC<DayViewHeaderProps> = ({
  visibleActivitiesCount,
  currentTimeString,
  onScrollToCurrentTime
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold flex items-center space-x-2">
        <Clock className="w-5 h-5 text-emerald-600" />
        <span>Активности дня ({visibleActivitiesCount})</span>
      </h2>
      <div className="flex items-center space-x-2">
        <Badge variant="outline" className="bg-red-500 text-white">
          Сейчас: {currentTimeString}
        </Badge>
        <button
          onClick={onScrollToCurrentTime}
          className="px-3 py-1 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
        >
          К текущему времени
        </button>
      </div>
    </div>
  );
};

export default DayViewHeader;
