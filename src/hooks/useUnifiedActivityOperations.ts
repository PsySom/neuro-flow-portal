import { useCallback } from 'react';
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
import { 
  useCreateActivityApi, 
  useUpdateActivityApi, 
  useDeleteActivityApi, 
  useToggleActivityStatusApi 
} from './api/useActivitiesApi';

/**
 * Unified activity operations hook that consolidates all activity CRUD operations
 * Uses unified service for proper recurring activity handling
 */
export const useUnifiedActivityOperations = (activities: any[] = []) => {
  const { toast } = useToast();
  
  // Use API mutations with proper cache invalidation
  const createActivityMutation = useCreateActivityApi();
  const updateActivityMutation = useUpdateActivityApi();
  const deleteActivityMutation = useDeleteActivityApi();
  const toggleActivityMutation = useToggleActivityStatusApi();

  // Activity Creation with recurring support
  const handleActivityCreate = useCallback(async (
    newActivity: ActivityCreateData, 
    recurringOptions?: RecurringActivityOptions
  ): Promise<any> => {
    console.log('Creating activity:', newActivity, 'recurring:', recurringOptions);
    
    try {
      // Convert to API format
      const apiData = convertCreateDataToApi(newActivity);
      
      // Create main activity using mutation (with cache invalidation)
      const result = await createActivityMutation.mutateAsync(apiData);
      
      // Handle recurring activities if specified
      if (recurringOptions && recurringOptions.type !== 'none') {
        console.log('Creating recurring activities with options:', recurringOptions);
        // TODO: Implement recurring activity creation through API
      }
      
      console.log('Activity created successfully:', result);
      return result;
    } catch (error) {
      console.error('Error creating activity:', error);
      throw error;
    }
  }, [createActivityMutation]);

  // Activity Update with recurring support
  const handleActivityUpdate = useCallback(async (
    activityIdOrActivity: number | string | Activity,
    updatesOrRecurring?: any | RecurringActivityOptions,
    recurringOptions?: RecurringActivityOptions
  ): Promise<any> => {
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
    
    try {
      const numericId = normalizeActivityId(activityId);
      const apiData = convertUpdateDataToApi(updates);
      
      // Update using mutation (with cache invalidation)
      const result = await updateActivityMutation.mutateAsync({ id: numericId, data: apiData });
      
      // Handle recurring updates if specified
      if (recurring && recurring.type !== 'none') {
        console.log('Updating recurring activities with options:', recurring);
        // TODO: Implement recurring activity updates through API
      }
      
      console.log('Activity updated successfully:', result);
      return result;
    } catch (error) {
      console.error('Error updating activity:', error);
      throw error;
    }
  }, [updateActivityMutation]);

  const handleActivityDelete = useCallback(async (
    activityId: number | string, 
    deleteOption: DeleteRecurringOption = 'single'
  ) => {
    console.log('Deleting activity:', activityId, 'with option:', deleteOption);
    
    try {
      const numericId = normalizeActivityId(activityId);
      
      // Delete using mutation (with cache invalidation)
      await deleteActivityMutation.mutateAsync(numericId);
      
      // Handle recurring deletions if specified
      if (deleteOption === 'all') {
        console.log('Deleting all recurring activities for:', numericId);
        // TODO: Implement deletion of all recurring activities through API
      }
      
      console.log('Activity deleted successfully:', numericId);
    } catch (error) {
      console.error('Error deleting activity:', error);
      throw error;
    }
  }, [deleteActivityMutation]);

  const handleActivityToggle = useCallback(async (activityId: number | string) => {
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

    try {
      // Toggle using mutation (with cache invalidation and optimistic updates)
      await toggleActivityMutation.mutateAsync({
        activityId: numericId,
        currentStatus: activity.completed ? 'completed' : 'planned'
      });
      
      console.log('Activity toggle completed for:', numericId);
    } catch (error) {
      console.error('Error toggling activity:', error);
      // Error handling is done in the mutation itself
    }
  }, [activities, toast, toggleActivityMutation]);

  // Backward compatibility wrappers
  const handleActivityUpdateForTimeline = useCallback((
    activity: Activity,
    recurringOptions?: RecurringActivityOptions
  ) => {
    return handleActivityUpdate(activity, recurringOptions);
  }, [handleActivityUpdate]);

  const handleActivityUpdateForEdit = useCallback((
    activityId: number | string,
    updates: Partial<Activity>,
    recurringOptions?: RecurringActivityOptions
  ) => {
    return handleActivityUpdate(activityId, updates, recurringOptions);
  }, [handleActivityUpdate]);

  return {
    // Primary handlers
    handleActivityCreate,
    handleActivityUpdate,
    handleActivityDelete,
    handleActivityToggle,
    
    // Backward compatibility wrappers
    handleActivityUpdateForTimeline,
    handleActivityUpdateForEdit,
    
    // Loading states from mutations
    isCreating: createActivityMutation.isPending,
    isUpdating: updateActivityMutation.isPending,
    isDeleting: deleteActivityMutation.isPending,
    isToggling: toggleActivityMutation.isPending
  };
};