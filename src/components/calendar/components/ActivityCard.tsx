
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Info, Edit, Star, Trash2 } from 'lucide-react';
import { ActivityLayout } from '../types';
import ActivityInfoPopover from './ActivityInfoPopover';

interface ActivityCardProps {
  layout: ActivityLayout;
  onToggleComplete?: (activityId: number) => void;
  onDelete?: (activityId: number) => void;
  onUpdate?: (activityId: number, updates: Partial<ActivityLayout['activity']>) => void;
  viewType?: 'dashboard' | 'day' | 'week';
}

const ActivityCard: React.FC<ActivityCardProps> = ({ 
  layout, 
  onToggleComplete, 
  onDelete, 
  onUpdate,
  viewType = 'day'
}) => {
  const { activity: initialActivity, top, height, left, width } = layout;
  const [activity, setActivity] = useState(initialActivity);
  const [showPopover, setShowPopover] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  // Update activity when layout prop changes
  useEffect(() => {
    setActivity(initialActivity);
  }, [initialActivity]);

  const getCardPosition = () => {
    if (!cardRef.current) return { x: 0, y: 0 };
    
    const rect = cardRef.current.getBoundingClientRect();
    return {
      x: rect.left,
      y: rect.top + rect.height / 2
    };
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('[role="checkbox"]')) {
      return;
    }
    
    e.stopPropagation();
    e.preventDefault();
    
    setPopoverPosition(getCardPosition());
    setShowPopover(true);
  };

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setPopoverPosition(getCardPosition());
    setShowPopover(true);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setPopoverPosition(getCardPosition());
    setShowPopover(true);
  };

  const handleCheckboxToggle = (checked: boolean | string) => {
    if (onToggleComplete) {
      onToggleComplete(activity.id);
    }
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onDelete) {
      onDelete(activity.id);
    }
  };

  const handleActivityUpdate = (activityId: number, updates: Partial<ActivityLayout['activity']>) => {
    console.log('Updating activity in card:', activityId, updates);
    setActivity(prev => ({ ...prev, ...updates }));
    if (onUpdate) {
      onUpdate(activityId, updates);
    }
  };

  const getDisplayType = (type: string) => {
    switch (type) {
      case 'восстановление': return 'восстанавливающая';
      case 'нейтральная': return 'нейтральная';
      case 'смешанная': return 'смешанная';
      case 'задача': return 'истощающая';
      default: return type;
    }
  };

  // Разное отображение для разных типов календаря
  if (viewType === 'week') {
    return (
      <>
        <div
          ref={cardRef}
          className={`absolute ${activity.color} rounded-lg p-1.5 border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow overflow-hidden`}
          style={{ 
            top: `${top}px`, 
            height: `${height}px`,
            left: `${left}%`,
            width: `${width}%`,
            zIndex: 1,
            minHeight: '30px'
          }}
          onClick={handleCardClick}
        >
          {/* Только название */}
          <div className="font-medium text-xs truncate leading-tight mb-1">
            {activity.name}
          </div>

          {/* Только время начала и окончания */}
          <div className="text-xs text-gray-600">
            <span className="font-medium">{activity.startTime}-{activity.endTime}</span>
          </div>
        </div>

        {/* Activity Info Popover */}
        {showPopover && (
          <ActivityInfoPopover
            activity={activity}
            onClose={() => setShowPopover(false)}
            position={popoverPosition}
            onDelete={onDelete}
            onUpdate={handleActivityUpdate}
          />
        )}
      </>
    );
  }

  if (viewType === 'dashboard') {
    return (
      <>
        <div
          ref={cardRef}
          className={`${activity.color} rounded-lg p-4 border border-gray-200 cursor-pointer hover:shadow-md transition-shadow mb-3`}
          onClick={handleCardClick}
        >
          {/* Верхняя строка: чекбокс + название + кнопки */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-start space-x-3 flex-1">
              <Checkbox 
                checked={activity.completed}
                onCheckedChange={handleCheckboxToggle}
                className="w-5 h-5 rounded-sm mt-1 cursor-pointer"
                onClick={handleCheckboxClick}
              />
              <span className="font-medium text-lg">{activity.name}</span>
            </div>
            
            <div className="flex space-x-1 ml-2">
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-6 w-6"
                onClick={handleInfoClick}
              >
                <Info className="w-3 h-3" />
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-6 w-6"
                onClick={handleEditClick}
              >
                <Edit className="w-3 h-3" />
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-6 w-6"
                onClick={handleDeleteClick}
              >
                <Trash2 className="w-3 h-3 text-red-500" />
              </Button>
            </div>
          </div>

          {/* Вторая строка: время + продолжительность + звезды */}
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
            <span className="font-medium">[{activity.startTime}-{activity.endTime}]</span>
            <span>[{activity.duration}]</span>
            <div className="flex items-center">
              {Array.from({ length: activity.importance }, (_, i) => (
                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>

          {/* Третья строка: тип + эмодзи */}
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-xs">
              {getDisplayType(activity.type)}
            </Badge>
            <span className="text-2xl">{activity.emoji}</span>
            {activity.type === 'восстановление' && activity.needEmoji && (
              <span className="text-lg">{activity.needEmoji}</span>
            )}
          </div>
        </div>

        {/* Activity Info Popover */}
        {showPopover && (
          <ActivityInfoPopover
            activity={activity}
            onClose={() => setShowPopover(false)}
            position={popoverPosition}
            onDelete={onDelete}
            onUpdate={handleActivityUpdate}
          />
        )}
      </>
    );
  }

  // Календарь дня (по умолчанию)
  return (
    <>
      <div
        ref={cardRef}
        className={`absolute ${activity.color} rounded-lg p-1.5 border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow overflow-hidden`}
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
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-1 flex-1 min-w-0">
            <Checkbox 
              checked={activity.completed}
              onCheckedChange={handleCheckboxToggle}
              className="w-3 h-3 rounded-sm flex-shrink-0 cursor-pointer"
              onClick={handleCheckboxClick}
            />
            <span className="font-medium text-xs truncate leading-tight">{activity.name}</span>
          </div>
          
          <div className="flex space-x-0.5 ml-1 flex-shrink-0">
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-3 w-3 p-0"
              onClick={handleInfoClick}
            >
              <Info className="w-2 h-2" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-3 w-3 p-0"
              onClick={handleEditClick}
            >
              <Edit className="w-2 h-2" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-3 w-3 p-0"
              onClick={handleDeleteClick}
            >
              <Trash2 className="w-2 h-2 text-red-500" />
            </Button>
          </div>
        </div>

        {/* Время + продолжительность + звезды */}
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center space-x-2">
            <span className="font-medium">{activity.startTime}-{activity.endTime}</span>
            <span>[{activity.duration}]</span>
          </div>
          <div className="flex items-center">
            {Array.from({ length: Math.min(activity.importance, 3) }, (_, i) => (
              <Star key={i} className="w-2 h-2 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
        </div>
      </div>

      {/* Activity Info Popover */}
      {showPopover && (
        <ActivityInfoPopover
          activity={activity}
          onClose={() => setShowPopover(false)}
          position={popoverPosition}
          onDelete={onDelete}
          onUpdate={handleActivityUpdate}
        />
      )}
    </>
  );
};

export default ActivityCard;
