
import React from 'react';
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
      className={`absolute ${activity.color} rounded-lg p-1.5 border-[6px] ${getActivityTypeColor(activity.type)} shadow-sm cursor-pointer hover:shadow-md transition-shadow overflow-hidden ${
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

      {/* Время (без продолжительности и звезд) */}
      <div className="flex items-center text-xs text-gray-600">
        <span className="font-medium">{activity.startTime}-{activity.endTime}</span>
      </div>
    </div>
  );
};

export default WeekActivityCard;
