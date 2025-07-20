import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Activity } from '@/contexts/ActivitiesContext';
import { useCreateActivity, useUpdateActivity, useDeleteActivity, useToggleActivityStatus } from '@/hooks/api/useActivities';
import { DeleteRecurringOption, RecurringActivityOptions } from '@/components/calendar/utils/recurringUtils';
import { createISOFromDateTime } from '@/utils/timeFormatter';

/**
 * Unified hook for activity synchronization across all components
 * Ensures all CRUD operations are handled consistently
 */
export const useActivitySync = () => {
  const queryClient = useQueryClient();
  const createActivityMutation = useCreateActivity();
  const updateActivityMutation = useUpdateActivity();
  const deleteActivityMutation = useDeleteActivity();
  const toggleActivityStatusMutation = useToggleActivityStatus();

  // Invalidate all activity queries to force refresh
  const forceRefresh = useCallback(() => {
    console.log('useActivitySync: Force refreshing all activity queries');
    queryClient.invalidateQueries({ queryKey: ['activities'] });
    queryClient.invalidateQueries({ queryKey: ['activities', 'range'] });
    
    // Also invalidate today's activities specifically
    const today = new Date().toISOString().split('T')[0];
    queryClient.invalidateQueries({ queryKey: ['activities', today] });
    
    // Force refetch to ensure immediate updates
    queryClient.refetchQueries({ queryKey: ['activities'] });
    
    // Add additional logging
    console.log('useActivitySync: Force refresh completed for date:', today);
  }, [queryClient]);

  // Map activity type to API type ID
  const getActivityTypeId = useCallback((type: string) => {
    switch (type) {
      case 'задача': return 1;
      case 'восстановление': return 2;
      case 'нейтральная': return 3;
      case 'смешанная': return 4;
      default: return 1;
    }
  }, []);

  // Create activity with proper data mapping
  const createActivity = useCallback((newActivity: any, recurringOptions?: RecurringActivityOptions) => {
    console.log('useActivitySync: Creating activity:', newActivity, 'with recurring:', recurringOptions);
    
    const activityData = {
      title: newActivity.name,
      description: newActivity.note,
      activity_type_id: getActivityTypeId(newActivity.type),
      start_time: createISOFromDateTime(newActivity.date, newActivity.startTime),
      end_time: newActivity.endTime ? createISOFromDateTime(newActivity.date, newActivity.endTime) : undefined,
      metadata: {
        importance: newActivity.importance,
        color: newActivity.color,
        emoji: newActivity.emoji,
        needEmoji: newActivity.needEmoji,
        ...(recurringOptions && { recurring: recurringOptions })
      }
    };
    
    return createActivityMutation.mutateAsync(activityData).then((result) => {
      // Force refresh all views after create
      forceRefresh();
      return result;
    });
  }, [createActivityMutation, getActivityTypeId, forceRefresh]);

  // Update activity with partial data
  const updateActivity = useCallback((activityId: number | string, updates: Partial<Activity>, recurringOptions?: RecurringActivityOptions) => {
    const numericId = typeof activityId === 'string' ? parseInt(activityId) : activityId;
    console.log('useActivitySync: Updating activity:', numericId, updates, recurringOptions);
    
    // Build update object with only changed fields
    const apiUpdates: any = {};
    
    if (updates.name !== undefined) apiUpdates.title = updates.name;
    if (updates.note !== undefined) apiUpdates.description = updates.note;
    if (updates.type !== undefined) apiUpdates.activity_type_id = getActivityTypeId(updates.type);
    if (updates.completed !== undefined) apiUpdates.status = updates.completed ? 'completed' : 'planned';
    
    // Handle time updates with proper ISO string formatting
    if (updates.date && updates.startTime) {
      apiUpdates.start_time = createISOFromDateTime(updates.date, updates.startTime);
    }
    if (updates.date && updates.endTime) {
      apiUpdates.end_time = createISOFromDateTime(updates.date, updates.endTime);
    }
    
    // Handle metadata updates
    if (updates.importance !== undefined || updates.color !== undefined || 
        updates.emoji !== undefined || updates.needEmoji !== undefined || recurringOptions) {
      
      apiUpdates.metadata = {
        ...(updates.importance !== undefined && { importance: updates.importance }),
        ...(updates.color !== undefined && { color: updates.color }),
        ...(updates.emoji !== undefined && { emoji: updates.emoji }),
        ...(updates.needEmoji !== undefined && { needEmoji: updates.needEmoji }),
        ...(recurringOptions && { recurring: recurringOptions })
      };
    }
    
    return updateActivityMutation.mutateAsync({ id: numericId, data: apiUpdates }).then((result) => {
      // Force refresh all views after update
      forceRefresh();
      return result;
    });
  }, [updateActivityMutation, getActivityTypeId, forceRefresh]);

  // Delete activity
  const deleteActivity = useCallback((id: number | string, deleteOption?: DeleteRecurringOption) => {
    const numericId = typeof id === 'string' ? parseInt(id) : id;
    console.log('useActivitySync: Deleting activity:', numericId, deleteOption);
    return deleteActivityMutation.mutateAsync(numericId).then((result) => {
      // Force refresh all views after delete
      forceRefresh();
      return result;
    });
  }, [deleteActivityMutation, forceRefresh]);

  // Toggle activity status
  const toggleActivityStatus = useCallback((activityId: number | string, currentStatus: string) => {
    const numericId = typeof activityId === 'string' ? parseInt(activityId) : activityId;
    console.log('useActivitySync: Toggling activity status:', numericId, currentStatus);
    return toggleActivityStatusMutation.mutateAsync({ 
      activityId: numericId, 
      currentStatus 
    }).then((result) => {
      // Force refresh all views after toggle
      forceRefresh();
      return result;
    });
  }, [toggleActivityStatusMutation, forceRefresh]);


  return {
    createActivity,
    updateActivity,
    deleteActivity,
    toggleActivityStatus,
    forceRefresh,
    isCreating: createActivityMutation.isPending,
    isUpdating: updateActivityMutation.isPending,
    isDeleting: deleteActivityMutation.isPending,
    isToggling: toggleActivityStatusMutation.isPending
  };
};