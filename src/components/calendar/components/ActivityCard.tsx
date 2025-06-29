
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
    switch (viewType) {
      case 'dashboard':
        return (
          <DashboardActivityCard
            layout={layout}
            cardRef={cardRef}
            onCardClick={handleCardClick}
            onInfoClick={handleInfoClick}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
            onCheckboxToggle={handleCheckboxToggle}
          />
        );
      case 'day':
        return (
          <DayActivityCard
            layout={layout}
            cardRef={cardRef}
            onCardClick={handleCardClick}
            onInfoClick={handleInfoClick}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
            onCheckboxToggle={handleCheckboxToggle}
          />
        );
      case 'week':
        return (
          <WeekActivityCard
            layout={layout}
            cardRef={cardRef}
            onCardClick={handleCardClick}
          />
        );
      default:
        return (
          <DayActivityCard
            layout={layout}
            cardRef={cardRef}
            onCardClick={handleCardClick}
            onInfoClick={handleInfoClick}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
            onCheckboxToggle={handleCheckboxToggle}
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
