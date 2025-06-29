
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Info, Edit, Star, Trash2 } from 'lucide-react';
import { ActivityLayout } from '../../types';

interface DashboardActivityCardProps {
  layout: ActivityLayout;
  cardRef: React.RefObject<HTMLDivElement>;
  onCardClick: (e: React.MouseEvent) => void;
  onInfoClick: (e: React.MouseEvent) => void;
  onEditClick: (e: React.MouseEvent) => void;
  onDeleteClick: (e: React.MouseEvent) => void;
  onCheckboxToggle: () => void;
}

const DashboardActivityCard: React.FC<DashboardActivityCardProps> = ({
  layout,
  cardRef,
  onCardClick,
  onInfoClick,
  onEditClick,
  onDeleteClick,
  onCheckboxToggle
}) => {
  const { activity } = layout;

  const getDisplayType = (type: string) => {
    switch (type) {
      case 'восстановление': return 'восстанавливающая';
      case 'нейтральная': return 'нейтральная';
      case 'смешанная': return 'смешанная';
      case 'задача': return 'истощающая';
      default: return type;
    }
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <div
      ref={cardRef}
      className={`${activity.color} rounded-lg p-4 border border-gray-200 cursor-pointer hover:shadow-md transition-shadow mb-3 ${
        activity.completed ? 'opacity-60' : ''
      }`}
      onClick={onCardClick}
    >
      {/* Верхняя строка: чекбокс + название + кнопки */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-start space-x-3 flex-1">
          <Checkbox 
            checked={activity.completed}
            onCheckedChange={onCheckboxToggle}
            className="w-5 h-5 rounded-sm mt-1 cursor-pointer border-white bg-white/20 data-[state=checked]:bg-white data-[state=checked]:text-black"
            onClick={handleCheckboxClick}
          />
          <span className="font-medium text-lg">{activity.name}</span>
        </div>
        
        <div className="flex space-x-1 ml-2">
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-6 w-6 bg-white/50 hover:bg-white/80 rounded-full"
            onClick={onInfoClick}
          >
            <Info className="w-3 h-3" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-6 w-6 bg-white/50 hover:bg-white/80 rounded-full"
            onClick={onEditClick}
          >
            <Edit className="w-3 h-3" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-6 w-6 bg-white/50 hover:bg-white/80 rounded-full"
            onClick={onDeleteClick}
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
  );
};

export default DashboardActivityCard;
