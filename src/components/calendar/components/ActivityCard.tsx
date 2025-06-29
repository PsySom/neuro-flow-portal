
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

  const handleCheckboxToggle = () => {
    console.log('ActivityCard: Checkbox toggled for activity:', layout.activity.id);
    onToggleComplete(layout.activity.id);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    console.log('ActivityCard: Card clicked, viewType:', viewType, 'target:', e.target);
    e.stopPropagation();
    
    // Проверяем, что клик не по чекбоксу
    const target = e.target as HTMLElement;
    const isCheckboxClick = target.closest('[role="checkbox"]') || 
                           target.closest('[data-state]') || 
                           target.closest('button[role="checkbox"]') ||
                           target.hasAttribute('data-state') ||
                           target.closest('.peer'); // Для Shadcn checkbox

    if (isCheckboxClick) {
      console.log('ActivityCard: Click on checkbox detected, ignoring');
      return;
    }

    // Для дневного вида проверяем, что клик не по кнопкам (кроме чекбокса)
    if (viewType === 'day') {
      const isButtonClick = target.closest('button:not([role="checkbox"])');
      if (isButtonClick) {
        console.log('ActivityCard: Click on button detected in day view, ignoring');
        return;
      }
    }

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
