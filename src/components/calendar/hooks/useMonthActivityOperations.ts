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

    const apiUpdates: any = {
      title: updates.name,
      description: updates.note,
      activity_type_id: updates.type ? getActivityTypeId(updates.type) : undefined,
      start_time: updates.date && updates.startTime ? `${updates.date}T${updates.startTime}:00.000Z` : undefined,
      end_time: updates.date && updates.endTime ? `${updates.date}T${updates.endTime}:00.000Z` : undefined,
      status: updates.completed !== undefined ? (updates.completed ? 'completed' : 'planned') : undefined,
      metadata: {
        importance: updates.importance,
        color: updates.color,
        emoji: updates.emoji,
        needEmoji: updates.needEmoji,
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