import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Activity } from '@/contexts/ActivitiesContext';
import { useCreateActivity, useUpdateActivity, useDeleteActivity, useToggleActivityStatus } from '@/hooks/api/useActivities';
import { DeleteRecurringOption, RecurringActivityOptions } from '@/components/calendar/utils/recurringUtils';

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
      start_time: `${newActivity.date}T${newActivity.startTime}:00.000Z`,
      end_time: newActivity.endTime ? `${newActivity.date}T${newActivity.endTime}:00.000Z` : undefined,
      metadata: {
        importance: newActivity.importance,
        color: newActivity.color,
        emoji: newActivity.emoji,
        needEmoji: newActivity.needEmoji,
        ...(recurringOptions && { recurring: recurringOptions })
      }
    };
    
    return createActivityMutation.mutateAsync(activityData);
  }, [createActivityMutation, getActivityTypeId]);

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
      apiUpdates.start_time = `${updates.date}T${updates.startTime}:00.000Z`;
    }
    if (updates.date && updates.endTime) {
      apiUpdates.end_time = `${updates.date}T${updates.endTime}:00.000Z`;
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
    
    return updateActivityMutation.mutateAsync({ id: numericId, data: apiUpdates });
  }, [updateActivityMutation, getActivityTypeId]);

  // Delete activity
  const deleteActivity = useCallback((id: number | string, deleteOption?: DeleteRecurringOption) => {
    const numericId = typeof id === 'string' ? parseInt(id) : id;
    console.log('useActivitySync: Deleting activity:', numericId, deleteOption);
    return deleteActivityMutation.mutateAsync(numericId);
  }, [deleteActivityMutation]);

  // Toggle activity status
  const toggleActivityStatus = useCallback((activityId: number | string, currentStatus: string) => {
    const numericId = typeof activityId === 'string' ? parseInt(activityId) : activityId;
    console.log('useActivitySync: Toggling activity status:', numericId, currentStatus);
    return toggleActivityStatusMutation.mutateAsync({ 
      activityId: numericId, 
      currentStatus 
    });
  }, [toggleActivityStatusMutation]);

  // Invalidate all activity queries to force refresh
  const forceRefresh = useCallback(() => {
    console.log('useActivitySync: Force refreshing all activity queries');
    queryClient.invalidateQueries({ queryKey: ['activities'] });
  }, [queryClient]);

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