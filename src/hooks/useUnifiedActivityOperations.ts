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

/**
 * Unified activity operations hook that consolidates all activity CRUD operations
 * Uses unified service for proper recurring activity handling
 */
export const useUnifiedActivityOperations = (activities: any[] = []) => {
  const { toast } = useToast();

  // Activity Creation with recurring support
  const handleActivityCreate = useCallback(async (
    newActivity: ActivityCreateData, 
    recurringOptions?: RecurringActivityOptions
  ): Promise<any> => {
    console.log('Creating activity:', newActivity, 'recurring:', recurringOptions);
    
    try {
      // Use unified service that properly handles recurring activities
      const { unifiedActivityService } = await import('@/services/unified-activity.service');
      // Convert ActivityCreateData to Activity format for the service
      const activityForService: Activity = { 
        ...newActivity, 
        id: Date.now() + Math.random(), // Temporary ID
        emoji: '📋', // Default emoji
        completed: false, // Default status
        color: newActivity.color || '#3B82F6', // Default color
        importance: newActivity.importance || 1 // Default importance
      };
      const createdActivities = await unifiedActivityService.createActivity(activityForService, recurringOptions);
      
      console.log('Created activities:', createdActivities.length);
      return createdActivities;
    } catch (error) {
      console.error('Error creating activity:', error);
      throw error;
    }
  }, []);

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
      // Use unified service that properly handles recurring activities
      const { unifiedActivityService } = await import('@/services/unified-activity.service');
      const numericId = normalizeActivityId(activityId);
      
      const updatedActivity = await unifiedActivityService.updateActivity(numericId, updates, recurring);
      console.log('Updated activity:', updatedActivity);
      return updatedActivity;
    } catch (error) {
      console.error('Error updating activity:', error);
      throw error;
    }
  }, []);

  const handleActivityDelete = useCallback(async (
    activityId: number | string, 
    deleteOption?: DeleteRecurringOption
  ) => {
    try {
      // Use unified service that properly handles recurring activities
      const { unifiedActivityService } = await import('@/services/unified-activity.service');
      const numericId = normalizeActivityId(activityId);
      
      await unifiedActivityService.deleteActivity(numericId, deleteOption);
      console.log('Deleted activity:', activityId, 'with option:', deleteOption);
    } catch (error) {
      console.error('Error deleting activity:', error);
      throw error;
    }
  }, []);

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
      // Use unified service for consistency
      const { unifiedActivityService } = await import('@/services/unified-activity.service');
      const toggledActivity = await unifiedActivityService.toggleActivityCompletion(numericId);
      
      console.log('Toggled activity:', toggledActivity);
      toast({
        title: "Успешно",
        description: `Активность "${activity.name}" ${toggledActivity.completed ? 'выполнена' : 'отменена'}`,
      });
    } catch (error) {
      console.error('Error toggling activity:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось изменить статус активности",
        variant: "destructive",
      });
    }
  }, [activities, toast]);

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
    
    // Loading states - all operations are now async
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    isToggling: false
  };
};