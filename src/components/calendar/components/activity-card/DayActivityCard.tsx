
import React from 'react';
import { Button } from '@/components/ui/button';
import { Info, Edit, Star, Trash2 } from 'lucide-react';
import { ActivityLayout } from '../../types';

interface DayActivityCardProps {
  layout: ActivityLayout;
  cardRef: React.RefObject<HTMLDivElement>;
  onCardClick: (e: React.MouseEvent) => void;
  onInfoClick: (e: React.MouseEvent) => void;
  onEditClick: (e: React.MouseEvent) => void;
  onDeleteClick: (e: React.MouseEvent) => void;
  onCheckboxToggle: () => void;
}

const DayActivityCard: React.FC<DayActivityCardProps> = ({
  layout,
  cardRef,
  onCardClick,
  onInfoClick,
  onEditClick,
  onDeleteClick,
  onCheckboxToggle
}) => {
  const { activity, top, height, left, width } = layout;

  const handleCardClick = (e: React.MouseEvent) => {
    console.log('DayActivityCard: Card clicked');
    e.stopPropagation();
    onCardClick(e);
  };

  return (
    <div
      ref={cardRef}
      className={`absolute ${activity.color} rounded-lg p-2 border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow overflow-hidden ${
        activity.completed ? 'opacity-60' : ''
      }`}
      style={{ 
        top: `${top}px`, 
        height: `${Math.max(height, 90)}px`,
        left: `${left}%`,
        width: `${width}%`,
        zIndex: 1
      }}
      onClick={handleCardClick}
    >
      {/* Верхняя строка с названием и кнопками */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center space-x-1 flex-1 min-w-0">
          <span className="font-medium text-xs truncate leading-tight">{activity.name}</span>
        </div>
        
        <div className="flex space-x-0.5 ml-1 flex-shrink-0">
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-3 w-3 p-0 bg-white/50 hover:bg-white/80 rounded-full"
            onClick={onInfoClick}
          >
            <Info className="w-2 h-2" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-3 w-3 p-0 bg-white/50 hover:bg-white/80 rounded-full"
            onClick={onEditClick}
          >
            <Edit className="w-2 h-2" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-3 w-3 p-0 bg-white/50 hover:bg-white/80 rounded-full"
            onClick={onDeleteClick}
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
  );
};

export default DayActivityCard;
