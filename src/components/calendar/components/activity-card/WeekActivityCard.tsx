
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Star } from 'lucide-react';
import { ActivityLayout } from '../../types';

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

  const handleCheckboxClick = (e: React.MouseEvent) => {
    console.log('WeekActivityCard: Checkbox clicked, stopping propagation');
    e.stopPropagation();
    e.preventDefault();
  };

  const handleCardClick = (e: React.MouseEvent) => {
    console.log('WeekActivityCard: Card clicked');
    onCardClick(e);
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
      onClick={handleCardClick}
    >
      {/* Верхняя строка с чекбоксом и названием */}
      <div className="flex items-center space-x-1 mb-1">
        <Checkbox 
          checked={activity.completed}
          onCheckedChange={onCheckboxToggle}
          className="w-3 h-3 rounded-sm flex-shrink-0 cursor-pointer border-white bg-white/20 data-[state=checked]:bg-white data-[state=checked]:text-black"
          onClick={handleCheckboxClick}
        />
        <span className="font-medium text-xs truncate leading-tight flex-1">{activity.name}</span>
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
