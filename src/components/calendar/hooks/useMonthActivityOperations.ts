import { useCallback } from 'react';
import { useCreateActivity, useUpdateActivity, useDeleteActivity } from '@/hooks/api/useActivities';
import { DeleteRecurringOption, RecurringActivityOptions } from '../utils/recurringUtils';
import { getActivityTypeId } from '../utils/activityTypeMapping';
import { Activity } from '@/components/calendar/types';

export const useMonthActivityOperations = () => {
  const createActivityMutation = useCreateActivity();
  const updateActivityMutation = useUpdateActivity();
  const deleteActivityMutation = useDeleteActivity();

  const handleActivityCreate = useCallback(async (newActivity: any, recurringOptions?: RecurringActivityOptions) => {
    try {
      console.log('MonthView: Creating activity with recurring:', newActivity, recurringOptions);

      const activityData = {
        title: newActivity.name,
        description: newActivity.note,
        activity_type_id: getActivityTypeId(newActivity.type),
        start_time: `${newActivity.date}T${newActivity.startTime}:00.000Z`,
        end_time: newActivity.endTime ? `${newActivity.date}T${newActivity.endTime}:00.000Z` : undefined,
        metadata: {
          importance: newActivity.importance,
          color: newActivity.color,
          emoji: newActivity.emoji,
          needEmoji: newActivity.needEmoji
        }
      };
      
      createActivityMutation.mutate({
        ...activityData,
        metadata: {
          ...activityData.metadata,
          recurring: recurringOptions
        }
      });
    } catch (error) {
      console.error('Error creating activity:', error);
    }
  }, [createActivityMutation]);

  const handleActivityUpdate = useCallback((activityId: number, updates: any, recurringOptions?: RecurringActivityOptions) => {
    console.log('MonthView updating activity:', activityId, updates, 'recurring:', recurringOptions);
    console.log('Updates type check - is full activity?', updates.id !== undefined);
    
    // Check if we received a full activity object or partial updates
    const isFullActivity = updates.id !== undefined;
    const activityData = isFullActivity ? updates : updates;

    const apiUpdates: any = {
      title: activityData.name,
      description: activityData.note,
      activity_type_id: activityData.type ? getActivityTypeId(activityData.type) : undefined,
      start_time: activityData.date && activityData.startTime ? `${activityData.date}T${activityData.startTime}:00.000Z` : undefined,
      end_time: activityData.date && activityData.endTime ? `${activityData.date}T${activityData.endTime}:00.000Z` : undefined,
      status: activityData.completed !== undefined ? (activityData.completed ? 'completed' : 'planned') : undefined,
      metadata: {
        importance: activityData.importance,
        color: activityData.color,
        emoji: activityData.emoji,
        needEmoji: activityData.needEmoji,
        recurring: recurringOptions
      }
    };
    
    const cleanApiUpdates = Object.fromEntries(
      Object.entries(apiUpdates).filter(([_, value]) => value !== undefined)
    );
    
    console.log('MonthView: Sending update request:', cleanApiUpdates);
    updateActivityMutation.mutate({ id: activityId, data: cleanApiUpdates });
  }, [updateActivityMutation]);

  const handleActivityDelete = useCallback((activityId: number, deleteOption?: DeleteRecurringOption) => {
    console.log('MonthView deleting activity:', activityId, deleteOption);
    deleteActivityMutation.mutate(activityId);
  }, [deleteActivityMutation]);

  const handleActivityToggle = useCallback((activityId: number, monthActivities: Activity[]) => {
    console.log('MonthView toggling activity:', activityId);
    const activity = monthActivities.find(a => a.id === activityId);
    if (activity) {
      const newStatus = activity.completed ? 'planned' : 'completed';
      updateActivityMutation.mutate({ 
        id: activityId, 
        data: { status: newStatus } 
      });
    }
  }, [updateActivityMutation]);

  return {
    handleActivityCreate,
    handleActivityUpdate,
    handleActivityDelete,
    handleActivityToggle
  };
};