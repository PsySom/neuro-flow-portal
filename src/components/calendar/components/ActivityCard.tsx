
import React, { useRef, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ActivityLayout } from '../types';
import { Activity } from '@/contexts/ActivitiesContext';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Info, Edit, Star, Trash2 } from 'lucide-react';
import ActivityInfoPopover from './ActivityInfoPopover';
import EditActivityDialog from './EditActivityDialog';
import DeleteRecurringDialog from './DeleteRecurringDialog';
import { DeleteRecurringOption, RecurringActivityOptions } from '../utils/recurringUtils';

interface ActivityCardProps {
  layout: ActivityLayout;
  onToggleComplete: (activityId: number) => void;
  onUpdate?: (id: number, updates: Partial<Activity>, recurringOptions?: RecurringActivityOptions) => void;
  onDelete?: (id: number, deleteOption?: DeleteRecurringOption) => void;
  viewType?: 'day' | 'week' | 'dashboard';
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  layout,
  onToggleComplete,
  onUpdate,
  onDelete,
  viewType = 'day'
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [showInfoPopover, setShowInfoPopover] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });

  const handleCheckboxToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleComplete(layout.activity.id);
  };

  const handleCheckboxChange = (checked: boolean) => {
    onToggleComplete(layout.activity.id);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Проверяем, что клик не по кнопкам или чекбоксу
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[role="checkbox"]') || target.closest('[data-state]')) {
      return;
    }

    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setPopoverPosition({
        x: rect.left,
        y: rect.top
      });
      setShowInfoPopover(true);
    }
  };

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setPopoverPosition({
        x: rect.left,
        y: rect.top
      });
      setShowInfoPopover(true);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowInfoPopover(false); // Закрываем миниокно
    setShowEditDialog(true); // Открываем полное окно редактирования
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = (deleteOption: DeleteRecurringOption) => {
    if (onDelete) {
      onDelete(layout.activity.id, deleteOption);
    }
    setShowDeleteDialog(false);
    setShowInfoPopover(false);
  };

  const handleActivityUpdate = (updatedActivity: Activity, recurringOptions?: RecurringActivityOptions) => {
    console.log('Activity updated in ActivityCard:', updatedActivity, 'with recurring:', recurringOptions);
    if (onUpdate) {
      onUpdate(layout.activity.id, updatedActivity, recurringOptions);
    }
    setShowEditDialog(false);
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

  const renderDashboardCard = () => (
    <div
      ref={cardRef}
      className={`${layout.activity.color} rounded-lg p-4 border border-gray-200 cursor-pointer hover:shadow-md transition-shadow mb-3 ${
        layout.activity.completed ? 'opacity-60' : ''
      }`}
      onClick={handleCardClick}
    >
      {/* Верхняя строка: чекбокс + название + кнопки */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-start space-x-3 flex-1">
          <div onClick={handleCheckboxToggle}>
            <Checkbox
              checked={layout.activity.completed}
              onCheckedChange={handleCheckboxChange}
              className="w-5 h-5 rounded-sm mt-1 cursor-pointer border-white bg-white/20 data-[state=checked]:bg-white data-[state=checked]:text-black"
            />
          </div>
          <span className="font-medium text-lg">{layout.activity.name}</span>
        </div>
        
        <div className="flex space-x-1 ml-2">
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-6 w-6 bg-white/50 hover:bg-white/80 rounded-full"
            onClick={handleInfoClick}
          >
            <Info className="w-3 h-3" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-6 w-6 bg-white/50 hover:bg-white/80 rounded-full"
            onClick={handleEditClick}
          >
            <Edit className="w-3 h-3" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-6 w-6 bg-white/50 hover:bg-white/80 rounded-full"
            onClick={handleDeleteClick}
          >
            <Trash2 className="w-3 h-3 text-red-500" />
          </Button>
        </div>
      </div>

      {/* Вторая строка: время + продолжительность + звезды */}
      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
        <span className="font-medium">[{layout.activity.startTime}-{layout.activity.endTime}]</span>
        <span>[{layout.activity.duration}]</span>
        <div className="flex items-center">
          {Array.from({ length: layout.activity.importance }, (_, i) => (
            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
      </div>

      {/* Третья строка: тип + эмодзи */}
      <div className="flex items-center space-x-2">
        <Badge variant="secondary" className="text-xs">
          {getDisplayType(layout.activity.type)}
        </Badge>
        <span className="text-2xl">{layout.activity.emoji}</span>
        {layout.activity.type === 'восстановление' && layout.activity.needEmoji && (
          <span className="text-lg">{layout.activity.needEmoji}</span>
        )}
      </div>
    </div>
  );

  const renderDayCard = () => (
    <div
      ref={cardRef}
      className={`absolute ${layout.activity.color} rounded-lg p-2 border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow overflow-hidden ${
        layout.activity.completed ? 'opacity-60' : ''
      }`}
      style={{ 
        top: `${layout.top}px`, 
        height: `${Math.max(layout.height, 90)}px`, // Минимум час
        left: `${layout.left}%`,
        width: `${layout.width}%`,
        zIndex: 1
      }}
      onClick={handleCardClick}
    >
      {/* Верхняя строка с чекбоксом, названием и кнопками */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center space-x-1 flex-1 min-w-0">
          <div onClick={handleCheckboxToggle}>
            <Checkbox 
              checked={layout.activity.completed}
              onCheckedChange={handleCheckboxChange}
              className="w-3 h-3 rounded-sm flex-shrink-0 cursor-pointer border-white bg-white/20 data-[state=checked]:bg-white data-[state=checked]:text-black"
            />
          </div>
          <span className="font-medium text-xs truncate leading-tight">{layout.activity.name}</span>
        </div>
        
        <div className="flex space-x-0.5 ml-1 flex-shrink-0">
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-3 w-3 p-0 bg-white/50 hover:bg-white/80 rounded-full"
            onClick={handleInfoClick}
          >
            <Info className="w-2 h-2" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-3 w-3 p-0 bg-white/50 hover:bg-white/80 rounded-full"
            onClick={handleEditClick}
          >
            <Edit className="w-2 h-2" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-3 w-3 p-0 bg-white/50 hover:bg-white/80 rounded-full"
            onClick={handleDeleteClick}
          >
            <Trash2 className="w-2 h-2 text-red-500" />
          </Button>
        </div>
      </div>

      {/* Время + продолжительность + звезды */}
      <div className="flex items-center justify-between text-xs text-gray-600">
        <div className="flex items-center space-x-2">
          <span className="font-medium">{layout.activity.startTime}-{layout.activity.endTime}</span>
          <span>[{layout.activity.duration}]</span>
        </div>
        <div className="flex items-center">
          {Array.from({ length: Math.min(layout.activity.importance, 3) }, (_, i) => (
            <Star key={i} className="w-2 h-2 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
      </div>
    </div>
  );

  const renderWeekCard = () => (
    <div
      ref={cardRef}
      className={`absolute ${layout.activity.color} rounded-lg p-1.5 border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow overflow-hidden ${
        layout.activity.completed ? 'opacity-60' : ''
      }`}
      style={{ 
        top: `${layout.top}px`, 
        height: `${layout.height}px`,
        left: `${layout.left}%`,
        width: `${layout.width}%`,
        zIndex: 1,
        minHeight: '30px'
      }}
      onClick={handleCardClick}
    >
      {/* Только название */}
      <div className="font-medium text-xs truncate leading-tight mb-1">
        {layout.activity.name}
      </div>

      {/* Только время начала и окончания */}
      <div className="text-xs text-gray-600">
        <span className="font-medium">{layout.activity.startTime}-{layout.activity.endTime}</span>
      </div>
    </div>
  );

  const renderCard = () => {
    switch (viewType) {
      case 'dashboard':
        return renderDashboardCard();
      case 'day':
        return renderDayCard();
      case 'week':
        return renderWeekCard();
      default:
        return renderDayCard();
    }
  };

  return (
    <>
      {renderCard()}
      
      {/* Информационное окно */}
      {showInfoPopover && (
        <ActivityInfoPopover
          activity={layout.activity}
          position={popoverPosition}
          onClose={() => setShowInfoPopover(false)}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onEdit={() => {
            setShowInfoPopover(false);
            setShowEditDialog(true);
          }}
        />
      )}

      {/* Полное окно редактирования */}
      {showEditDialog && (
        <EditActivityDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          activity={layout.activity}
          onActivityUpdate={handleActivityUpdate}
          onDelete={onDelete}
        />
      )}

      {/* Диалог удаления повторяющихся активностей */}
      {showDeleteDialog && (
        <DeleteRecurringDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          activity={layout.activity}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </>
  );
};

export default ActivityCard;
