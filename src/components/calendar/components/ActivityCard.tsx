
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Info, Edit, Star, Trash2 } from 'lucide-react';
import { ActivityLayout } from '../types';

interface ActivityCardProps {
  layout: ActivityLayout;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ layout }) => {
  const { activity, top, height, left, width } = layout;

  // Пропускаем активности, которые выходят за пределы дня
  if (top < 0 || top > 1440) return null;

  return (
    <div
      className={`absolute ${activity.color} rounded-lg p-2 border border-gray-200 shadow-sm`}
      style={{ 
        top: `${Math.max(0, top)}px`, 
        height: `${Math.max(60, Math.min(height, 1440 - Math.max(0, top)))}px`,
        left: `${left}%`,
        width: `${width}%`,
        zIndex: 1
      }}
    >
      {/* Верхняя строка с чекбоксом, названием и кнопками */}
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-start space-x-1 flex-1 min-w-0">
          <Checkbox 
            checked={activity.completed}
            className="w-3 h-3 rounded-sm mt-1 flex-shrink-0"
          />
          <span className="font-medium text-xs truncate">{activity.name}</span>
        </div>
        
        {/* Кнопки в верхнем правом углу горизонтально */}
        <div className="flex space-x-1 ml-2">
          <Button size="icon" variant="ghost" className="h-4 w-4">
            <Info className="w-2 h-2" />
          </Button>
          <Button size="icon" variant="ghost" className="h-4 w-4">
            <Edit className="w-2 h-2" />
          </Button>
          <Button size="icon" variant="ghost" className="h-4 w-4">
            <Trash2 className="w-2 h-2 text-red-500" />
          </Button>
        </div>
      </div>

      {/* Вторая строка с временем и звездами важности */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center space-x-1 text-xs text-gray-600">
          <span className="font-medium text-xs">{activity.startTime}-{activity.endTime}</span>
          <div className="flex items-center">
            {Array.from({ length: Math.min(activity.importance, 3) }, (_, i) => (
              <Star key={i} className="w-2 h-2 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
        </div>

        {/* Эмоджи и тип активности справа */}
        <div className="flex items-center space-x-1">
          <span className="text-sm">{activity.emoji}</span>
          {activity.type === 'восстановление' && activity.needEmoji && (
            <span className="text-xs">{activity.needEmoji}</span>
          )}
          <Badge variant="secondary" className="text-xs px-1 py-0">
            {activity.type.slice(0, 4)}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
