
import React from 'react';
import { Star } from 'lucide-react';
import { ActivityLayout } from '../../types';
import { getActivityTypeColor } from '@/utils/activityTypeColors';

interface WeekActivityCardProps {
  layout: ActivityLayout;
  cardRef: React.RefObject<HTMLDivElement>;
  onCardClick: (e: React.MouseEvent) => void;
  onCheckboxToggle: () => void;
}

const WeekActivityCard: React.FC<WeekActivityCardProps> = ({
  layout,
  cardRef,
  onCardClick,
  onCheckboxToggle
}) => {
  const { activity, top, height, left, width } = layout;

  const handleCardClick = (e: React.MouseEvent) => {
    console.log('WeekActivityCard: Card clicked');
    e.stopPropagation();
    onCardClick(e);
  };

  return (
    <div
      ref={cardRef}
      className={`absolute ${activity.color} rounded-lg p-1.5 border-2 ${getActivityTypeColor(activity.type)} shadow-sm cursor-pointer hover:shadow-md transition-shadow overflow-hidden ${
        activity.completed ? 'opacity-60' : ''
      }`}
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
      {/* Название активности */}
      <div className="mb-1">
        <span className="font-medium text-xs truncate leading-tight block">{activity.name}</span>
      </div>

      {/* Время + звезды важности */}
      <div className="flex items-center justify-between text-xs text-gray-600">
        <div className="flex items-center space-x-1">
          <span className="font-medium">{activity.startTime}-{activity.endTime}</span>
        </div>
        <div className="flex items-center">
          {Array.from({ length: Math.min(activity.importance, 3) }, (_, i) => (
            <Star key={i} className="w-2 h-2 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeekActivityCard;
