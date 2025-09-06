
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Info, Edit, Star, Trash2 } from 'lucide-react';
import { ActivityLayout } from '../../types';
import { Activity } from '@/contexts/ActivitiesContext';
import { getActivityTypeColor } from '@/utils/activityTypeColors';

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
  console.log('DashboardActivityCard: Rendering activity:', activity.name, 'completed:', activity.completed);

  const getDisplayType = (type: string) => {
    const typeMap: Record<string, string> = {
      'восстановление': 'восстанавливающая',
      'нейтральная': 'нейтральная',
      'смешанная': 'смешанная',
      'задача': 'истощающая'
    };
    return typeMap[type] || type;
  };

  const handleCheckboxChange = (checked: boolean | 'indeterminate') => {
    console.log('DashboardActivityCard: Checkbox changed to:', checked, 'for activity:', activity.id);
    console.log('DashboardActivityCard: Current completion status:', activity.completed);
    
    // Always toggle completion status regardless of checked value
    onCheckboxToggle();
  };

  const handleCardClick = (e: React.MouseEvent) => {
    console.log('DashboardActivityCard: Card click event received');
    // Prevent info popover from opening when clicking on buttons or checkbox
    const target = e.target as HTMLElement;
    
    // More precise checkbox detection
    const isCheckboxClick = target.closest('button[role="checkbox"]') || 
                           target.closest('[data-radix-checkbox-root]') || 
                           target.closest('.checkbox-container') ||
                           target.hasAttribute('data-state') ||
                           target.closest('[data-state]');
    
    const isButtonClick = target.closest('button:not([role="checkbox"]):not([data-radix-checkbox-root])');
    
    if (isCheckboxClick || isButtonClick) {
      console.log('DashboardActivityCard: Click on checkbox/button, preventing card click');
      e.stopPropagation();
      return;
    }

    console.log('DashboardActivityCard: Card clicked, delegating to parent');
    onCardClick(e);
  };

  const renderStars = () => {
    return Array.from({ length: activity.importance }, (_, i) => (
      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
    ));
  };

  return (
    <div
      ref={cardRef}
      className={`${activity.color} rounded-lg p-4 border-2 ${getActivityTypeColor(activity.type)} cursor-pointer hover:shadow-md transition-shadow mb-3 ${
        activity.completed ? 'opacity-60' : ''
      }`}
      onClick={handleCardClick}
    >
      {/* Header row - чекбокс слева, название, кнопки справа */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3 flex-1">
          <div 
            className={`border-2 ${getActivityTypeColor(activity.type)} rounded-full p-1 bg-white/20 checkbox-container`}
            onClick={(e) => {
              console.log('DashboardActivityCard: Checkbox container clicked');
              e.stopPropagation();
              handleCheckboxChange(!activity.completed);
            }}
          >
            <Checkbox 
              checked={activity.completed}
              onCheckedChange={(checked) => {
                console.log('DashboardActivityCard: Checkbox onCheckedChange triggered:', checked);
                handleCheckboxChange(checked);
              }}
              className="w-5 h-5 rounded-full cursor-pointer border-white bg-transparent data-[state=checked]:bg-white data-[state=checked]:text-black transition-all duration-200"
              title={activity.completed ? 'Отметить как не выполненную' : 'Отметить как выполненную'}
            />
          </div>
          <span className="font-medium text-lg text-gray-800">{activity.name}</span>
        </div>
        
        <div className="flex space-x-1 ml-2">
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-7 w-7 bg-white/50 hover:bg-white/80 rounded-full"
            onClick={onInfoClick}
            title="Информация"
          >
            <Info className="w-4 h-4" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-7 w-7 bg-white/50 hover:bg-white/80 rounded-full"
            onClick={onEditClick}
            title="Редактировать"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-7 w-7 bg-white/50 hover:bg-white/80 rounded-full"
            onClick={onDeleteClick}
            title="Удалить"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      </div>

      {/* Time, duration and stars row */}
      <div className="flex items-center space-x-4 text-sm text-gray-700 mb-3">
        <span className="font-medium">
          {activity.endTime ? `${activity.startTime} - ${activity.endTime}` : activity.startTime}
        </span>
        <span className="bg-white/30 px-2 py-1 rounded text-xs">{activity.duration || '1ч'}</span>
        <div className="flex items-center space-x-1">
          {renderStars()}
        </div>
      </div>

      {/* Activity type and emoji row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700 font-medium">Вид активности:</span>
          <Badge variant="secondary" className="text-xs bg-white/40 text-gray-800">
            {getDisplayType(activity.type)}
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{activity.emoji}</span>
          {activity.type === 'восстановление' && activity.needEmoji && (
            <span className="text-lg">{activity.needEmoji}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardActivityCard;
