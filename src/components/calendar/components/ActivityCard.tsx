import React, { useRef, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { ActivityLayout } from '../types';
import { Activity } from '@/contexts/ActivitiesContext';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

interface ActivityCardProps {
  layout: ActivityLayout;
  onToggleComplete: (activityId: number) => void;
  onUpdate?: (id: number, updates: Partial<Activity>) => void;
  onDelete?: (id: number) => void;
  viewType?: 'day' | 'week';
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  layout,
  onToggleComplete,
  onUpdate,
  onDelete,
  viewType = 'day'
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleCheckboxToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleComplete(layout.activity.id);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // console.log('Card clicked:', layout.activity.name);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditDialogOpen(true);
    // console.log('Edit clicked:', layout.activity.name);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(layout.activity.id);
    }
    // console.log('Delete clicked:', layout.activity.name);
  };

  const renderCardContent = () => {
    if (viewType === 'week') {
      return (
        <>
          {/* Только название */}
          <div className="font-medium text-xs truncate leading-tight mb-1">
            {layout.activity.name}
          </div>

          {/* Только время начала и окончания */}
          <div className="text-xs text-gray-600">
            <span className="font-medium">{layout.activity.startTime}-{layout.activity.endTime}</span>
          </div>
        </>
      );
    }

    return (
      <>
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-sm font-medium">
            <span className="truncate">{layout.activity.name}</span>
          </div>
          <p className="text-xs text-gray-600">{layout.activity.startTime}-{layout.activity.endTime}</p>
        </div>
      </>
    );
  };

  return (
    <div
      ref={cardRef}
      className={`absolute ${layout.activity.color} rounded-lg p-2 border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow overflow-hidden ${
        layout.activity.completed ? 'opacity-60' : ''
      }`}
      style={{ 
        top: `${layout.top}px`, 
        height: `${layout.height}px`,
        left: `${layout.left}%`,
        width: `${layout.width}%`,
        zIndex: 1,
        minHeight: '40px'
      }}
      onClick={handleCardClick}
    >
      <div className="flex items-start space-x-2 h-full">
        <div 
          className="flex-shrink-0 mt-0.5"
          onClick={handleCheckboxToggle}
        >
          <Checkbox
            checked={layout.activity.completed}
            onCheckedChange={() => onToggleComplete(layout.activity.id)}
            className="w-4 h-4 border-white bg-white/20 data-[state=checked]:bg-white data-[state=checked]:text-black"
          />
        </div>

        <div className="flex-1 min-w-0">
          {renderCardContent()}
        </div>
      </div>

      {/* Кнопки редактирования и удаления */}
      {onUpdate && onDelete && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="absolute right-1 top-1 h-6 w-6 p-0 bg-white/50 hover:bg-white/80 rounded-full shadow-sm">
              <Edit className="h-3 w-3 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem onClick={handleEditClick}>
              <Edit className="w-4 h-4 mr-2" /> Редактировать
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDeleteClick}>
              <Trash2 className="w-4 h-4 mr-2" /> Удалить
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default ActivityCard;
