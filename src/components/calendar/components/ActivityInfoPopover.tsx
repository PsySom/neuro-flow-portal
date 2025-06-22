
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { X, Star, Calendar as CalendarIcon, Clock, Bell, Palette, StickyNote } from 'lucide-react';
import { Activity } from '../types';
import ActivityDetailsDialog from './ActivityDetailsDialog';

interface ActivityInfoPopoverProps {
  activity: Activity;
  onClose: () => void;
  position: { x: number; y: number };
  onDelete?: (id: number) => void;
  onUpdate?: (id: number, updates: Partial<Activity>) => void;
}

const ActivityInfoPopover: React.FC<ActivityInfoPopoverProps> = ({
  activity,
  onClose,
  position,
  onDelete,
  onUpdate
}) => {
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [showFullDialog, setShowFullDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // Evaluation state
  const [satisfaction, setSatisfaction] = useState([5]);
  const [processSatisfaction, setProcessSatisfaction] = useState([5]);
  const [fatigue, setFatigue] = useState([5]);
  const [stress, setStress] = useState([5]);

  // Trigger animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const getDisplayType = (type: string) => {
    switch (type) {
      case 'восстановление': return 'восстанавливающая';
      case 'нейтральная': return 'нейтральная';
      case 'смешанная': return 'смешанная';
      case 'задача': return 'истощающая';
      default: return type;
    }
  };

  const handleEvaluate = () => {
    setShowEvaluation(!showEvaluation);
  };

  const handleEdit = () => {
    setShowFullDialog(true);
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (onDelete) {
      onDelete(activity.id);
    }
    setShowDeleteDialog(false);
    onClose();
  };

  const handleSaveEvaluation = () => {
    console.log('Saving evaluation:', {
      activityId: activity.id,
      satisfaction: satisfaction[0],
      processSatisfaction: processSatisfaction[0],
      fatigue: fatigue[0],
      stress: stress[0]
    });
    setShowEvaluation(false);
  };

  const handleActivityUpdate = (updatedActivity: Activity) => {
    if (onUpdate) {
      onUpdate(activity.id, updatedActivity);
    }
    setShowFullDialog(false);
    onClose();
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 150);
  };

  // Вычисляем оптимальную позицию для попапа слева от плашки
  const getPopoverStyle = () => {
    const popoverWidth = 320;
    const popoverHeight = showEvaluation ? 600 : 350;
    
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const screenCenterY = screenHeight / 2;
    
    // Позиционируем слева от плашки
    let left = position.x - popoverWidth - 15;
    let top = position.y;
    
    // Если попап не помещается слева, размещаем справа
    if (left < 10) {
      left = position.x + 15;
    }
    
    // Корректируем вертикальную позицию для центрирования относительно экрана
    // Если попап выше центра экрана, центрируем его по плашке
    // Если ниже центра - сдвигаем вверх для лучшей видимости
    if (position.y < screenCenterY) {
      top = position.y - popoverHeight / 2;
    } else {
      top = position.y - popoverHeight + 50; // Небольшой отступ снизу
    }
    
    // Корректируем позицию в границах экрана
    if (left + popoverWidth > screenWidth - 10) {
      left = screenWidth - popoverWidth - 10;
    }
    if (left < 10) {
      left = 10;
    }
    if (top + popoverHeight > screenHeight - 10) {
      top = screenHeight - popoverHeight - 10;
    }
    if (top < 10) {
      top = 10;
    }
    
    return {
      left: `${left}px`,
      top: `${top}px`,
      opacity: isVisible ? 1 : 0,
      transform: `scale(${isVisible ? 1 : 0.95}) translateY(${isVisible ? 0 : 10}px)`,
      transition: 'all 0.2s ease-out',
    };
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-40"
        onClick={handleClose}
      />
      
      {/* Popover */}
      <div
        className="fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 max-w-sm"
        style={getPopoverStyle()}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with close button */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2 flex-1">
            <span className="text-lg">{activity.emoji}</span>
            <h3 className="font-semibold text-sm leading-tight">{activity.name}</h3>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 -mt-1 -mr-1"
            onClick={handleClose}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>

        {/* Activity info */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-xs">
              {getDisplayType(activity.type)}
            </Badge>
          </div>

          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <Clock className="w-3 h-3" />
            <span>{activity.startTime} - {activity.endTime}</span>
          </div>

          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <CalendarIcon className="w-3 h-3" />
            <span>Сегодня</span>
          </div>

          <div className="flex items-center space-x-2">
            <Star className="w-3 h-3 text-gray-400" />
            <div className="flex items-center">
              {Array.from({ length: activity.importance }, (_, i) => (
                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-gray-600 dark:text-gray-400">({activity.importance}/5)</span>
          </div>

          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <Bell className="w-3 h-3" />
            <span>Нет напоминаний</span>
          </div>

          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <Palette className="w-3 h-3" />
            <div className={`w-4 h-4 rounded ${activity.color}`} />
          </div>

          <div className="flex items-start space-x-2 text-gray-600 dark:text-gray-400">
            <StickyNote className="w-3 h-3 mt-0.5" />
            <span>Нет заметок</span>
          </div>
        </div>

        {/* Evaluation section */}
        {showEvaluation && (
          <>
            <Separator className="my-3" />
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Быстрая оценка</h4>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs">Удовлетворенность</span>
                  <span className="text-xs font-medium">{satisfaction[0]}/10</span>
                </div>
                <Slider
                  value={satisfaction}
                  onValueChange={setSatisfaction}
                  max={10}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs">Процесс</span>
                  <span className="text-xs font-medium">{processSatisfaction[0]}/10</span>
                </div>
                <Slider
                  value={processSatisfaction}
                  onValueChange={setProcessSatisfaction}
                  max={10}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs">Энергия</span>
                  <span className="text-xs font-medium">{fatigue[0]}/10</span>
                </div>
                <Slider
                  value={fatigue}
                  onValueChange={setFatigue}
                  max={10}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs">Стресс</span>
                  <span className="text-xs font-medium">{stress[0]}/10</span>
                </div>
                <Slider
                  value={stress}
                  onValueChange={setStress}
                  max={10}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>

              <Button 
                size="sm" 
                onClick={handleSaveEvaluation}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                Сохранить оценку
              </Button>
            </div>
          </>
        )}

        {/* Action buttons */}
        <Separator className="my-3" />
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={handleEvaluate} className="flex-1">
            {showEvaluation ? 'Скрыть' : 'Оценить'}
          </Button>
          <Button size="sm" variant="outline" onClick={handleEdit} className="flex-1">
            Редактировать
          </Button>
          <Button size="sm" variant="destructive" onClick={handleDeleteClick} className="flex-1">
            Удалить
          </Button>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить активность?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить активность "{activity.name}"? Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Full dialog */}
      <ActivityDetailsDialog 
        open={showFullDialog}
        onOpenChange={setShowFullDialog}
        activity={activity}
        onActivityUpdate={handleActivityUpdate}
        onDelete={onDelete}
      />
    </>
  );
};

export default ActivityInfoPopover;
