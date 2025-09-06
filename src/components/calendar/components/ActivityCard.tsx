
import React, { useRef, useState } from 'react';
import { ActivityLayout } from '../types';
import { Activity } from '@/contexts/ActivitiesContext';
import ActivityInfoPopover from './ActivityInfoPopover';
import EditActivityDialog from './EditActivityDialog';
import DeleteRecurringDialog from './DeleteRecurringDialog';
import { DeleteRecurringOption, RecurringActivityOptions } from '../utils/recurringUtils';
import DashboardActivityCard from './activity-card/DashboardActivityCard';
import DayActivityCard from './activity-card/DayActivityCard';
import WeekActivityCard from './activity-card/WeekActivityCard';

interface ActivityCardProps {
  layout: ActivityLayout;
  onToggleComplete: (activityId: number | string) => void;
  onUpdate?: (id: number | string, updates: Partial<Activity>, recurringOptions?: RecurringActivityOptions) => void;
  onDelete?: (id: number | string, deleteOption?: DeleteRecurringOption) => void;
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

  const handleCheckboxToggle = () => {
    console.log('ActivityCard: Checkbox toggled for activity:', layout.activity.id, 'current status:', layout.activity.completed);
    onToggleComplete(layout.activity.id);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    console.log('ActivityCard: Card clicked, viewType:', viewType);
    e.stopPropagation();
    
    const target = e.target as HTMLElement;

    // Проверяем, что это не клик по кнопке или чекбоксу
    const isActionButton = target.closest('button');
    const isCheckbox = target.closest('button[role="checkbox"]') || 
                      target.closest('[data-radix-checkbox-root]') || 
                      target.closest('.checkbox-container');
    
    if (isActionButton && !isCheckbox) {
      console.log('ActivityCard: Action button clicked, ignoring');
      return;
    }

    if (isCheckbox) {
      console.log('ActivityCard: Checkbox clicked, ignoring card click');
      return;
    }

    // Для всех видов открываем информационное окно
    console.log('ActivityCard: Opening info popover');
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
    console.log('ActivityCard: Info button clicked');
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
    setShowInfoPopover(false);
    setShowEditDialog(true);
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

  const renderCard = () => {
    const commonProps = {
      layout,
      cardRef,
      onCardClick: handleCardClick,
      onCheckboxToggle: handleCheckboxToggle
    };

    switch (viewType) {
      case 'dashboard':
        return (
          <DashboardActivityCard 
            {...commonProps}
            onInfoClick={handleInfoClick}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
          />
        );
      case 'day':
        return (
          <DayActivityCard 
            {...commonProps}
            onInfoClick={handleInfoClick}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
          />
        );
      case 'week':
        return <WeekActivityCard {...commonProps} />;
      default:
        return (
          <DayActivityCard 
            {...commonProps}
            onInfoClick={handleInfoClick}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
          />
        );
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
          onClose={() => {
            console.log('ActivityCard: Closing info popover');
            setShowInfoPopover(false);
          }}
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
