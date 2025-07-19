import { useCallback } from 'react';
import { useActivityOperations } from './useActivityOperations';
import { Activity } from '@/contexts/ActivitiesContext';
import { DeleteRecurringOption, RecurringActivityOptions } from '@/components/calendar/utils/recurringUtils';

/**
 * Adapter hook that provides backwards compatibility with existing interfaces
 * and ensures proper integration between timeline and calendar
 */
export const useActivityOperationsAdapter = (activities: any[] = []) => {
  const baseOperations = useActivityOperations(activities);

  // Adapter for ActivityTimelineComponent interface (Activity object)
  const handleActivityUpdateForTimeline = useCallback((
    updatedActivity: Activity, 
    recurringOptions?: RecurringActivityOptions
  ) => {
    console.log('Timeline update:', updatedActivity.id, 'Status:', updatedActivity.completed);
    baseOperations.handleActivityUpdate(updatedActivity.id, updatedActivity, recurringOptions);
  }, [baseOperations.handleActivityUpdate]);

  // Adapter for EditActivityDialog interface (Activity object)  
  const handleActivityUpdateForEdit = useCallback((
    activity: Activity, 
    recurringOptions?: RecurringActivityOptions
  ) => {
    console.log('Edit dialog update:', activity.id, 'Status:', activity.completed);
    baseOperations.handleActivityUpdate(activity.id, activity, recurringOptions);
  }, [baseOperations.handleActivityUpdate]);

  // Enhanced toggle function with logging
  const handleActivityToggleEnhanced = useCallback((activityId: number | string) => {
    console.log('Activity toggle requested for:', activityId);
    const activity = activities.find(a => a.id === activityId);
    if (activity) {
      console.log('Current completion status:', activity.completed);
    }
    baseOperations.handleActivityToggle(activityId);
  }, [baseOperations.handleActivityToggle, activities]);

  return {
    ...baseOperations,
    handleActivityToggle: handleActivityToggleEnhanced,
    handleActivityUpdateForTimeline,
    handleActivityUpdateForEdit
  };
};