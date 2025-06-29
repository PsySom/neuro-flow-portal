
import React from 'react';
import { ActivityLayout } from '../../types';

interface WeekActivityCardProps {
  layout: ActivityLayout;
  cardRef: React.RefObject<HTMLDivElement>;
  onCardClick: (e: React.MouseEvent) => void;
  onInfoClick: (e: React.MouseEvent) => void;
  onEditClick: (e: React.MouseEvent) => void;
  onDeleteClick: (e: React.MouseEvent) => void;
  onCheckboxToggle: () => void;
}

const WeekActivityCard: React.FC<WeekActivityCardProps> = ({
  layout,
  cardRef,
  onCardClick,
  onInfoClick,
  onEditClick,
  onDeleteClick,
  onCheckboxToggle
}) => {
  const { activity, top, height, left, width } = layout;

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <div
      ref={cardRef}
      className={`absolute ${activity.color} rounded-lg p-1.5 border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow overflow-hidden ${
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
      onClick={onCardClick}
    >
      {/* Название активности */}
      <div className="font-medium text-xs truncate leading-tight mb-1">
        {activity.name}
      </div>

      {/* Время начала и окончания */}
      <div className="text-xs text-gray-600">
        <span className="font-medium">{activity.startTime}-{activity.endTime}</span>
      </div>
    </div>
  );
};

export default WeekActivityCard;
