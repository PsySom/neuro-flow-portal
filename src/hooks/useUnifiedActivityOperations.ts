import { useCallback } from 'react';
import { useUpdateActivity, useDeleteActivity, useCreateActivity, useToggleActivityStatus } from '@/hooks/api/useActivities';
import { Activity } from '@/contexts/ActivitiesContext';
import { DeleteRecurringOption, RecurringActivityOptions } from '@/components/calendar/utils/recurringUtils';
import { 
  convertCreateDataToApi, 
  convertUpdateDataToApi, 
  normalizeActivityId,
  ActivityCreateData,
  ActivityUpdateData
} from '@/utils/activityConversion';
import { getCurrentDateString } from '@/utils/dateUtils';
import { useToast } from './use-toast';

/**
 * Unified activity operations hook that consolidates all activity CRUD operations
 * Replaces useActivityOperations, useActivitySync, and useActivityOperationsAdapter
 */
export const useUnifiedActivityOperations = (activities: any[] = []) => {
  const updateActivityMutation = useUpdateActivity();
  const deleteActivityMutation = useDeleteActivity();
  const createActivityMutation = useCreateActivity();
  const toggleActivityStatusMutation = useToggleActivityStatus();
  const { toast } = useToast();

  const handleActivityCreate = useCallback((
    newActivity: ActivityCreateData, 
    recurringOptions?: RecurringActivityOptions
  ) => {
    console.log('Creating activity:', newActivity, 'recurring:', recurringOptions);
    
    const apiData = convertCreateDataToApi(newActivity, recurringOptions);
    return createActivityMutation.mutateAsync(apiData);
  }, [createActivityMutation]);

  const handleActivityUpdate = useCallback((
    activityIdOrActivity: number | string | Activity,
    updatesOrRecurring?: any | RecurringActivityOptions,
    recurringOptions?: RecurringActivityOptions
  ) => {
    let activityId: number | string;
    let updates: any;
    let recurring: RecurringActivityOptions | undefined;

    // Handle different parameter patterns for backward compatibility
    if (typeof activityIdOrActivity === 'object') {
      // Called with Activity object (timeline style)
      activityId = activityIdOrActivity.id;
      updates = activityIdOrActivity;
      recurring = updatesOrRecurring as RecurringActivityOptions;
    } else {
      // Called with separate id and updates (edit dialog style)
      activityId = activityIdOrActivity;
      updates = updatesOrRecurring;
      recurring = recurringOptions;
    }

    console.log('Updating activity:', activityId, updates, 'recurring:', recurring);
    
    const updatedActivity = { ...updates, id: activityId } as ActivityUpdateData;
    const cleanApiUpdates = convertUpdateDataToApi(updatedActivity, recurring);
    const numericId = normalizeActivityId(activityId);
    
    return updateActivityMutation.mutateAsync({ 
      id: numericId, 
      data: cleanApiUpdates 
    });
  }, [updateActivityMutation]);

  const handleActivityDelete = useCallback((
    activityId: number | string, 
    deleteOption?: DeleteRecurringOption
  ) => {
    const numericId = normalizeActivityId(activityId);
    return deleteActivityMutation.mutateAsync(numericId);
  }, [deleteActivityMutation]);

  const handleActivityToggle = useCallback((activityId: number | string) => {
    console.log('Activity toggle requested for:', activityId);
    const numericId = normalizeActivityId(activityId);
    const activity = activities.find(a => a.id === numericId);
    
    if (!activity) {
      console.error('Activity not found for toggle:', activityId);
      toast({
        title: "Ошибка",
        description: "Активность не найдена",
        variant: "destructive",
      });
      return;
    }

    // Ensure activity belongs to current date before allowing toggle
    const currentDate = getCurrentDateString();
    const activityDate = activity.date?.split('T')[0] || activity.date;
    
    if (activityDate !== currentDate) {
      console.warn('Cannot toggle activity from different date:', activityDate, 'vs', currentDate);
      toast({
        title: "Предупреждение", 
        description: "Можно изменять только активности текущего дня",
        variant: "destructive",
      });
      return;
    }

    const currentStatus = activity.status || (activity.completed ? 'completed' : 'planned');
    return toggleActivityStatusMutation.mutateAsync({ 
      activityId: numericId, 
      currentStatus 
    });
  }, [activities, toggleActivityStatusMutation, toast]);

  // Backward compatibility methods
  const handleActivityUpdateForTimeline = useCallback((
    updatedActivity: Activity, 
    recurringOptions?: RecurringActivityOptions
  ) => {
    return handleActivityUpdate(updatedActivity, recurringOptions);
  }, [handleActivityUpdate]);

  const handleActivityUpdateForEdit = useCallback((
    activity: Activity, 
    recurringOptions?: RecurringActivityOptions
  ) => {
    return handleActivityUpdate(activity, recurringOptions);
  }, [handleActivityUpdate]);

  return {
    // Primary interface
    handleActivityCreate,
    handleActivityUpdate,
    handleActivityDelete,
    handleActivityToggle,
    
    // Backward compatibility interface
    handleActivityUpdateForTimeline,
    handleActivityUpdateForEdit,
    
    // Status flags
    isCreating: createActivityMutation.isPending,
    isUpdating: updateActivityMutation.isPending,
    isDeleting: deleteActivityMutation.isPending,
    isToggling: toggleActivityStatusMutation.isPending
  };
};