
import React, { useState, useRef, useEffect } from 'react';
import { ActivityLayout } from '../types';
import ActivityInfoPopover from './ActivityInfoPopover';
import DeleteRecurringDialog from './DeleteRecurringDialog';
import { useActivities } from '@/contexts/ActivitiesContext';
import { DeleteRecurringOption } from '../utils/recurringUtils';
import DashboardActivityCard from './activity-card/DashboardActivityCard';
import WeekActivityCard from './activity-card/WeekActivityCard';
import DayActivityCard from './activity-card/DayActivityCard';

interface ActivityCardProps {
  layout: ActivityLayout;
  onToggleComplete?: (activityId: number) => void;
  onDelete?: (activityId: number) => void;
  onUpdate?: (activityId: number, updates: Partial<ActivityLayout['activity']>) => void;
  viewType?: 'dashboard' | 'day' | 'week';
}

const ActivityCard: React.FC<ActivityCardProps> = ({ 
  layout, 
  onToggleComplete, 
  onDelete, 
  onUpdate,
  viewType = 'day'
}) => {
  const { activity: initialActivity } = layout;
  const [activity, setActivity] = useState(initialActivity);
  const [showPopover, setShowPopover] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const { deleteActivity } = useActivities();

  // Update activity when layout prop changes
  useEffect(() => {
    setActivity(initialActivity);
  }, [initialActivity]);

  const getCardPosition = () => {
    if (!cardRef.current) return { x: 0, y: 0 };
    
    const rect = cardRef.current.getBoundingClientRect();
    return {
      x: rect.left,
      y: rect.top + rect.height / 2
    };
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('[role="checkbox"]')) {
      return;
    }
    
    e.stopPropagation();
    e.preventDefault();
    
    setPopoverPosition(getCardPosition());
    setShowPopover(true);
  };

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setPopoverPosition(getCardPosition());
    setShowPopover(true);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setPopoverPosition(getCardPosition());
    setShowPopover(true);
  };

  const handleCheckboxToggle = () => {
    if (onToggleComplete) {
      onToggleComplete(activity.id);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Если активность повторяющаяся, показываем диалог выбора
    if (activity.recurring) {
      setShowDeleteDialog(true);
    } else {
      if (onDelete) {
        onDelete(activity.id);
      }
    }
  };

  const handleDeleteConfirm = (deleteOption: DeleteRecurringOption) => {
    deleteActivity(activity.id, deleteOption);
    setShowDeleteDialog(false);
  };

  const handleActivityUpdate = (activityId: number, updates: Partial<ActivityLayout['activity']>) => {
    console.log('Updating activity in card:', activityId, updates);
    setActivity(prev => ({ ...prev, ...updates }));
    if (onUpdate) {
      onUpdate(activityId, updates);
    }
  };

  const commonProps = {
    layout: { ...layout, activity },
    cardRef,
    onCardClick: handleCardClick,
    onInfoClick: handleInfoClick,
    onEditClick: handleEditClick,
    onDeleteClick: handleDeleteClick,
    onCheckboxToggle: handleCheckboxToggle
  };

  return (
    <>
      {viewType === 'dashboard' && <DashboardActivityCard {...commonProps} />}
      {viewType === 'week' && <WeekActivityCard {...commonProps} />}
      {viewType === 'day' && <DayActivityCard {...commonProps} />}

      {/* Activity Info Popover */}
      {showPopover && (
        <ActivityInfoPopover
          activity={activity}
          onClose={() => setShowPopover(false)}
          position={popoverPosition}
          onDelete={handleDeleteClick}
          onUpdate={handleActivityUpdate}
        />
      )}

      {/* Delete Recurring Dialog */}
      {showDeleteDialog && (
        <DeleteRecurringDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          activity={activity}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </>
  );
};

export default ActivityCard;
