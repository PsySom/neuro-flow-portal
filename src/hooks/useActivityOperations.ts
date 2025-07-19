import { useCallback } from 'react';
import { useUpdateActivity, useDeleteActivity, useCreateActivity } from '@/hooks/api/useActivities';
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
 * Custom hook that provides standardized activity operations
 */
export const useActivityOperations = (activities: any[] = []) => {
  const updateActivityMutation = useUpdateActivity();
  const deleteActivityMutation = useDeleteActivity();
  const createActivityMutation = useCreateActivity();
  const { toast } = useToast();

  const handleActivityCreate = useCallback((
    newActivity: ActivityCreateData, 
    recurringOptions?: RecurringActivityOptions
  ) => {
    console.log('Creating activity:', newActivity, 'recurring:', recurringOptions);
    
    const apiData = convertCreateDataToApi(newActivity, recurringOptions);
    createActivityMutation.mutate(apiData);
  }, [createActivityMutation]);

  const handleActivityUpdate = useCallback((
    activityId: number | string,
    updates: any, 
    recurringOptions?: RecurringActivityOptions
  ) => {
    const updatedActivity = { ...updates, id: activityId } as ActivityUpdateData;
    console.log('Updating activity:', updatedActivity.id, updatedActivity, 'recurring:', recurringOptions);
    
    const cleanApiUpdates = convertUpdateDataToApi(updatedActivity, recurringOptions);
    const numericId = normalizeActivityId(updatedActivity.id);
    
    console.log('Sending update request:', cleanApiUpdates);
    updateActivityMutation.mutate({ 
      id: numericId, 
      data: cleanApiUpdates 
    });
  }, [updateActivityMutation]);

  const handleActivityDelete = useCallback((
    activityId: number | string, 
    deleteOption?: DeleteRecurringOption
  ) => {
    const numericId = normalizeActivityId(activityId);
    deleteActivityMutation.mutate(numericId);
  }, [deleteActivityMutation]);

  const handleActivityToggle = useCallback((activityId: number | string) => {
    console.log('Activity operations: Toggle requested for activity:', activityId);
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

    const newStatus = activity.status === 'completed' ? 'planned' : 'completed';
    console.log('Toggling activity status from', activity.status, 'to', newStatus);
    
    updateActivityMutation.mutate({ 
      id: numericId, 
      data: { status: newStatus } 
    });
  }, [activities, updateActivityMutation, toast]);

  return {
    handleActivityCreate,
    handleActivityUpdate,
    handleActivityDelete,
    handleActivityToggle,
    isCreating: createActivityMutation.isPending,
    isUpdating: updateActivityMutation.isPending,
    isDeleting: deleteActivityMutation.isPending
  };
};