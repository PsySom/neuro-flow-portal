import { useCallback } from 'react';
import { useCreateActivity, useUpdateActivity, useDeleteActivity } from '@/hooks/api/useActivities';
import { DeleteRecurringOption, RecurringActivityOptions } from '../utils/recurringUtils';
import { getActivityTypeId } from '../utils/activityTypeMapping';

export const useWeekActivityOperations = (weekActivities: any[]) => {
  const createActivityMutation = useCreateActivity();
  const updateActivityMutation = useUpdateActivity();
  const deleteActivityMutation = useDeleteActivity();

  const handleActivityCreate = useCallback(async (newActivity: any, recurringOptions?: RecurringActivityOptions) => {
    try {
      console.log('WeekView: Creating activity with recurring:', newActivity, recurringOptions);

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
      
      // Always use regular mutation - the recurring logic is now in the backend/mock
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

  const handleActivityUpdate = useCallback((activityId: number | string, updates: any, recurringOptions?: RecurringActivityOptions) => {
    const numericId = typeof activityId === 'string' ? parseInt(activityId) : activityId;
    console.log('WeekView updating activity:', numericId, updates, 'recurring:', recurringOptions);
    console.log('Updates object keys:', Object.keys(updates));
    console.log('WeekView: Time values from updates:');
    console.log('  startTime:', updates.startTime);
    console.log('  endTime:', updates.endTime);
    console.log('  date:', updates.date);
    
    // The updates parameter is the full updated activity object from EditActivityDialog
    const activityData = updates;

    // Build API updates object with proper data mapping
    const apiUpdates: any = {};
    
    // Only update fields that are actually provided
    if (activityData.name !== undefined) {
      apiUpdates.title = activityData.name;
    }
    
    if (activityData.note !== undefined) {
      apiUpdates.description = activityData.note;
    }
    
    if (activityData.type !== undefined) {
      apiUpdates.activity_type_id = getActivityTypeId(activityData.type);
    }
    
    // Handle time updates - ensure proper formatting
    if (activityData.date && activityData.startTime) {
      // Ensure time is in HH:mm format before converting to ISO
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (timeRegex.test(activityData.startTime)) {
        apiUpdates.start_time = `${activityData.date}T${activityData.startTime}:00.000Z`;
      } else {
        console.warn('Invalid startTime format:', activityData.startTime);
      }
    }
    
    if (activityData.date && activityData.endTime) {
      // Ensure time is in HH:mm format before converting to ISO
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (timeRegex.test(activityData.endTime)) {
        apiUpdates.end_time = `${activityData.date}T${activityData.endTime}:00.000Z`;
      } else {
        console.warn('Invalid endTime format:', activityData.endTime);
      }
    }
    
    if (activityData.completed !== undefined) {
      apiUpdates.status = activityData.completed ? 'completed' : 'planned';
    }
    
    // Handle metadata separately to avoid overwriting existing metadata
    const metadataUpdates: any = {};
    if (activityData.importance !== undefined) metadataUpdates.importance = activityData.importance;
    if (activityData.color !== undefined) metadataUpdates.color = activityData.color;
    if (activityData.emoji !== undefined) metadataUpdates.emoji = activityData.emoji;
    if (activityData.needEmoji !== undefined) metadataUpdates.needEmoji = activityData.needEmoji;
    if (recurringOptions !== undefined) metadataUpdates.recurring = recurringOptions;
    
    // Only add metadata if there are actual updates
    if (Object.keys(metadataUpdates).length > 0) {
      apiUpdates.metadata = metadataUpdates;
    }
    
    console.log('WeekView: Prepared API updates:', apiUpdates);
    console.log('WeekView: Time values in API format:');
    console.log('  start_time:', apiUpdates.start_time);
    console.log('  end_time:', apiUpdates.end_time);
    
    updateActivityMutation.mutate({ id: numericId, data: apiUpdates });
  }, [updateActivityMutation]);

  const handleActivityDelete = useCallback((activityId: number | string, deleteOption?: DeleteRecurringOption) => {
    const numericId = typeof activityId === 'string' ? parseInt(activityId) : activityId;
    console.log('WeekView deleting activity:', numericId, deleteOption);
    deleteActivityMutation.mutate(numericId);
  }, [deleteActivityMutation]);

  const handleActivityToggle = useCallback((activityId: number | string) => {
    const numericId = typeof activityId === 'string' ? parseInt(activityId) : activityId;
    console.log('WeekView toggling activity:', numericId);
    // Find the activity to toggle
    const activity = weekActivities.find(a => a.id === numericId);
    if (activity) {
      const newStatus = activity.completed ? 'planned' : 'completed';
      updateActivityMutation.mutate({ 
        id: numericId, 
        data: { status: newStatus } 
      });
    }
  }, [weekActivities, updateActivityMutation]);

  return {
    handleActivityCreate,
    handleActivityUpdate,
    handleActivityDelete,
    handleActivityToggle
  };
};