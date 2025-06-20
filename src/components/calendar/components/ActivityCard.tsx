
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Info, Edit, Star, Trash2 } from 'lucide-react';
import { ActivityLayout } from '../types';
import ActivityDetailsDialog from './ActivityDetailsDialog';

interface ActivityCardProps {
  layout: ActivityLayout;
  onToggleComplete?: (activityId: number) => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ layout, onToggleComplete }) => {
  const { activity, top, height, left, width } = layout;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    // Предотвращаем открытие диалога при клике на чекбокс или кнопки
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('[role="checkbox"]')) {
      return;
    }
    setIsDialogOpen(true);
  };

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDialogOpen(true);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDialogOpen(true);
  };

  const handleCheckboxToggle = () => {
    if (onToggleComplete) {
      onToggleComplete(activity.id);
    }
  };

  // Функция для получения отображаемого типа активности
  const getDisplayType = (type: string) => {
    switch (type) {
      case 'восстановление': return 'восстанавливающая';
      case 'нейтральная': return 'нейтральная';
      case 'смешанная': return 'смешанная';
      case 'задача': return 'истощающая';
      default: return type;
    }
  };

  return (
    <>
      <div
        className={`absolute ${activity.color} rounded-lg p-2 border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow overflow-hidden`}
        style={{ 
          top: `${top}px`, 
          height: `${height}px`,
          left: `${left}%`,
          width: `${width}%`,
          zIndex: 1,
          minHeight: '45px'
        }}
        onClick={handleCardClick}
      >
        {/* Верхняя строка с чекбоксом, названием и кнопками */}
        <div className="flex items-start justify-between mb-1">
          <div className="flex items-start space-x-1 flex-1 min-w-0">
            <Checkbox 
              checked={activity.completed}
              onCheckedChange={handleCheckboxToggle}
              className="w-3 h-3 rounded-sm mt-1 flex-shrink-0 cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            />
            <span className="font-medium text-xs truncate leading-tight">{activity.name}</span>
          </div>
          
          {/* Кнопки в верхнем правом углу горизонтально */}
          <div className="flex space-x-1 ml-2 flex-shrink-0">
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-4 w-4"
              onClick={handleInfoClick}
            >
              <Info className="w-2 h-2" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-4 w-4"
              onClick={handleEditClick}
            >
              <Edit className="w-2 h-2" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-4 w-4"
              onClick={(e) => e.stopPropagation()}
            >
              <Trash2 className="w-2 h-2 text-red-500" />
            </Button>
          </div>
        </div>

        {/* Вторая строка с временем и звездами важности - только если есть место */}
        {height > 60 && (
          <div className="flex items-center justify-between mb-0.5">
            <span className="font-medium text-xs text-gray-600">{activity.startTime}-{activity.endTime}</span>
            <div className="flex items-center">
              {Array.from({ length: Math.min(activity.importance, 3) }, (_, i) => (
                <Star key={i} className="w-2 h-2 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>
        )}

        {/* Третья строка с типом активности и эмоджи - только если есть место */}
        {height > 80 && (
          <div className="flex items-center space-x-1">
            <Badge variant="secondary" className="text-xs px-1 py-0">
              {getDisplayType(activity.type)}
            </Badge>
            <span className="text-sm">{activity.emoji}</span>
            {activity.type === 'восстановление' && activity.needEmoji && (
              <span className="text-xs">{activity.needEmoji}</span>
            )}
          </div>
        )}
      </div>

      <ActivityDetailsDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        activity={activity}
      />
    </>
  );
};

export default ActivityCard;
